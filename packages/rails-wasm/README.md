# rails-wasm

Run Ruby on Rails in the browser via WebAssembly.

This package provides the core runtime for executing Rails applications in WebContainer environments using WebAssembly.

## Installation

```bash
npm install rails-wasm @ruby/wasm-wasi
```

## Usage

### Basic Rails Application

```typescript
import { initVM, ExternalCommands, runRailsCommand } from 'rails-wasm';

// Initialize the Ruby VM with Rails
const vm = await initVM({
  rubyWasmPath: './node_modules/@ruby/wasm-wasi/dist/ruby.wasm',
  workspaceDir: './workspace',
  pgDataDir: './pgdata',
  env: { HOME: '/rails-vm' }
});

// Set up external commands (server, console)
const commands = new ExternalCommands();
global.externalCommands = commands;

// Run a Rails command
await runRailsCommand(vm, ['generate', 'model', 'User', 'name:string']);
commands.invoke(vm);
```

### Starting a Rails Server

```typescript
import { initVM, createRackServer } from 'rails-wasm';

const vm = await initVM({ ... });
const server = await createRackServer(vm);

server.listen(3000, () => {
  console.log('Rails server running on port 3000');
});
```

### Interactive Console (IRB)

```typescript
import { initVM, IRBRepl } from 'rails-wasm';

const vm = await initVM({ ... });
const irb = new IRBRepl(vm);
await irb.start();
```

## API Reference

### Core Exports

- `initVM(options)` - Initialize a Ruby VM with optional Rails environment
- `ExternalCommands` - Class for registering and invoking external commands
- `runRailsCommand(vm, args)` - Run a Rails command
- `runRubyScript(path, args, vm)` - Run a Ruby script
- `isRubyShebangScript(path)` - Check if a file is a Ruby shebang script

### Server Exports

- `createRackServer(vm, options)` - Create an Express.js server bridging to Rack
- `RequestQueue` - Queue for serializing Rails requests
- `createFrameLocationTrackingMiddleware(options)` - Middleware for tracking iframe navigation

### Database Exports

- `PGLite4Rails` - PGLite adapter for Rails applications

### Console Exports

- `IRBRepl` - Interactive Ruby console using Node.js REPL

### Script Utilities (`rails-wasm/scripts`)

- `createDatabase(options)` - Create a PGLite database
- `waitForWasm(options)` - Wait for WASM binary to be available
- `spawnRails(options, args)` - Spawn a Rails process

## Options

### VMOptions

```typescript
interface VMOptions {
  rubyWasmPath?: string;        // Path to ruby.wasm binary
  workspaceDir?: string;        // Directory for /workspace mount
  pgDataDir?: string;           // Directory for database files
  args?: string[];              // CLI arguments for Ruby
  skipRails?: boolean;          // Skip Rails initialization
  env?: Record<string, string>; // Environment variables
}
```

## License

MIT
