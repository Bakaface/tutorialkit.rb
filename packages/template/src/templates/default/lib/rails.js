import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import { WASI } from 'wasi';
import { RubyVM } from '@ruby/wasm-wasi';
import { bootProgress } from './boot-progress.js';
import { PGLite4Rails } from './database.js';
import { hasGemsTarball, extractGems, getGemsEnv } from './gems-loader.js';
import { buildGemCache, createGemCacheProxy } from './wasi-gem-cache.js';

function timer() {
  const start = performance.now();
  return () => {
    const ms = performance.now() - start;
    return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
  };
}

// WASM paths - local build takes precedence, then official package
const localWasmPath = new URL('../public/ruby.wasm', import.meta.url).pathname;
const officialWasmPath = new URL('../node_modules/@ruby/3.3-wasm-wasi/dist/ruby+stdlib.wasm', import.meta.url).pathname;

const pgDataDir = new URL('../pgdata', import.meta.url).pathname;

/**
 * Determine which WASM binary to use:
 * 1. Local build from public/ruby.wasm (custom build)
 * 2. Official @ruby/3.3-wasm-wasi package
 */
function resolveWasmPath() {
  if (existsSync(localWasmPath)) {
    bootProgress.log('Using local WASM build from public/ruby.wasm');
    return localWasmPath;
  }

  bootProgress.log('Using official WASM from @ruby/3.3-wasm-wasi');

  return officialWasmPath;
}

export default async function initVM(vmopts = {}) {
  const totalTimer = timer();
  const { args, skipRails } = vmopts;
  const env = vmopts.env || {};

  // Extract gems tarball (required for Rails)
  const hasTarball = await hasGemsTarball();

  if (!hasTarball && !skipRails) {
    throw new Error(
      'No gems.tar.gz found. Rails requires the gems tarball.\n' +
        'Run "pnpm run pack:gems" to create it, then restart the dev server.',
    );
  }

  const gemsDir = new URL('../workspace/.gems', import.meta.url).pathname;
  let gemCache = null;

  if (hasTarball) {
    const gemsTimer = timer();
    bootProgress.updateStep('Preparing gems...');
    await extractGems(bootProgress);

    // Add gems environment variables
    const gemsEnv = getGemsEnv();
    Object.assign(env, gemsEnv);
    bootProgress.log(`BUNDLE_PATH=${gemsEnv.BUNDLE_PATH}`);
    bootProgress.log(`[boot] Gem extraction (${gemsTimer()})`);

    // Build in-memory cache of gem files for WASI proxy
    if (existsSync(gemsDir)) {
      const cacheTimer = timer();
      bootProgress.updateStep('Caching gem files...');
      gemCache = await buildGemCache(gemsDir, bootProgress);
      bootProgress.log(`[boot] Gem cache build (${cacheTimer()})`);
    }
  }

  // Load WASM binary
  const wasmTimer = timer();
  bootProgress.updateStep('Loading Ruby WASM...');

  const wasmPath = resolveWasmPath();
  const binary = await fs.readFile(wasmPath);
  const module = await WebAssembly.compile(binary);
  bootProgress.updateProgress(100);
  bootProgress.log(`[boot] WASM load + compile (${wasmTimer()})`);

  const RAILS_ENV = env.RAILS_ENV || process.env.RAILS_ENV;

  if (RAILS_ENV) {
    env.RAILS_ENV = RAILS_ENV;
  }

  const workspaceDir = new URL('../workspace', import.meta.url).pathname;
  const workdir = process.cwd().startsWith(workspaceDir) ? `/workspace${process.cwd().slice(workspaceDir.length)}` : '/workspace';

  const cliArgs = args?.length ? ['ruby.wasm'].concat(args) : undefined;

  // Configure WASI with workspace and gems directories
  const preopens = {
    '/workspace': workspaceDir,
  };

  // Add gems directory if extracted from tarball
  if (existsSync(gemsDir)) {
    preopens['/gems'] = gemsDir;
    bootProgress.log('Mounted gems directory at /gems');
  }

  const vmTimer = timer();
  bootProgress.updateStep('Initializing Ruby VM...');

  const wasi = new WASI({
    env: { RUBYOPT: '-EUTF-8 -W0', ...env },
    version: 'preview1',
    returnOnExit: true,
    preopens,
    args: cliArgs,
  });

  let wasiProxy = null;

  if (gemCache) {
    wasiProxy = createGemCacheProxy(wasi.wasiImport, gemCache, { progress: bootProgress });
  }

  const { vm } = await RubyVM.instantiateModule({
    module,
    wasip1: wasi,
    args: cliArgs,
    addToImports(imports) {
      if (wasiProxy) {
        imports.wasi_snapshot_preview1 = wasiProxy;
      }
    },
    setMemory(mem) {
      if (wasiProxy) {
        wasiProxy._setMemory(mem);
      }
    },
  });
  bootProgress.log(`[boot] VM instantiation (${vmTimer()})`);

  if (!skipRails) {
    const railsTimer = timer();
    bootProgress.updateStep('Bootstrapping Rails...');

    const pglite = new PGLite4Rails(pgDataDir);
    global.pglite = pglite;

    const authenticationPatch = await fs.readFile(
      new URL('./patches/authentication.rb', import.meta.url).pathname,
      'utf8',
    );
    const appGeneratorPatch = await fs.readFile(
      new URL('./patches/app_generator.rb', import.meta.url).pathname,
      'utf8',
    );

    // Boot Rails from extracted gems using Bundler
    bootProgress.log('Booting Rails from extracted gems');
    vm.eval(`
      def _boot_time(label)
        t = Process.clock_gettime(Process::CLOCK_MONOTONIC)
        yield
        elapsed = Process.clock_gettime(Process::CLOCK_MONOTONIC) - t
        $stderr.puts "[boot] #{label} (#{"%.1f" % elapsed}s)"
      end

      Dir.chdir("${workdir}") unless "${workdir}".empty?

      ENV["RACK_HANDLER"] = "wasi"

      # Configure gem paths for the extracted gems
      # BUNDLE_PATH is set via WASI env to /gems (the Ruby-visible path)
      ruby_version = RUBY_VERSION.split('.')[0, 2].join('.')
      gem_home = "/gems/ruby/#{ruby_version}.0"

      ENV["GEM_HOME"] = gem_home
      ENV["GEM_PATH"] = gem_home

      # Point Bundler to the Gemfile in the tarball
      # This ensures consistent gem resolution regardless of cwd
      ENV["BUNDLE_GEMFILE"] = "/gems/Gemfile"

      # Set up RubyGems to find specifications
      Gem::Specification.dirs = ["#{gem_home}/specifications"]

      _boot_time("bundler/setup") { require "bundler/setup" }
      _boot_time("wasmify-rails") { require "wasmify-rails" }
      _boot_time("wasmify/patcha") { require "wasmify/patcha" }

      ${authenticationPatch}
      ${appGeneratorPatch}

      # Activate patches (hooks into class loading)
      Wasmify::Patcha.setup!

      _boot_time("require rails") { require "rails" }
      _boot_time("require rails/all") { require "rails/all" }

      require "js"
      require "wasmify/external_commands"

      Wasmify::ExternalCommands.register(:server, :console)
    `);

    bootProgress.updateProgress(100);
    bootProgress.log(`[boot] Rails bootstrap (${railsTimer()})`);
  }

  if (wasiProxy) {
    wasiProxy._logStats();
  }

  bootProgress.log(`[boot] Total (${totalTimer()})`);
  bootProgress.updateStep('Ready');

  return vm;
}

// Export boot progress for external consumers
export { bootProgress };
