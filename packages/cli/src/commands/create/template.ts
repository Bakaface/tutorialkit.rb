import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import * as prompts from '@clack/prompts';
import ignore from 'ignore';
import { warnLabel } from '../../utils/messages.js';
import { templatePath, type CreateOptions } from './options.js';

export async function copyTemplate(dest: string, flags: CreateOptions) {
  if (flags.dryRun) {
    prompts.log.warn(`${warnLabel('DRY RUN')} Skipped copying template`);
    return;
  }

  const gitignore = ignore.default().add(readIgnoreFile());

  const toCopy: string[] = [];
  const folders = await fsPromises.readdir(templatePath);

  for (const file of folders) {
    if (gitignore.ignores(file)) {
      continue;
    }

    toCopy.push(file);
  }

  for (const fileName of toCopy) {
    const sourceFilePath = path.join(templatePath, fileName);
    const destFileName = fileName === '.npmignore' ? '.gitignore' : fileName;
    const destFilePath = path.join(dest, destFileName);

    const stats = await fsPromises.stat(sourceFilePath);

    if (stats.isDirectory()) {
      await fsPromises.cp(sourceFilePath, destFilePath, { recursive: true });
    } else if (stats.isFile()) {
      await fsPromises.copyFile(sourceFilePath, destFilePath);
    }
  }

  // Set executable permissions on bin scripts
  // (npm packaging doesn't preserve executable bits reliably)
  await setExecutablePermissions(dest);
}

async function setExecutablePermissions(dest: string) {
  const binScripts = [
    path.join(dest, 'bin', 'build-wasm'),
    path.join(dest, 'ruby-wasm', 'bin', 'pack'),
    // Node.js wrapper scripts for Rails in WebContainer
    path.join(dest, 'src', 'templates', 'default', 'bin', 'rails'),
    path.join(dest, 'src', 'templates', 'default', 'bin', 'ruby'),
    path.join(dest, 'src', 'templates', 'default', 'bin', 'console'),
    path.join(dest, 'src', 'templates', 'default', 'bin', 'rackup'),
  ];

  for (const script of binScripts) {
    try {
      await fsPromises.chmod(script, 0o755);
    } catch {
      // Script may not exist in some templates, ignore
    }
  }
}

function readIgnoreFile() {
  try {
    // we try to read the `.npmignore` first because npm unpacks `.gitignore` as `.npmignore`
    return fs.readFileSync(path.resolve(templatePath, '.npmignore'), 'utf8');
  } catch {
    return fs.readFileSync(path.resolve(templatePath, '.gitignore'), 'utf8');
  }
}
