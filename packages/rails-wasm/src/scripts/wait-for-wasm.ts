import fs from 'node:fs/promises';
import path from 'node:path';

export interface WasmWaitOptions {
  targetDir?: string;
  wasmFile?: string;
  logFile?: string;
  statusTimeout?: number;
  overallTimeout?: number;
}

export async function checkIfFileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch (error: any) {
    console.log(`✗ Failed to access ${filePath}: ${error.message}`);
    return false;
  }
}

export async function moveFile(src: string, dest: string): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.rename(src, dest);
    console.log(`✓ Moved ${src} to ${dest}`);

    return true;
  } catch (error: any) {
    console.error(`✗ Failed to move ${src} to ${dest}:`, error.message);
    return false;
  }
}

export async function waitForWasm(options: WasmWaitOptions = {}): Promise<void> {
  const {
    targetDir = 'node_modules/@ruby/wasm-wasi/dist',
    wasmFile = 'ruby.wasm',
    logFile = 'ruby.wasm.log.txt',
    statusTimeout = 30000,
    overallTimeout = 300000,
  } = options;

  const TARGET_FILE = path.join(targetDir, 'ruby.wasm');
  const WASM_FILE = wasmFile;
  const LOG_FILE = logFile;

  let lastStatus: string | undefined;

  async function checkWasmLoaded(): Promise<boolean> {
    if (await checkIfFileExists(TARGET_FILE)) {
      return true;
    }

    if (!(await checkIfFileExists(LOG_FILE))) {
      return false;
    }

    lastStatus = await fs.readFile(LOG_FILE, { encoding: 'utf8' });
    console.log(`[ruby.wasm] ${lastStatus}`);

    if (lastStatus === 'status: done') {
      await moveFile(WASM_FILE, TARGET_FILE);
      return true;
    }

    return false;
  }

  await new Promise<void>((resolve, reject) => {
    const startTime = Date.now();

    async function checkAndScheduleNext() {
      try {
        if (await checkWasmLoaded()) {
          console.log(`[ruby.wasm] ready`);
          resolve();

          return;
        }

        const elapsed = Date.now() - startTime;

        // check if we've exceeded the status timeout and still no status
        if (elapsed > statusTimeout && !lastStatus) {
          reject(new Error('Timeout waiting for wasm download to start'));
          return;
        }

        // check if we've exceeded the overall timeout
        if (elapsed > overallTimeout) {
          reject(new Error('Timeout waiting for wasm to load'));
          return;
        }

        // schedule next check
        setTimeout(checkAndScheduleNext, 1000);
      } catch (error) {
        reject(error);
      }
    }

    // start the checking process
    checkAndScheduleNext();
  });
}
