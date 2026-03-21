import { bootProgress } from './boot-progress.js';
import { RubyVM } from "@ruby/wasm-wasi";
import { WASI } from "wasi";
import fs from "fs/promises";
import { PGLite4Rails } from "./database.js";
import { initHttpBridge } from './http-bridge.js';

function timer() {
  const start = performance.now();
  return () => {
    const ms = performance.now() - start;
    return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
  };
}

const defaultWasmPath = new URL("../node_modules/@ruby/wasm-wasi/dist/ruby.wasm", import.meta.url).pathname;

const railsRootDir = new URL("../workspace", import.meta.url).pathname;
const pgDataDir = new URL("../pgdata", import.meta.url).pathname;

export default async function initVM(vmopts = {}) {
  const totalTimer = timer();
  const { args, skipRails, wasmPath } = vmopts;
  const env = vmopts.env || {};

  // --- WASM load + compile ---
  const wasmTimer = timer();
  bootProgress.updateStep('Loading Ruby WASM...');
  const binary = await fs.readFile(wasmPath || defaultWasmPath);
  const module = await WebAssembly.compile(binary);
  bootProgress.updateProgress(100);
  bootProgress.log(`WASM load + compile (${wasmTimer()})`);

  const RAILS_ENV = env.RAILS_ENV || process.env.RAILS_ENV;
  if (RAILS_ENV) env.RAILS_ENV = RAILS_ENV;

  const workspaceDir = new URL("../workspace", import.meta.url).pathname;
  const workdir = process.cwd().startsWith(workspaceDir) ?
    `/workspace${process.cwd().slice(workspaceDir.length)}` :
    "";

  const cliArgs = args?.length ? ['ruby.wasm'].concat(args) : undefined;

  // --- VM instantiation ---
  const vmTimer = timer();
  bootProgress.updateStep('Initializing Ruby VM...');
  const wasi = new WASI(
    {
      env: {"RUBYOPT": "-EUTF-8 -W0", ...env},
      version: "preview1",
      returnOnExit: true,
      preopens: {
        "/workspace": workspaceDir
      },
      args: cliArgs
    }
  );

  const { vm } = await RubyVM.instantiateModule({
    module,
    wasip1: wasi,
    args: cliArgs
  });
  bootProgress.log(`VM instantiation (${vmTimer()})`);

  if (!skipRails) {
    const railsTimer = timer();
    bootProgress.updateStep('Bootstrapping Rails...');

    const pglite = new PGLite4Rails(pgDataDir);
    global.pglite = pglite;

    initHttpBridge();

    const httpBridgePatch = await fs.readFile(new URL("./patches/http_bridge.rb", import.meta.url).pathname, 'utf8');
    const authenticationPatch = await fs.readFile(new URL("./patches/authentication.rb", import.meta.url).pathname, 'utf8');
    const appGeneratorPatch = await fs.readFile(new URL("./patches/app_generator.rb", import.meta.url).pathname, 'utf8');

    vm.eval(`
      def _boot_time(label)
        t = Process.clock_gettime(Process::CLOCK_MONOTONIC)
        yield
        elapsed = Process.clock_gettime(Process::CLOCK_MONOTONIC) - t
        $stderr.puts "[boot] #{label} (#{"%.1f" % elapsed}s)"
      end

      Dir.chdir("${workdir}") unless "${workdir}".empty?

      ENV["RACK_HANDLER"] = "wasi"
      ENV["BUNDLE_GEMFILE"] = "/rails-vm/Gemfile"
      # Prevent Minitest from enabling parallel mode
      ENV["MT_CPU"] = "1"

      _boot_time("require /rails-vm/boot") { require "/rails-vm/boot" }

      require "js"

      ${httpBridgePatch}

      Wasmify::ExternalCommands.register(:server, :console)

      ${authenticationPatch}
      ${appGeneratorPatch}
    `)

    bootProgress.updateProgress(100);
    bootProgress.log(`Rails bootstrap (${railsTimer()})`);
  }

  bootProgress.log(`Total (${totalTimer()})`);
  bootProgress.updateStep('Ready');

  return vm;
}

export { bootProgress };
