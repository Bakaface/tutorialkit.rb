#!/usr/bin/env node

/**
 * Post-install script to verify Ruby WASM and gems tarball availability.
 *
 * With the tarball approach:
 * - Ruby WASM comes from the official @ruby/3.3-wasm-wasi npm package
 * - Gems are distributed separately via gems.tar.gz (optional)
 *
 * This script verifies the setup is correct and reports status.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { extractGems, isGemsExtracted } from '../lib/gems-loader.js';

function timer() {
  const start = performance.now();
  return () => {
    const ms = performance.now() - start;
    return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
  };
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const publicDir = path.join(__dirname, '../public');

// WASM paths - local build takes precedence, then official package
const localWasmPath = path.join(publicDir, 'ruby.wasm');
const officialWasmPath = path.join(__dirname, '../node_modules/@ruby/3.3-wasm-wasi/dist/ruby+stdlib.wasm');

// Gems tarball paths
const gemsTarballPath = path.join(publicDir, 'gems.tar.gz');
const gemsMetadataPath = path.join(publicDir, 'gems.meta.json');

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch {
    return null;
  }
}

async function checkWasmAvailability() {
  console.log('[wasm] Checking Ruby WASM availability...');

  // Check for local build first
  if (existsSync(localWasmPath)) {
    const size = await getFileSize(localWasmPath);
    console.log(`[wasm] ✓ Local WASM build found: public/ruby.wasm (${formatSize(size)})`);
    return { type: 'local', path: localWasmPath, size };
  }

  // Check for official package
  if (existsSync(officialWasmPath)) {
    const size = await getFileSize(officialWasmPath);
    console.log(`[wasm] ✓ Official WASM package found: @ruby/3.3-wasm-wasi (${formatSize(size)})`);
    return { type: 'official', path: officialWasmPath, size };
  }

  console.error('[wasm] ✗ No Ruby WASM found!');
  console.error('[wasm]   Expected either:');
  console.error('[wasm]   - public/ruby.wasm (local build)');
  console.error('[wasm]   - node_modules/@ruby/3.3-wasm-wasi/dist/ruby+stdlib.wasm');
  return null;
}

async function checkGemsTarball() {
  console.log('[gems] Checking gems tarball availability...');

  if (!existsSync(gemsTarballPath)) {
    console.error('[gems] ✗ No gems.tar.gz found!');
    console.error('[gems]   Rails requires the gems tarball to run.');
    console.error('[gems]   Run "pnpm run pack:gems" to create it.');
    return null;
  }

  const tarballSize = await getFileSize(gemsTarballPath);
  console.log(`[gems] ✓ Gems tarball found: public/gems.tar.gz (${formatSize(tarballSize)})`);

  // Try to load metadata
  if (existsSync(gemsMetadataPath)) {
    try {
      const metadataJson = await fs.readFile(gemsMetadataPath, 'utf8');
      const metadata = JSON.parse(metadataJson);
      console.log(`[gems]   Gem count: ${metadata.gem_count || 'unknown'}`);
      console.log(`[gems]   File count: ${metadata.file_count || 'unknown'}`);
      console.log(`[gems]   Ruby version: ${metadata.ruby_version || 'unknown'}`);
      console.log(`[gems]   Created: ${metadata.created_at || 'unknown'}`);
      return { tarballSize, metadata };
    } catch (err) {
      console.log(`[gems]   (metadata unavailable: ${err.message})`);
    }
  }

  return { tarballSize, metadata: null };
}

async function main() {
  console.log('');
  console.log('=== Ruby WASM Environment Check ===');
  console.log('');

  const totalElapsed = timer();

  // Check WASM availability
  const wasmElapsed = timer();
  const wasmStatus = await checkWasmAvailability();
  if (!wasmStatus) {
    console.error('');
    console.error('ERROR: Ruby WASM not available.');
    console.error('Run `npm install` to install the @ruby/3.3-wasm-wasi package.');
    process.exit(1);
  }
  console.log(`[wasm] Done in ${wasmElapsed()}`);

  console.log('');

  // Check gems tarball
  const gemsElapsed = timer();
  const gemsStatus = await checkGemsTarball();
  console.log(`[gems] Done in ${gemsElapsed()}`);

  // Extract gems during postinstall so first `rails` command skips extraction
  if (gemsStatus) {
    const extractElapsed = timer();
    const alreadyExtracted = await isGemsExtracted();
    if (alreadyExtracted) {
      console.log('[gems] Gems already extracted, skipping');
    } else {
      console.log('[gems] Extracting gems tarball...');
      await extractGems({ log: (msg) => console.log(`[gems] ${msg}`), updateStep: () => {}, updateProgress: () => {} });
    }
    console.log(`[gems] Extraction done in ${extractElapsed()}`);
    console.log('');
  }

  console.log('=== Summary ===');
  console.log(`WASM: ${wasmStatus.type === 'local' ? 'Local build' : 'Official package'} (${formatSize(wasmStatus.size)})`);
  if (gemsStatus) {
    console.log(`Gems: Tarball (${formatSize(gemsStatus.tarballSize)})`);
    console.log('');
    console.log(`[ready] Ruby WASM environment ready (${totalElapsed()})`);
  } else {
    console.log('Gems: ✗ MISSING');
    console.log('');
    console.error('[error] Rails will not work without gems.tar.gz!');
    console.error('        Run "pnpm run pack:gems" to create it.');
  }
  console.log('');
}

main().catch((error) => {
  console.error('Environment check failed:', error);
  process.exit(1);
});
