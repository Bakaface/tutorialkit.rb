import IRBRepl from './irb.js';
import { createRackServer, type RackServerOptions } from './server.js';

export interface RubyVM {
  eval(code: string): any;
  evalAsync(code: string): Promise<any>;
}

export type CommandFunction = (vm: RubyVM) => Promise<void> | void;

export default class ExternalCommands {
  private command?: CommandFunction;

  constructor() {
    this.command = undefined;
  }

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

  console(): void {
    this.command = async (vm: RubyVM): Promise<void> => {
      const irb = new IRBRepl(vm);
      return irb.start();
    };
  }

  // invokes a registered command if any
  invoke(vm: RubyVM): Promise<void> | void {
    if (!this.command) {
      return;
    }

    return this.command(vm);
  }
}
