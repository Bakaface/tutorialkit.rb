/**
 * Smoke test for the Rails WASM boot sequence.
 *
 * Exercises the same code paths as WebContainer (gems extraction → WASM load
 * → VM init → Rails bootstrap) directly on the host via Node.js.
 *
 * Usage:
 *   npm run smoke                    # extract + VM + Rails bootstrap + version check
 *   npm run smoke -- --extract-only  # gems-loader.js extraction only
 *   npm run smoke -- --skip-rails    # extract + VM init (no Rails bootstrap)
 *   npm run smoke -- --clean         # force re-extraction before running
 *   npm run smoke -- --http          # full boot + Express/Rack bridge test
 *
 * Requires --no-turbo-fast-api-calls to work around a V8 GC bug in node:wasi's
 * PathFilestatGet fast API callback. The npm script includes this flag.
 */

import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import { performance } from 'node:perf_hooks';

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------
const args = new Set(process.argv.slice(2));
const extractOnly = args.has('--extract-only');
const skipRails = args.has('--skip-rails');
const clean = args.has('--clean');
const httpTest = args.has('--http');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function timer() {
  const start = performance.now();
  return () => {
    const ms = performance.now() - start;
    return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
  };
}

function log(msg) {
  console.log(`[smoke] ${msg}`);
}

// ---------------------------------------------------------------------------
// Prerequisite checks
// ---------------------------------------------------------------------------
const publicDir = new URL('../public', import.meta.url).pathname;
const gemsTarball = `${publicDir}/gems.tar.gz`;
const gemsDir = new URL('../workspace/.gems', import.meta.url).pathname;
const nodeModules = new URL('../node_modules', import.meta.url).pathname;

if (!existsSync(gemsTarball)) {
  console.error(
    '\n  Missing public/gems.tar.gz\n' +
    '  Run "pnpm run pack:gems" from packages/template/ first.\n',
  );
  process.exit(1);
}

if (!existsSync(nodeModules)) {
  console.error(
    '\n  Missing node_modules/\n' +
    '  Run "npm install" in packages/template/src/templates/default/ first.\n',
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Clean (optional)
// ---------------------------------------------------------------------------
if (clean && existsSync(gemsDir)) {
  log('Cleaning workspace/.gems/ ...');
  await fs.rm(gemsDir, { recursive: true, force: true });
  log('Cleaned.');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
console.log('\n=== Rails WASM Smoke Test ===\n');
const totalTimer = timer();

// --- Step 1: Gems extraction ---
{
  const t = timer();
  log('Extracting gems...');
  const { extractGems, hasGemsTarball } = await import('../lib/gems-loader.js');

  if (!(await hasGemsTarball())) {
    console.error('gems-loader.js: hasGemsTarball() returned false');
    process.exit(1);
  }

  await extractGems({
    log: (msg) => log(`  ${msg}`),
    updateStep: () => {},
    updateProgress: () => {},
  });
  log(`Gems extracted (${t()})`);
}

if (extractOnly) {
  console.log(`\n=== PASSED — extract only (total ${totalTimer()}) ===\n`);
  process.exit(0);
}

// --- Step 2: Load WASM + init VM ---
let vm;
{
  log(skipRails ? 'Initializing VM (skip-rails)...' : 'Initializing VM + Rails...');
  const initVM = (await import('../lib/rails.js')).default;
  vm = await initVM({ skipRails });
}

if (skipRails) {
  log('VM ready — Rails bootstrap skipped');
  console.log(`\n=== PASSED — skip-rails (total ${totalTimer()}) ===\n`);
  process.exit(0);
}

// --- Step 3: Verify Rails version ---
{
  const version = vm.eval('Rails.version').toString();
  log(`Rails.version = ${version}`);
}

// --- Step 4 (optional): HTTP bridge test ---
if (httpTest) {
  log('Starting HTTP bridge test...');
  const { createRackServer } = await import('../lib/server.js');
  const app = await createRackServer(vm);

  const server = app.listen(0, async () => {
    const port = server.address().port;
    log(`Express listening on port ${port}`);

    try {
      const res = await fetch(`http://localhost:${port}/up`);
      log(`GET /up → ${res.status}`);
      if (res.status >= 500) {
        throw new Error(`HTTP test failed with status ${res.status}`);
      }
    } catch (err) {
      console.error(`[smoke] HTTP test error: ${err.message}`);
      server.close();
      process.exit(1);
    }

    server.close(() => {
      log('Express stopped');
      console.log(`\n=== PASSED — full + http (total ${totalTimer()}) ===\n`);
      process.exit(0);
    });
  });
} else {
  console.log(`\n=== PASSED (total ${totalTimer()}) ===\n`);
  process.exit(0);
}
