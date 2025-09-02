import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';
import fsExtra from 'fs-extra';
import ignore from 'ignore';
import { distFolder, templateDest, templatePath } from './_constants.js';
import { success } from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseVersion = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')).version;
const forkVersion = process.env.FORK_VERSION;
const version = forkVersion ? `${baseVersion}-rb.${forkVersion}` : baseVersion;
const env = { ...process.env, COREPACK_ENABLE_STRICT: '0' };

console.log(`Using version: ${version} (base: ${baseVersion}, fork: ${forkVersion})`);

await execa('node', [path.join(__dirname, './build.js')], {
  stdio: 'inherit',
  env: {
    ...env,
    TUTORIALKIT_TEMPLATE_PATH: path.relative(distFolder, templateDest),
  },
});

const gitignore = ignore().add(fs.readFileSync(path.join(templatePath, '.gitignore'), 'utf8'));

// copy over template
await fsExtra.copy(templatePath, templateDest, {
  filter: (src) => {
    if (src === templatePath) {
      return true;
    }

    if (gitignore.ignores(path.relative(templatePath, src))) {
      return false;
    }

    const relativePath = path.relative(templatePath, src);

    // exclude ruby-wasm build artifacts
    if (
      relativePath.includes('ruby-wasm/tmp/') ||
      relativePath.includes('ruby-wasm/build/') ||
      relativePath.includes('ruby-wasm/rubies/') ||
      relativePath.includes('.wasm')
    ) {
      return false;
    }

    return true;
  },
});

success('Template copied');

// remove project references from tsconfig.json
updateJSON('tsconfig.json', (tsconfig) => {
  delete tsconfig.references;
});

// update dependencies
updateJSON('package.json', (packageJson) => {
  if (packageJson.name === 'tutorialkit-starter') {
    packageJson.name = 'tutorialkit-rb-starter';
  }

  updateWorkspaceVersions(packageJson.dependencies, version);
  updateWorkspaceVersions(packageJson.devDependencies, version);
  updatePackageNames(packageJson.dependencies);
  updatePackageNames(packageJson.devDependencies);
});

success('Template prepared');

function updateWorkspaceVersions(dependencies, version) {
  for (const dependency in dependencies) {
    const depVersion = dependencies[dependency];

    if (depVersion === 'workspace:*') {
      dependencies[dependency] = version;
    }
  }
}

function updatePackageNames(dependencies) {
  const nameMapping = {
    '@tutorialkit/astro': '@tutorialkit-rb/astro',
    '@tutorialkit/react': '@tutorialkit-rb/react',
    '@tutorialkit/runtime': '@tutorialkit-rb/runtime',
    '@tutorialkit/theme': '@tutorialkit-rb/theme',
    '@tutorialkit/types': '@tutorialkit-rb/types',
    '@tutorialkit/cli': '@tutorialkit-rb/cli',
    '@tutorialkit/test-utils': '@tutorialkit-rb/test-utils',
  };

  for (const oldName in nameMapping) {
    if (dependencies[oldName]) {
      const version = dependencies[oldName];
      delete dependencies[oldName];
      dependencies[nameMapping[oldName]] = version;
    }
  }
}

function updateJSON(filename, callback) {
  const filepath = path.join(templateDest, filename);
  const json = JSON.parse(fs.readFileSync(filepath, 'utf8'));

  callback(json);

  fs.writeFileSync(filepath, JSON.stringify(json, undefined, 2));
}
