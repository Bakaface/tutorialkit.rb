import fs from 'node:fs';
import util from 'node:util';
import type { RubyVM } from './commands.js';

export interface RubyRunnerOptions {
  /** Arguments to pass to the script via ARGV */
  args?: string[];
}

/**
 * Check if a file is a Ruby script with a shebang line.
 *
 * @param filePath - Path to the file to check
 * @returns true if the file starts with `#!/usr/bin/env ruby`
 *
 * @example
 * ```typescript
 * import { isRubyShebangScript } from 'rails-wasm';
 *
 * if (isRubyShebangScript('./bin/setup')) {
 *   // Handle as Ruby script
 * }
 * ```
 */
export function isRubyShebangScript(filePath: string): boolean {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const firstLine = fs.readFileSync(filePath, 'utf8').split('\n')[0];
  return firstLine.includes('#!/usr/bin/env ruby');
}

/**
 * Run a Ruby script with the provided VM.
 *
 * This function loads and executes a Ruby script file, setting up ARGV
 * with the provided arguments.
 *
 * @param scriptPath - Path to the Ruby script (relative to current directory)
 * @param args - Arguments to pass to the script via ARGV
 * @param vm - The initialized RubyVM instance
 *
 * @example
 * ```typescript
 * import { initVM, runRubyScript } from 'rails-wasm';
 *
 * const vm = await initVM({ skipRails: true, ... });
 * await runRubyScript('./bin/setup', ['--help'], vm);
 * ```
 */
export async function runRubyScript(
  scriptPath: string,
  args: string[],
  vm: RubyVM
): Promise<void> {
  const rubyArgs = util.inspect(args);

  await vm.evalAsync(`
    args = ${rubyArgs}
    ARGV.replace(args)

    begin
      load "./${scriptPath}"
      execute_at_exit_hooks unless Wasmify::ExternalCommands.any?
    rescue SystemExit
    end
  `);
}
