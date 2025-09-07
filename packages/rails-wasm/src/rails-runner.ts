import util from 'node:util';
import { type RubyVM } from './commands.js';

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
