import fs from 'node:fs/promises';
import path from 'node:path';
import { WASI } from 'node:wasi';
import { RubyVM } from '@ruby/wasm-wasi';
import { PGLite4Rails } from './database.js';

export interface VMOptions {
  /** Path to the ruby.wasm binary file */
  rubyWasmPath?: string;
  /** Directory to mount at /workspace in the WASI filesystem */
  workspaceDir?: string;
  /** Directory for PGLite database storage */
  pgDataDir?: string;
  /** CLI arguments to pass to Ruby */
  args?: string[];
  /** Skip Rails initialization (raw Ruby only) */
  skipRails?: boolean;
  /** Environment variables to set */
  env?: Record<string, string>;
}

/**
 * Initialize a Ruby VM with optional Rails environment.
 *
 * @example
 * ```typescript
 * import { initVM } from 'rails-wasm';
 *
 * const vm = await initVM({
 *   rubyWasmPath: './node_modules/@ruby/wasm-wasi/dist/ruby.wasm',
 *   workspaceDir: './workspace',
 *   env: { HOME: '/rails-vm' }
 * });
 *
 * await vm.evalAsync('puts "Hello from Ruby!"');
 * ```
 */
export default async function initVM(vmopts: VMOptions = {}): Promise<RubyVM> {
  const { args, skipRails } = vmopts;
  const env = vmopts.env || {};

  // Use provided paths or fall back to defaults relative to cwd
  const rubyWasmPath = vmopts.rubyWasmPath || path.join(process.cwd(), 'node_modules/@ruby/wasm-wasi/dist/ruby.wasm');
  const workspaceDir = vmopts.workspaceDir || path.join(process.cwd(), 'workspace');
  const pgDataDir = vmopts.pgDataDir || path.join(process.cwd(), 'pgdata');

  const binary = await fs.readFile(rubyWasmPath);
  const module = await WebAssembly.compile(new Uint8Array(binary));

  const RAILS_ENV = env.RAILS_ENV || process.env.RAILS_ENV;
  if (RAILS_ENV) {
    env.RAILS_ENV = RAILS_ENV;
  }

  // Calculate working directory relative to workspace mount
  const workdir = process.cwd().startsWith(workspaceDir)
    ? `/workspace${process.cwd().slice(workspaceDir.length)}`
    : '';

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
    (global as unknown as Record<string, unknown>).pglite = pglite;

    // Load patches from the package's patches directory
    const patchesDir = path.join(path.dirname(new URL(import.meta.url).pathname), 'patches');

    let authenticationPatch = '';
    let appGeneratorPatch = '';

    try {
      authenticationPatch = await fs.readFile(path.join(patchesDir, 'authentication.rb'), 'utf8');
      appGeneratorPatch = await fs.readFile(path.join(patchesDir, 'app_generator.rb'), 'utf8');
    } catch (error) {
      // Patches may not exist in all distributions, that's ok
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
