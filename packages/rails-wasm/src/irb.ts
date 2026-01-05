import repl from 'node:repl';
import type { RubyVM } from './commands.js';

interface RubyValue {
  toJS(): unknown;
}

const isRecoverableError = (error: Error): boolean => {
  if (error.message.includes('SyntaxError')) {
    return true;
  }

  return false;
};

const rubyWriter = (output: unknown): string => {
  if (!output) return '';

  if (typeof output === 'string') {
    return output;
  }

  return String(output).replace(/\n$/, '');
};

type ReplCallback = (err: Error | null, result?: unknown) => void;

/**
 * Interactive Ruby (IRB) REPL for use in Node.js.
 *
 * Provides an interactive Ruby console using Node.js's built-in REPL module
 * as the frontend and the Ruby VM as the backend.
 *
 * @example
 * ```typescript
 * import { initVM, IRBRepl } from 'rails-wasm';
 *
 * const vm = await initVM({ ... });
 * const irb = new IRBRepl(vm);
 * await irb.start();
 * ```
 */
export default class IRBRepl {
  private vm: RubyVM;

  constructor(vm: RubyVM) {
    this.vm = vm;
    this.eval = this.eval.bind(this);
  }

  async eval(
    cmd: string,
    _context: unknown,
    _filename: string,
    callback: ReplCallback
  ): Promise<void> {
    let result;
    try {
      result = await this.vm.evalAsync(`
__code__ = <<~'RUBY'
${cmd}
RUBY

$irb.eval_code(__code__)
`);
    } catch (e) {
      const error = e as Error;
      if (error.message.includes('SystemExit')) {
        process.exit();
      }
      if (isRecoverableError(error)) {
        return callback(new repl.Recoverable(error));
      }

      return callback(null, error.message);
    }
    callback(null, result);
  }

  async start(): Promise<void> {
    // Set up IRB
    const promptVal = (await this.vm.evalAsync(`
      require "irb"

      STDOUT.sync = true
      if IRB.conf.empty?
        ap_path = __FILE__
        $0 = File::basename(ap_path, ".rb") if ap_path
        IRB.setup(ap_path)
      end

      class NonBlockingIO
        def gets
          raise NonImplementedError
        end

        def external_encoding
          "UTF-8"
        end

        def wait_readable(timeout = nil)
          true
        end

        def getc = "x"
        def ungetc(c) = nil
      end

      class IRB::Irb
        def eval_code(code)
          statement = parse_input(code)

          context.evaluate(statement, @line_no)
          @line_no += code.count("\\n")
          context.inspect_last_value
        rescue SystemExit, SignalException, SyntaxError
          raise
        rescue Interrupt, Exception => exc
          handle_exception(exc)
          context.workspace.local_variable_set(:_, exc)
        end
      end

      $irb = IRB::Irb.new(nil, IRB::StdioInputMethod.new)

      # return configured prompt
      IRB.conf[:PROMPT][IRB.conf[:PROMPT_MODE]][:PROMPT_I]
        .gsub(/(%\\d+)?n/, "") # no line number support
        .then { $irb.send(:format_prompt, _1, nil, 0, 0) }
    `)) as RubyValue;

    const prompt = promptVal.toJS() as string;
    const local = repl.start({ prompt, eval: this.eval, writer: rubyWriter });

    local.on('exit', () => {
      // TODO: save history?
      process.exit();
    });
  }
}
