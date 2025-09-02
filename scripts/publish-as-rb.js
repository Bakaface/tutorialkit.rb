#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// find all packages
const packagesDir = 'packages';
const packageDirs = readdirSync(packagesDir)
  .map((dir) => join(packagesDir, dir))
  .filter((dir) => statSync(dir).isDirectory() && readFileSync(join(dir, 'package.json')));

console.log('Found packages:', packageDirs);

// mapping of original to new names
const nameMapping = {
  '@tutorialkit/astro': '@tutorialkit-rb/astro',
  '@tutorialkit/react': '@tutorialkit-rb/react',
  '@tutorialkit/runtime': '@tutorialkit-rb/runtime',
  '@tutorialkit/theme': '@tutorialkit-rb/theme',
  '@tutorialkit/types': '@tutorialkit-rb/types',
  '@tutorialkit/cli': '@tutorialkit-rb/cli',
  '@tutorialkit/test-utils': '@tutorialkit-rb/test-utils',
  'create-tutorial': 'create-tutorialkit-rb',
};

// update each package.json temporarily for publishing
packageDirs.forEach((packageDir) => {
  const packageJsonPath = join(packageDir, 'package.json');
  const originalContent = readFileSync(packageJsonPath, 'utf8');
  const pkg = JSON.parse(originalContent);

  // skip if no mapping found
  if (!nameMapping[pkg.name]) {
    console.log(`No mapping found for ${pkg.name}, skipping...`);
    return;
  }

  console.log(`Publishing ${pkg.name} as ${nameMapping[pkg.name]}`);

  // update name for publishing
  pkg.name = nameMapping[pkg.name];

  // update dependencies to use new names
  ['dependencies', 'devDependencies', 'peerDependencies'].forEach((depType) => {
    if (pkg[depType]) {
      Object.keys(pkg[depType]).forEach((dep) => {
        if (nameMapping[dep]) {
          const version = pkg[depType][dep];
          delete pkg[depType][dep];
          pkg[depType][nameMapping[dep]] = version;
        }
      });
    }
  });

  // write temporary package.json
  writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));

  try {
    // publish the package
    execSync(`cd ${packageDir} && npm publish`, { stdio: 'inherit' });
    console.log(`✅ Published ${nameMapping[pkg.name]}`);
  } catch (error) {
    console.error(`❌ Failed to publish ${nameMapping[pkg.name]}:`, error.message);
  } finally {
    // restore original package.json
    writeFileSync(packageJsonPath, originalContent);
    console.log(`🔄 Restored original package.json for ${packageDir}`);
  }
});

console.log('Publishing complete!');
