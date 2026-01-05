import IRBRepl from './irb.js';
import { createRackServer } from './server.js';

/** Interface representing the Ruby VM instance */
export interface RubyVM {
  eval(code: string): unknown;
  evalAsync(code: string): Promise<unknown>;
}

/** Function that executes a command with the VM */
export type CommandFunction = (vm: RubyVM) => Promise<void> | void;

/**
 * Manages external commands that can be triggered from Ruby code.
 *
 * Ruby code can register commands via `Wasmify::ExternalCommands.register(:server, :console)`,
 * and when those commands are invoked, this class handles the JavaScript-side implementation.
 *
 * @example
 * ```typescript
 * import { initVM, ExternalCommands, runRailsCommand } from 'rails-wasm';
 *
 * const vm = await initVM({ ... });
 * const commands = new ExternalCommands();
 *
 * // Make commands accessible from Ruby
 * global.externalCommands = commands;
 *
 * await runRailsCommand(vm, ['server']);
 * commands.invoke(vm); // Starts the Express.js server
 * ```
 */
export default class ExternalCommands {
  private command?: CommandFunction;

  constructor() {
    this.command = undefined;
  }

  /**
   * Register a server command to start an Express.js server on the given port.
   * Called by Ruby when `rails server` is executed.
   */
  server(port: number): void {
    this.command = async (vm: RubyVM): Promise<void> => {
      const server = await createRackServer(vm, { skipRackup: true });

      server.listen(port, () => {
        console.log(`Express.js server started on port ${port}`);
        console.log(`Use Ctrl-C to stop`);
      });

      // FIXME: doesn't work; do WebContainers/jsh support signals at all?
      process.on('exit', async () => {
        console.log('Express.js server is shutting down');
        await vm.evalAsync(`execute_at_exit_hooks`);
      });
    };
  }

  /**
   * Register a console command to start an IRB REPL.
   * Called by Ruby when `rails console` is executed.
   */
  console(): void {
    this.command = async (vm: RubyVM): Promise<void> => {
      const irb = new IRBRepl(vm);
      return irb.start();
    };
  }

  /**
   * Invoke the registered command, if any.
   * This should be called after running a Rails command to execute
   * any side effects like starting a server or console.
   */
  invoke(vm: RubyVM): Promise<void> | void {
    if (!this.command) {
      return;
    }

    return this.command(vm);
  }
}
