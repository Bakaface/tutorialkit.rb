/**
 * Smoke test for the Rails WASM boot sequence (hybrid wasi-vfs approach).
 *
 * Exercises the same code paths as WebContainer (WASM load → VM init →
 * Rails bootstrap) directly on the host via Node.js.
 *
 * Usage:
 *   npm run smoke                    # full boot: VM + Rails + version check
 *   npm run smoke -- --skip-rails    # VM init only (no Rails bootstrap)
 *   npm run smoke -- --http          # full boot + Express/Rack bridge test
 *
 * WASM binary resolution (first match wins):
 *   1. RAILS_WASM_PATH env var
 *   2. public/ruby.wasm  (built by bin/build-wasm)
 *
 * Requires --no-turbo-fast-api-calls to work around a V8 GC bug in node:wasi's
 * PathFilestatGet fast API callback. The npm script includes this flag.
 */

import { existsSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------
const args = new Set(process.argv.slice(2));
const skipRails = args.has('--skip-rails');
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
// Resolve WASM binary
// ---------------------------------------------------------------------------
const nodeModules = new URL('../node_modules', import.meta.url).pathname;

if (!existsSync(nodeModules)) {
  console.error(
    '\n  Missing node_modules/\n' +
    '  Run "npm install" in packages/template/src/templates/default/ first.\n',
  );
  process.exit(1);
}

const wasmCandidates = [
  { path: process.env.RAILS_WASM_PATH, label: 'RAILS_WASM_PATH env var' },
  { path: new URL('../public/ruby.wasm', import.meta.url).pathname, label: 'public/ruby.wasm' },
].filter(c => c.path);

const resolved = wasmCandidates.find(c => existsSync(c.path));

if (!resolved) {
  console.error(
    '\n  Could not find a Ruby WASM binary. Searched:\n' +
    wasmCandidates.map(c => `    - ${c.label}: ${c.path}`).join('\n') + '\n\n' +
    '  Run "bin/build-wasm" to build it, or set RAILS_WASM_PATH.\n',
  );
  process.exit(1);
}

log(`Using WASM binary from ${resolved.label}: ${resolved.path}`);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
console.log('\n=== Rails WASM Smoke Test (Hybrid wasi-vfs) ===\n');
const totalTimer = timer();

// --- Step 1: Load WASM + init VM (+ optional Rails bootstrap) ---
let vm;
{
  log(skipRails ? 'Initializing VM (skip-rails)...' : 'Initializing VM + Rails...');
  const initVM = (await import('../lib/rails.js')).default;
  vm = await initVM({ skipRails, wasmPath: resolved.path });
}

if (skipRails) {
  log('VM ready — Rails bootstrap skipped');
  console.log(`\n=== PASSED — skip-rails (total ${totalTimer()}) ===\n`);
  process.exit(0);
}

// --- Step 2: Verify Rails is loadable ---
// boot.rb patches Bundler.require but doesn't call it (that happens when a
// Rails app boots via config/application.rb). Load Rails explicitly here to
// verify the gems baked into the WASM binary are functional.
{
  vm.eval('require "rails"');
  const version = vm.eval('Rails.version').toString();
  log(`Rails.version = ${version}`);
}

// --- Step 3 (optional): HTTP bridge test ---
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
