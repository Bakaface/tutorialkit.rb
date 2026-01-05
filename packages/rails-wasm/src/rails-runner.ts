import util from 'node:util';
import type { RubyVM } from './commands.js';

/**
 * Run a Rails command using the provided VM.
 *
 * This function sets up ARGV in Ruby and executes the Rails command handler.
 * It handles both Rails application commands (when config/application.rb exists)
 * and standalone Rails commands (generators, plugins, etc.).
 *
 * @param vm - The initialized RubyVM instance
 * @param args - Command-line arguments to pass to Rails (e.g., ['server'], ['generate', 'model', 'User'])
 *
 * @example
 * ```typescript
 * import { initVM, ExternalCommands, runRailsCommand } from 'rails-wasm';
 *
 * const vm = await initVM({ ... });
 * const commands = new ExternalCommands();
 * global.externalCommands = commands;
 *
 * await runRailsCommand(vm, ['generate', 'model', 'User', 'name:string']);
 * commands.invoke(vm);
 * ```
 */
export async function runRailsCommand(vm: RubyVM, args: string[]): Promise<void> {
  const rubyArgs = util.inspect(args);

  await vm.evalAsync(`
    args = ${rubyArgs}
    ARGV.replace(args)

    begin
      if File.file?("config/application.rb")
        APP_PATH = File.expand_path("config/application", Dir.pwd)
        require File.expand_path("../boot", APP_PATH)
        require "rails/commands"
      else
        require "rails/command"
        case ARGV.first
        when Rails::Command::HELP_MAPPINGS, "help", nil
          ARGV.shift
          Rails::Command.invoke :gem_help, ARGV
        when "plugin"
          ARGV.shift
          Rails::Command.invoke :plugin, ARGV
        else
          Rails::Command.invoke :application, ARGV
        end
      end
      execute_at_exit_hooks unless Wasmify::ExternalCommands.any?
    rescue SystemExit
      # expected, do nothing
    end
  `);
}
