import fs from 'node:fs/promises';
import path from 'node:path';
import { WASI } from 'node:wasi';
import { RubyVM } from '@ruby/wasm-wasi';
import { PGLite4Rails } from './database.js';

export interface VMOptions {
  args?: string[];
  skipRails?: boolean;
  env?: Record<string, string>;
  rubyWasmPath?: string;
  workspaceDir?: string;
  pgDataDir?: string;
  patchesDir?: string;
}

export default async function initVM(vmopts: VMOptions = {}) {
  const { args, skipRails, patchesDir } = vmopts;
  const env = vmopts.env || {};

  // use provided paths or fallback to defaults
  const rubyWasmPath = vmopts.rubyWasmPath || path.join(process.cwd(), 'node_modules/@ruby/wasm-wasi/dist/ruby.wasm');
  const workspaceDir = vmopts.workspaceDir || path.join(process.cwd(), 'workspace');
  const pgDataDir = vmopts.pgDataDir || path.join(process.cwd(), 'pgdata');

  const binary = await fs.readFile(rubyWasmPath);
  const module = await WebAssembly.compile(new Uint8Array(binary));

  const RAILS_ENV = env.RAILS_ENV || process.env.RAILS_ENV;

  if (RAILS_ENV) {
    env.RAILS_ENV = RAILS_ENV;
  }

  const workdir = process.cwd().startsWith(workspaceDir) ? `/workspace${process.cwd().slice(workspaceDir.length)}` : '';

  const cliArgs = args?.length ? ['ruby.wasm'].concat(args) : undefined;

  const wasi = new WASI({
    env: { RUBYOPT: '-EUTF-8 -W0', ...env },
    version: 'preview1',
    returnOnExit: true,
    preopens: {
      '/workspace': workspaceDir,
    },
    args: cliArgs,
  });

  const { vm } = await RubyVM.instantiateModule({
    module,
    wasip1: wasi,
    args: cliArgs,
  });

  if (!skipRails) {
    const pglite = new PGLite4Rails(pgDataDir);
    (global as any).pglite = pglite;

    let authenticationPatch = '';
    let appGeneratorPatch = '';

    const defaultPatchesDir = patchesDir || path.join(path.dirname(new URL(import.meta.url).pathname), 'patches');

    try {
      authenticationPatch = await fs.readFile(path.join(defaultPatchesDir, 'authentication.rb'), 'utf8');
      appGeneratorPatch = await fs.readFile(path.join(defaultPatchesDir, 'app_generator.rb'), 'utf8');
    } catch (error) {
      console.warn('Could not load patches:', error);
    }

    vm.eval(`
      Dir.chdir("${workdir}") unless "${workdir}".empty?

      ENV["RACK_HANDLER"] = "wasi"

      require "/rails-vm/boot"

      require "js"

      Wasmify::ExternalCommands.register(:server, :console)

      ${authenticationPatch}
      ${appGeneratorPatch}
    `);
  }

  return vm;
}
