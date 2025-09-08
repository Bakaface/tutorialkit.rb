import fs from 'node:fs';
import util from 'node:util';
import { type RubyVM } from './commands.js';

export interface RubyRunnerOptions {
  workspaceDir?: string;
  pgDataDir?: string;
  patchesDir?: string;
}

export async function runRubyScript(scriptPath: string, args: string[], vm: RubyVM): Promise<void> {
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

export function isRubyShebangScript(filePath: string): boolean {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const firstLine = fs.readFileSync(filePath, 'utf8').split('\n')[0];

  return firstLine.includes('#!/usr/bin/env ruby');
}
