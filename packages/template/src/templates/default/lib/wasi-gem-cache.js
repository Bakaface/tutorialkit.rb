/**
 * WASI Syscall Proxy for Gem File Caching
 *
 * Pre-reads all gem files into a JS Map, then intercepts WASI filesystem
 * syscalls to serve cached files from memory. This eliminates ~70,000+
 * WASM-to-JS boundary crossings during Rails boot (mostly failing stat calls
 * across 87 $LOAD_PATH entries).
 *
 * Target: Rails boot from ~112s to <5s.
 */

import fs from 'node:fs/promises';
import { join } from 'node:path';

// WASI errno constants
const ERRNO_SUCCESS = 0;
const ERRNO_BADF = 8;
const ERRNO_NOENT = 44;

// WASI filetype constants
const FILETYPE_DIRECTORY = 3;
const FILETYPE_REGULAR_FILE = 4;

// Virtual fd base — well above real WASI fds (which grow from ~5)
const VIRTUAL_FD_BASE = 100000;

// The gems preopen fd — preopens are ordered by insertion:
// fd 3 = /workspace, fd 4 = /gems
const GEMS_FD = 4;

/**
 * Recursively walk a directory and read all files into memory.
 *
 * @param {string} gemsDir - Host path to workspace/.gems/
 * @param {object} [progress] - Optional BootProgress instance
 * @returns {Promise<{files: Map<string, Uint8Array>, dirs: Set<string>}>}
 */
export async function buildGemCache(gemsDir, progress) {
  const files = new Map();
  const dirs = new Set();

  // Add root
  dirs.add('');

  let fileCount = 0;

  async function walk(dir, prefix) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        dirs.add(relativePath);
        await walk(fullPath, relativePath);
      } else if (entry.isFile()) {
        const data = await fs.readFile(fullPath);
        files.set(relativePath, new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
        fileCount++;

        if (fileCount % 500 === 0 && progress) {
          progress.log(`[cache] Read ${fileCount} files...`);
        }
      }
    }
  }

  await walk(gemsDir, '');

  if (progress) {
    let totalBytes = 0;

    for (const data of files.values()) {
      totalBytes += data.byteLength;
    }

    progress.log(`[cache] Built cache: ${files.size} files, ${dirs.size} dirs, ${(totalBytes / 1024 / 1024).toFixed(1)}MB`);
  }

  return { files, dirs };
}

/**
 * Normalize a path by resolving `.` and `..` components.
 */
function normalizePath(path) {
  const parts = path.split('/');
  const result = [];

  for (const part of parts) {
    if (part === '' || part === '.') {
      continue;
    }

    if (part === '..') {
      result.pop();
    } else {
      result.push(part);
    }
  }

  return result.join('/');
}

/**
 * Write a WASI filestat struct (64 bytes) into WASM memory.
 *
 * Layout (all little-endian):
 *   Offset  0: dev       (u64)
 *   Offset  8: ino       (u64)
 *   Offset 16: filetype  (u8)
 *   Offset 17-23: padding
 *   Offset 24: nlink     (u64)
 *   Offset 32: size      (u64)
 *   Offset 40: atim      (u64)
 *   Offset 48: mtim      (u64)
 *   Offset 56: ctim      (u64)
 */
function writeFilestat(view, offset, filetype, size) {
  // Zero all 64 bytes first
  for (let i = 0; i < 64; i += 4) {
    view.setUint32(offset + i, 0, true);
  }

  // filetype at offset 16
  view.setUint8(offset + 16, filetype);

  // nlink at offset 24
  view.setBigUint64(offset + 24, 1n, true);

  // size at offset 32
  view.setBigUint64(offset + 32, BigInt(size), true);
}

/**
 * Write a WASI fdstat struct (24 bytes) into WASM memory.
 *
 * Layout (all little-endian):
 *   Offset  0: filetype         (u8)
 *   Offset  1: padding          (u8)
 *   Offset  2: flags            (u16)
 *   Offset  4: padding          (u32)
 *   Offset  8: rights_base      (u64)
 *   Offset 16: rights_inheriting (u64)
 */
function writeFdstat(view, offset, filetype) {
  // Zero all 24 bytes
  for (let i = 0; i < 24; i += 4) {
    view.setUint32(offset + i, 0, true);
  }

  // filetype
  view.setUint8(offset, filetype);

  // rights_base — all rights
  view.setBigUint64(offset + 8, 0xFFFFFFFFFFFFFFFFn, true);

  // rights_inheriting — all rights
  view.setBigUint64(offset + 16, 0xFFFFFFFFFFFFFFFFn, true);
}

/**
 * Create a WASI proxy that intercepts filesystem syscalls for gem files.
 *
 * @param {object} originalWasi - The original WASI wasiImport object
 * @param {object} cache - Cache from buildGemCache ({files, dirs})
 * @param {object} [options] - Options
 * @param {object} [options.progress] - BootProgress instance for logging
 * @returns {object} Proxy object to use as wasi_snapshot_preview1 imports
 */
