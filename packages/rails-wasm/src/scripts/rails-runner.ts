import fs from 'node:fs';
import path from 'node:path';
import { spawn, type ChildProcess } from 'node:child_process';

export interface RailsRunnerOptions {
  /** Directory containing the Rails application */
  railsRootDir: string;
  /** Path to look for bin/rails */
  binPath?: string;
  /** Timeout in ms to wait for bin/rails to be available (default: 30000) */
  timeout?: number;
}

/**
 * Wait for the Rails bin/rails script to become executable.
 *
 * This is useful during installation when files are being copied
 * and the Rails executable might not be ready immediately.
 */
async function waitBinRails(railsPath: string, timeoutMs: number): Promise<void> {
  const startTime = Date.now();

  for (;;) {
    if (Date.now() - startTime > timeoutMs) {
      console.error('Timeout waiting for rails script');
      throw new Error('Timed out to wait for bin/rails');
    }

    const found = await new Promise<boolean>((resolve) => {
      fs.access(railsPath, fs.constants.X_OK, (err) => {
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      });
    });

    if (found) return;

    await new Promise<void>((resolve) => setTimeout(resolve, 500));
  }
}

/**
 * Run a Rails command by spawning the bin/rails script.
 *
 * This script waits for the Rails executable to be available,
 * then spawns it with the provided arguments. It's useful for
 * build-time operations where Rails might not be immediately available.
 *
 * @example
 * ```typescript
 * import { spawnRails } from 'rails-wasm/scripts';
 *
 * const exitCode = await spawnRails({
 *   railsRootDir: './workspace/store',
 *   args: ['db:migrate']
 * });
 * ```
 */
export async function spawnRails(
  options: RailsRunnerOptions,
  args: string[] = []
): Promise<number> {
  const { railsRootDir, timeout = 30000 } = options;
  const railsPath = path.join(railsRootDir, 'bin/rails');

  await waitBinRails(railsPath, timeout);

  return new Promise((resolve, reject) => {
    const railsProcess: ChildProcess = spawn('rails', args, {
      stdio: 'inherit',
      cwd: railsRootDir,
      env: {
        ...process.env,
        PATH: '/home/tutorial/bin:/bin:/usr/bin:/usr/local/bin',
      },
    });

    railsProcess.on('error', (err) => {
      console.error('Failed to start rails script:', err);
      reject(err);
    });

    railsProcess.on('close', (code) => {
      resolve(code ?? 0);
    });
  });
}

/**
 * CLI entry point for rails-runner script.
 */
export async function main(): Promise<void> {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const railsRootDir = path.join(__dirname, '../workspace/store');

  const exitCode = await spawnRails(
    { railsRootDir },
    process.argv.slice(2)
  );

  process.exit(exitCode);
}
