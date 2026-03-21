/**
 * Smoke test for the Rails WASM boot sequence.
 *
 * Exercises the same code paths as WebContainer (WASM load → VM init →
 * Rails bootstrap) directly on the host via Node.js.
 *
 * Usage:
 *   npm run smoke                    # run all offline tests
 *   npm run smoke -- --rails-new     # only rails new (chmod compat)
 *   npm run smoke -- --generate      # only generator infrastructure
 *   npm run smoke -- --boot-app      # only app boot (native ext compat)
 *   npm run smoke -- --server        # only full server init (Rails.application.initialize!)
 *   npm run smoke -- --http          # only Express/Rack bridge
 *   npm run smoke -- --fetch         # only outbound HTTP fetch (needs network)
 *   npm run smoke -- --skip-rails    # VM init only (no Rails bootstrap)
 *   npm run smoke -- --rails-new --boot-app  # combine specific tests
 *
 * Dependencies are resolved automatically:
 *   --generate and --boot-app require rails new, which runs first.
 *
 * Limitations (node:wasi vs WebContainer):
 *   - Dir.chdir doesn't work (no WASI chdir syscall) — use full paths
 *   - Console REPL is interactive, can't be smoke-tested — but --boot-app
 *     exercises the same app boot path (Bundler.require) that console uses
 *   - Server is tested via --http (createRackServer), not bin/rails server
 *
 * WASM binary resolution (first match wins):
 *   1. RAILS_WASM_PATH env var
 *   2. ../../public/ruby.wasm  (dynamic packing output)
 *   3. node_modules/@ruby/wasm-wasi/dist/ruby.wasm  (WebContainer placement)
 *   4. node_modules/@rails-tutorial/wasm/dist/rails.wasm  (npm package)
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

// Known test flags (everything except --skip-rails)
const testFlags = ['--rails-new', '--generate', '--boot-app', '--server', '--http', '--fetch'];
const hasExplicitFlags = testFlags.some(f => args.has(f));

// No flags = run all tests. With flags = run only those (+ auto-resolved dependencies).
const runRailsNew  = !hasExplicitFlags || args.has('--rails-new') || args.has('--generate') || args.has('--boot-app') || args.has('--server');
const runGenerate  = !hasExplicitFlags || args.has('--generate');
const runBootApp   = !hasExplicitFlags || args.has('--boot-app') || args.has('--server');
const runServer    = !hasExplicitFlags || args.has('--server');
const runHttp      = !hasExplicitFlags || args.has('--http');
const runFetch     = !hasExplicitFlags || args.has('--fetch');

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
  log('node_modules/ not found — running npm install --ignore-scripts...');
  const { execSync } = await import('node:child_process');
  const templateDir = new URL('..', import.meta.url).pathname;
  execSync('npm install --ignore-scripts', { cwd: templateDir, stdio: 'inherit' });
}

const wasmCandidates = [
  { path: process.env.RAILS_WASM_PATH, label: 'RAILS_WASM_PATH env var' },
  { path: new URL('../../../../public/ruby.wasm', import.meta.url).pathname, label: 'public/ruby.wasm (dynamic packing)' },
  { path: new URL('../node_modules/@ruby/wasm-wasi/dist/ruby.wasm', import.meta.url).pathname, label: '@ruby/wasm-wasi' },
  { path: new URL('../node_modules/@rails-tutorial/wasm/dist/rails.wasm', import.meta.url).pathname, label: '@rails-tutorial/wasm' },
].filter(c => c.path);

const resolved = wasmCandidates.find(c => existsSync(c.path));

if (!resolved) {
  console.error(
    '\n  Could not find a Ruby WASM binary. Searched:\n' +
    wasmCandidates.map(c => `    - ${c.label}: ${c.path}`).join('\n') + '\n\n' +
    '  Set RAILS_WASM_PATH to the path of your monolithic ruby.wasm binary,\n' +
    '  or ensure @rails-tutorial/wasm is installed.\n',
  );
  process.exit(1);
}

log(`Using WASM binary from ${resolved.label}: ${resolved.path}`);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
console.log('\n=== Rails WASM Smoke Test ===\n');
const totalTimer = timer();

// --- Step 0: Ensure workspace directory exists (WASI preopen requires it) ---
{
  const { mkdirSync } = await import('node:fs');
  const workspaceDir = new URL('../workspace', import.meta.url).pathname;
  mkdirSync(workspaceDir, { recursive: true });
}

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
{
  vm.eval('require "rails"');
  const version = vm.eval('Rails.version').toString();
  log(`Rails.version = ${version}`);
}

// --- Step 3: Fetch bridge test ---
if (runFetch) {
  log('Testing HTTP fetch bridge...');
  const fetchResult = await vm.evalAsync(`
    require "net/http"
    require "uri"
    require "json"
    response = Net::HTTP.get(URI("https://httpbin.org/get?source=smoke_test"))
    parsed = JSON.parse(response)
    parsed["args"]["source"]
  `);
  if (fetchResult.toString() !== "smoke_test") {
    throw new Error("HTTP fetch bridge test failed");
  }
  log('HTTP fetch bridge: PASS');
}

// --- Step 4: rails new + generate + boot-app + server ---
// These share a generated app, so they run as a group with cleanup.
if (runRailsNew || runGenerate || runBootApp || runServer) {
  const { existsSync: existsSyncFs, rmSync, mkdirSync } = await import('node:fs');
  const { join } = await import('node:path');

  const workspaceHost = new URL('../workspace', import.meta.url).pathname;
  const appName = '_smoke_test_app';
  const appDirHost = join(workspaceHost, appName);

  // Clean up any leftover from a previous failed run
  if (existsSyncFs(appDirHost)) rmSync(appDirHost, { recursive: true, force: true });
  mkdirSync(workspaceHost, { recursive: true });

  try {
    // --- rails new (always runs as prerequisite) ---
    const railsNewTimer = timer();
    log('Testing rails new (app generator + chmod compat)...');
    await vm.evalAsync(`
      ENV["HOME"] = "/workspace" unless ENV["HOME"]
      require "rails/command"
      require "rails/commands/application/application_command"
      ARGV.replace(["new", "/workspace/${appName}", "--skip-bundle", "--skip-git",
                     "--skip-bootsnap", "--skip-brakeman", "--skip-dev-gems",
                     "--skip-kamal", "--skip-thruster", "--skip-docker",
                     "--skip-system-test", "--skip-rubocop",
                     "--skip-decrypted-diffs"])
      Rails::Command.invoke(:application, ARGV)
    `);

    // Verify key files were created
    const checks = ['Gemfile', 'Rakefile', 'config.ru', 'bin/rails', 'app/controllers/application_controller.rb'];
    const missing = checks.filter(f => !existsSyncFs(join(appDirHost, f)));
    if (missing.length > 0) {
      throw new Error(`rails new: missing files: ${missing.join(', ')}`);
    }
    log(`rails new: PASS (${railsNewTimer()}) — ${checks.length} key files verified`);

    // --- generator infrastructure ---
    if (runGenerate) {
      const genTimer = timer();
      log('Testing generator infrastructure...');
      await vm.evalAsync(`
        require "rails/generators"
        require "rails/generators/rails/model/model_generator"
        require "rails/generators/rails/scaffold_controller/scaffold_controller_generator"

        # Verify generator classes are loaded and functional
        gen = Rails::Generators::ModelGenerator.new(["Post", "title:string"])
        raise "destination_root mismatch" unless gen.destination_root == "/workspace/${appName}"
        raise "behavior should be :invoke" unless gen.behavior == :invoke

        # Verify template engine can write files through WASI
        gen.create_file("app/models/post.rb", <<~RUBY)
          class Post < ApplicationRecord
          end
        RUBY

        # Verify scaffold controller generator loads
        sgen = Rails::Generators::ScaffoldControllerGenerator.new(["Post"])
        raise "scaffold dest mismatch" unless sgen.destination_root == "/workspace/${appName}"
      `);

      const genChecks = ['app/models/post.rb'];
      const genMissing = genChecks.filter(f => !existsSyncFs(join(appDirHost, f)));
      if (genMissing.length > 0) {
        throw new Error(`generator infra: missing: ${genMissing.join(', ')}`);
      }
      log(`generator infrastructure: PASS (${genTimer()}) — classes loaded, WASI file creation works`);
    }

    // --- boot generated app ---
    if (runBootApp) {
      const bootTimer = timer();
      log('Testing app boot (config/application.rb → Bundler.require)...');
      await vm.evalAsync(`
        require "/workspace/${appName}/config/application.rb"
      `);
      log(`app boot: PASS (${bootTimer()}) — config/application.rb loaded, Bundler.require succeeded`);
    }

    // --- full server boot + first request ---
    // Exercises the same path as `rails server` + first HTTP request.
    // Rails eager-loads code on the first request in development mode,
    // loading 1600+ files. This catches WASM memory issues (e.g. "index out
    // of bounds") that only manifest under this heavy load.
    if (runServer) {
      const serverTimer = timer();
      log('Testing full server boot + first request...');

      // Boot Rails app via config.ru (same as real server).
      // config.ru loads config/environment.rb which calls initialize!
      await vm.evalAsync(`
        require "rack/builder"
        require "rack/wasi/incoming_handler"
        app = Rack::Builder.load_file("/workspace/${appName}/config.ru")
        $incoming_handler = Rack::WASI::IncomingHandler.new(app)
      `);

      // Serve actual HTTP request through the full Rails stack
      const { createRackServer } = await import('../lib/server.js');
      const rackApp = await createRackServer(vm, { skipRackup: true });

      await new Promise((resolve, reject) => {
        const server = rackApp.listen(0, async () => {
          const port = server.address().port;
          log(`Rails app listening on port ${port}`);
          try {
            const res = await fetch(`http://localhost:${port}/up`);
            log(`GET /up → ${res.status}`);
            if (res.status >= 500) {
              throw new Error(`server test: GET /up returned ${res.status}`);
            }
          } catch (err) {
            server.close();
            reject(err);
            return;
          }
          server.close(() => resolve());
        });
      });

      log(`server: PASS (${serverTimer()}) — Rails.application.initialize! + first request succeeded`);
    }
  } finally {
    if (existsSyncFs(appDirHost)) rmSync(appDirHost, { recursive: true, force: true });
  }
}

// --- Step 5: HTTP bridge test ---
if (runHttp) {
  log('Starting HTTP bridge test...');

  // Set up a minimal Rack app inline (no config.ru needed).
  // This tests the Express→Rack bridge without requiring a full Rails app.
  await vm.evalAsync(`
    require "rack/builder"
    require "rack/wasi/incoming_handler"

    app = Rack::Builder.new do
      run ->(env) { [200, {"content-type" => "text/plain"}, ["ok"]] }
    end

    $incoming_handler = Rack::WASI::IncomingHandler.new(app)
  `);

  const { createRackServer } = await import('../lib/server.js');
  const app = await createRackServer(vm, { skipRackup: true });

  await new Promise((resolve, reject) => {
    const server = app.listen(0, async () => {
      const port = server.address().port;
      log(`Express listening on port ${port}`);

      try {
        const res = await fetch(`http://localhost:${port}/smoke-test`);
        log(`GET /smoke-test → ${res.status}`);
        if (res.status !== 200) {
          throw new Error(`HTTP test failed with status ${res.status}`);
        }
        const body = await res.text();
        if (body !== 'ok') {
          throw new Error(`HTTP test: expected "ok", got "${body}"`);
        }
        log('HTTP bridge: PASS');
      } catch (err) {
        server.close();
        reject(err);
        return;
      }

      server.close(() => resolve());
    });
  });
}

// --- Cleanup: remove PGLite data created during smoke test ---
{
  const { existsSync: existsSyncFs, rmSync, readdirSync } = await import('node:fs');
  const { join } = await import('node:path');
  const pgDataDir = new URL('../pgdata', import.meta.url).pathname;

  if (existsSyncFs(pgDataDir)) {
    for (const entry of readdirSync(pgDataDir)) {
      if (entry === '.keep') continue;
      rmSync(join(pgDataDir, entry), { recursive: true, force: true });
    }
    log('Cleaned up pgdata/');
  }
}

console.log(`\n=== PASSED (total ${totalTimer()}) ===\n`);
process.exit(0);