export function createGemCacheProxy(originalWasi, cache, options = {}) {
  const { progress } = options;

  // WASM memory — set via _setMemory() after instantiation
  let memory = null;

  // Virtual fd tracking
  let nextVirtualFd = VIRTUAL_FD_BASE;
  const virtualFds = new Map(); // fd → { data, position, path }

  // Stats
  let pathStatHits = 0;
  let pathStatMisses = 0;
  let pathOpenHits = 0;
  let fdReadOps = 0;
  let delegatedCalls = 0;

  const decoder = new TextDecoder();

  /**
   * Read a string from WASM memory.
   */
  function readString(ptr, len) {
    const bytes = new Uint8Array(memory.buffer, ptr, len);
    return decoder.decode(bytes);
  }

  // Build the proxy by spreading original and overriding specific functions
  const proxy = {
    ...originalWasi,

    /**
     * path_filestat_get(fd, flags, path_ptr, path_len, buf) → errno
     *
     * For gems fd: look up in cache, return stat or NOENT.
     * Cache is complete — a miss means the file doesn't exist.
     */
    path_filestat_get(fd, flags, pathPtr, pathLen, buf) {
      if (fd !== GEMS_FD) {
        delegatedCalls++;
        return originalWasi.path_filestat_get(fd, flags, pathPtr, pathLen, buf);
      }

      const rawPath = readString(pathPtr, pathLen);
      const path = normalizePath(rawPath);
      const view = new DataView(memory.buffer);

      // Check files first
      const fileData = cache.files.get(path);

      if (fileData !== undefined) {
        pathStatHits++;
        writeFilestat(view, buf, FILETYPE_REGULAR_FILE, fileData.byteLength);
        return ERRNO_SUCCESS;
      }

      // Check directories
      if (cache.dirs.has(path)) {
        pathStatHits++;
        writeFilestat(view, buf, FILETYPE_DIRECTORY, 0);
        return ERRNO_SUCCESS;
      }

      // Cache is complete — file doesn't exist
      pathStatMisses++;
      return ERRNO_NOENT;
    },

    /**
     * path_open(fd, dirflags, path_ptr, path_len, oflags, rights_base,
     *           rights_inheriting, fdflags, fd_out) → errno
     *
     * For gems fd: open file from cache as virtual fd.
     * Directory opens delegate to real WASI (fd_readdir is complex).
     */
    path_open(fd, dirflags, pathPtr, pathLen, oflags, rightsBase, rightsInheriting, fdflags, fdOut) {
      if (fd !== GEMS_FD) {
        delegatedCalls++;
        return originalWasi.path_open(fd, dirflags, pathPtr, pathLen, oflags, rightsBase, rightsInheriting, fdflags, fdOut);
      }

      const rawPath = readString(pathPtr, pathLen);
      const path = normalizePath(rawPath);

      // Directory opens delegate to real WASI
      if (cache.dirs.has(path)) {
        delegatedCalls++;
        return originalWasi.path_open(fd, dirflags, pathPtr, pathLen, oflags, rightsBase, rightsInheriting, fdflags, fdOut);
      }

      const fileData = cache.files.get(path);

      if (fileData === undefined) {
        return ERRNO_NOENT;
      }

      // Allocate virtual fd
      const vfd = nextVirtualFd++;
      virtualFds.set(vfd, { data: fileData, position: 0, path });
      pathOpenHits++;

      // Write fd to output pointer
      const view = new DataView(memory.buffer);
      view.setUint32(fdOut, vfd, true);

      return ERRNO_SUCCESS;
    },

    /**
     * fd_read(fd, iovs_ptr, iovs_len, nread_out) → errno
     *
     * For virtual fds: copy bytes from cached Uint8Array into WASM iovecs.
     */
    fd_read(fd, iovsPtr, iovsLen, nreadOut) {
      const vfd = virtualFds.get(fd);

      if (!vfd) {
        delegatedCalls++;
        return originalWasi.fd_read(fd, iovsPtr, iovsLen, nreadOut);
      }

      fdReadOps++;
      const view = new DataView(memory.buffer);
      const memBytes = new Uint8Array(memory.buffer);
      let totalRead = 0;

      for (let i = 0; i < iovsLen; i++) {
        const iovecOffset = iovsPtr + i * 8;
        const bufPtr = view.getUint32(iovecOffset, true);
        const bufLen = view.getUint32(iovecOffset + 4, true);

        const remaining = vfd.data.byteLength - vfd.position;
        const toRead = Math.min(bufLen, remaining);

        if (toRead > 0) {
          memBytes.set(vfd.data.subarray(vfd.position, vfd.position + toRead), bufPtr);
          vfd.position += toRead;
          totalRead += toRead;
        }

        if (remaining <= bufLen) {
          break;
        }
      }

      view.setUint32(nreadOut, totalRead, true);
      return ERRNO_SUCCESS;
    },

    /**
     * fd_pread(fd, iovs_ptr, iovs_len, offset, nread_out) → errno
     *
     * Positional read — like fd_read but at an explicit offset.
     * Many WASI libc implementations use pread() for file reading.
     */
    fd_pread(fd, iovsPtr, iovsLen, offset, nreadOut) {
      const vfd = virtualFds.get(fd);

      if (!vfd) {
        delegatedCalls++;
        return originalWasi.fd_pread(fd, iovsPtr, iovsLen, offset, nreadOut);
      }

      fdReadOps++;
      const view = new DataView(memory.buffer);
      const memBytes = new Uint8Array(memory.buffer);
      let pos = Number(offset);
      let totalRead = 0;

      for (let i = 0; i < iovsLen; i++) {
        const iovecOffset = iovsPtr + i * 8;
        const bufPtr = view.getUint32(iovecOffset, true);
        const bufLen = view.getUint32(iovecOffset + 4, true);

        const remaining = vfd.data.byteLength - pos;
        const toRead = Math.min(bufLen, remaining);

        if (toRead > 0) {
          memBytes.set(vfd.data.subarray(pos, pos + toRead), bufPtr);
          pos += toRead;
          totalRead += toRead;
        }

        if (remaining <= bufLen) {
          break;
        }
      }

      view.setUint32(nreadOut, totalRead, true);
      return ERRNO_SUCCESS;
    },

    /**
     * fd_tell(fd, offset_out) → errno
     *
     * Return the current file position.
     */
    fd_tell(fd, offsetOut) {
      const vfd = virtualFds.get(fd);

      if (!vfd) {
        delegatedCalls++;
        return originalWasi.fd_tell(fd, offsetOut);
      }

      const view = new DataView(memory.buffer);
      view.setBigUint64(offsetOut, BigInt(vfd.position), true);
      return ERRNO_SUCCESS;
    },

    /**
     * fd_close(fd) → errno
     */
    fd_close(fd) {
      if (virtualFds.has(fd)) {
        virtualFds.delete(fd);
        return ERRNO_SUCCESS;
      }

      delegatedCalls++;
      return originalWasi.fd_close(fd);
    },

    /**
     * fd_seek(fd, offset, whence, newoffset_out) → errno
     *
     * whence: 0=SET, 1=CUR, 2=END
     */
    fd_seek(fd, offset, whence, newoffsetOut) {
      const vfd = virtualFds.get(fd);

      if (!vfd) {
        delegatedCalls++;
        return originalWasi.fd_seek(fd, offset, whence, newoffsetOut);
      }

      const fileSize = vfd.data.byteLength;
      let newPos;

      switch (whence) {
        case 0: // SET
          newPos = Number(offset);
          break;
        case 1: // CUR
          newPos = vfd.position + Number(offset);
          break;
        case 2: // END
          newPos = fileSize + Number(offset);
          break;
        default:
          return ERRNO_BADF;
      }

      vfd.position = Math.max(0, Math.min(newPos, fileSize));

      const view = new DataView(memory.buffer);
      view.setBigUint64(newoffsetOut, BigInt(vfd.position), true);

      return ERRNO_SUCCESS;
    },

    /**
     * fd_fdstat_get(fd, buf) → errno
     */
    fd_fdstat_get(fd, buf) {
      if (!virtualFds.has(fd)) {
        delegatedCalls++;
        return originalWasi.fd_fdstat_get(fd, buf);
      }

      const view = new DataView(memory.buffer);
      writeFdstat(view, buf, FILETYPE_REGULAR_FILE);
      return ERRNO_SUCCESS;
    },

    /**
     * fd_fdstat_set_flags(fd, flags) → errno
     *
     * Set fd flags (e.g. O_NONBLOCK). No-op for virtual fds.
     */
    fd_fdstat_set_flags(fd, flags) {
      if (!virtualFds.has(fd)) {
        delegatedCalls++;
        return originalWasi.fd_fdstat_set_flags(fd, flags);
      }

      return ERRNO_SUCCESS;
    },

    /**
     * fd_filestat_get(fd, buf) → errno
     */
    fd_filestat_get(fd, buf) {
      const vfd = virtualFds.get(fd);

      if (!vfd) {
        delegatedCalls++;
        return originalWasi.fd_filestat_get(fd, buf);
      }

      const view = new DataView(memory.buffer);
      writeFilestat(view, buf, FILETYPE_REGULAR_FILE, vfd.data.byteLength);
      return ERRNO_SUCCESS;
    },

    /**
     * Set the WASM memory reference. Called from setMemory callback.
     */
    _setMemory(mem) {
      memory = mem;
    },

    /**
     * Log cache statistics.
     */
    _logStats() {
      const total = pathStatHits + pathStatMisses;
      const hitRate = total > 0 ? ((pathStatHits / total) * 100).toFixed(1) : '0';

      const msg = `WASI cache: ${pathStatHits} stat hits, ${pathStatMisses} stat misses (${hitRate}% hit rate), ` +
        `${pathOpenHits} file opens, ${fdReadOps} reads, ${delegatedCalls} delegated`;

      if (progress) {
        progress.log(msg);
      }

      console.log(`[wasi-cache] ${msg}`);
    },
  };

  return proxy;
}
