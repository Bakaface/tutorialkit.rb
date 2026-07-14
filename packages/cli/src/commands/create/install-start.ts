import * as prompts from '@clack/prompts';
import { execa } from 'execa';
import { warnLabel } from '../../utils/messages.js';
import { assertNotCanceled } from '../../utils/tasks.js';
import { DEFAULT_VALUES, readFlag, type CreateOptions } from './options.js';
import { type PackageManager } from './package-manager.js';

export async function promptInstallDependencies(flags: CreateOptions): Promise<boolean> {
  const installDeps = readFlag(flags, 'install');

  if (installDeps !== undefined) {
    return installDeps;
  }

  const answer = await prompts.confirm({
    message: 'Install dependencies?',
    initialValue: DEFAULT_VALUES.install,
  });

  assertNotCanceled(answer);

  return answer;
}

export async function installDependencies(cwd: string, packageManager: PackageManager, flags: CreateOptions) {
  if (flags.dryRun) {
    console.warn(`${warnLabel('DRY RUN')} Skipped dependency installation`);
    return;
  }

  await execa(packageManager ?? DEFAULT_VALUES.packageManager, ['install'], { cwd, stdio: 'inherit' });
}
