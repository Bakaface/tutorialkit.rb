import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { join } from 'node:path';

export interface RailsRunnerOptions {
  railsRootDir?: string;
  timeout?: number;
  env?: Record<string, string>;
}

export async function waitForRails(options: RailsRunnerOptions = {}): Promise<void> {
  const { railsRootDir = 'workspace/store', timeout = 30000 } = options;
  const railsPath = join(railsRootDir, 'bin/rails');

  const startTime = Date.now();

  while (true) {
    if (Date.now() - startTime > timeout) {
      console.error('Timeout waiting for rails script');
      throw new Error('Timed out waiting for bin/rails');
    }

    const found = await new Promise<boolean>((resolve) => {
      fs.access(railsPath, fs.constants.X_OK, (err) => {
        resolve(!err);
      });
    });

    if (found) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

export async function runRails(args: string[], options: RailsRunnerOptions = {}): Promise<void> {
  const { railsRootDir = 'workspace/store', env = {} } = options;

  await waitForRails(options);

  const railsProcess = spawn('rails', args, {
    stdio: 'inherit',
    cwd: railsRootDir,
    env: {
      PATH: '/home/tutorial/bin:/bin:/usr/bin:/usr/local/bin',
      ...env,
    },
  });

  return new Promise<void>((resolve, reject) => {
    railsProcess.on('error', (err) => {
      console.error('Failed to start rails script:', err);
      reject(err);
    });

    railsProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Rails process exited with code ${code}`));
      }
    });
  });
}
