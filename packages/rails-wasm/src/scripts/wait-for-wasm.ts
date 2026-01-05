import fs from 'node:fs/promises';
import path from 'node:path';

export interface WaitForWasmOptions {
  /** Target directory where ruby.wasm should be placed */
  targetDir: string;
  /** Source file path for the downloaded ruby.wasm */
  wasmFile: string;
  /** Log file path that indicates download status */
  logFile: string;
  /** Timeout in ms to start seeing status (default: 30000) */
  statusTimeout?: number;
  /** Overall timeout in ms (default: 300000 / 5 minutes) */
  overallTimeout?: number;
}

async function checkIfFileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    const err = error as Error;
    console.log(`✗ Failed to access ${filePath}: ${err.message}`);
    return false;
  }
}

async function moveFile(src: string, dest: string): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.rename(src, dest);
    console.log(`✓ Moved ${src} to ${dest}`);
    return true;
  } catch (error) {
    const err = error as Error;
    console.error(`✗ Failed to move ${src} to ${dest}:`, err.message);
    return false;
  }
}

/**
 * Wait for the Ruby WASM binary to be downloaded and moved to the target location.
 *
 * This is typically used as a postinstall script to wait for a large WASM binary
 * to be downloaded in the background.
 *
 * @example
 * ```typescript
 * import { waitForWasm } from 'rails-wasm/scripts';
 *
 * await waitForWasm({
 *   targetDir: './node_modules/@ruby/wasm-wasi/dist',
 *   wasmFile: './ruby.wasm',
 *   logFile: './ruby.wasm.log.txt'
 * });
 * ```
 */
export async function waitForWasm(options: WaitForWasmOptions): Promise<void> {
  const {
    targetDir,
    wasmFile,
    logFile,
    statusTimeout = 30000,
    overallTimeout = 300000,
  } = options;

  const targetFile = path.join(targetDir, 'ruby.wasm');
  let lastStatus: string | undefined;

  async function checkWasmLoaded(): Promise<boolean> {
    if (await checkIfFileExists(targetFile)) {
      return true;
    }

    if (!(await checkIfFileExists(logFile))) {
      return false;
    }

    lastStatus = await fs.readFile(logFile, { encoding: 'utf8' });
    console.log(`[ruby.wasm] ${lastStatus}`);

    if (lastStatus === 'status: done') {
      await moveFile(wasmFile, targetFile);
      return true;
    }

    return false;
  }

  await new Promise<void>((resolve, reject) => {
    const startTime = Date.now();

    async function checkAndScheduleNext(): Promise<void> {
      try {
        if (await checkWasmLoaded()) {
          console.log(`[ruby.wasm] ready`);
          resolve();
          return;
        }

        const elapsed = Date.now() - startTime;

        // Check if we've exceeded the status timeout and still no status
        if (elapsed > statusTimeout && !lastStatus) {
          reject(new Error('Timeout waiting for wasm download to start'));
          return;
        }

        // Check if we've exceeded the overall timeout
        if (elapsed > overallTimeout) {
          reject(new Error('Timeout waiting for wasm to load'));
          return;
        }

        // Schedule next check
        setTimeout(checkAndScheduleNext, 1000);
      } catch (error) {
        reject(error);
      }
    }

    // Start the checking process
    checkAndScheduleNext();
  });
}

/**
 * CLI entry point for wait-for-wasm script.
 */
export async function main(): Promise<void> {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);

  await waitForWasm({
    targetDir: path.join(__dirname, '../node_modules/@ruby/wasm-wasi/dist'),
    wasmFile: path.join(__dirname, '../ruby.wasm'),
    logFile: path.join(__dirname, '../ruby.wasm.log.txt'),
  });
}
