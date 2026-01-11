import express, { type Express, type Request, type Response } from 'express';
import setCookieParser from 'set-cookie-parser';
import multer from 'multer';
import createFrameLocationTrackingMiddleware from './server/frame_location_middleware.js';
import type { RubyVM } from './commands.js';

/** Options for creating a Rack server */
export interface RackServerOptions {
  /** Skip loading config.ru (use when Rails has already set up the handler) */
  skipRackup?: boolean;
}

interface QueuedRequest {
  req: Request;
  res: Response;
  resolve: () => void;
}

type RequestHandler = (req: Request, res: Response) => Promise<void>;

/**
 * Wraps the Express request object for consumption by Ruby's Rack interface.
 * @internal
 */
class IncomingRequest {
  private request: Request;
  private input: string | null;
  private _preparedHeaders?: Record<string, string | string[] | undefined>;

  constructor(request: Request, input: string | null = null) {
    this.request = request;
    this.input = input;
    this._preparedHeaders = undefined;
  }

  method(): string {
    return this.request.method;
  }

  pathWithQuery(): string | null {
    const url = this.request.url;
    return url ? url : null;
  }

  scheme(): string {
    return this.request.protocol;
  }

  authority(): string | null {
    const host = this.request.headers.host;
    return host ? host : null;
  }

  headers(): Record<string, string | string[] | undefined> {
    if (this._preparedHeaders) return this._preparedHeaders;

    const req = this.request;
    this._preparedHeaders = {};

    for (const key in req.headers) {
      this._preparedHeaders[key] = req.headers[key];
    }

    return this._preparedHeaders;
  }

  consume(): string | null {
    return this.input;
  }
}

interface RubyResult {
  call(method: string): RubyResult;
  toJS(): unknown;
}

/**
 * Handles the async response from Ruby back to Express.
 * @internal
 */
class ResponseOutparam {
  private request: Request;
  private response: Response;
  private result?: RubyResult;
  private _resolve!: () => void;
  public promise: Promise<void>;

  constructor(request: Request, response: Response) {
    this.request = request;
    this.response = response;
    this.promise = new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  set(result: RubyResult): void {
    this.result = result;
    this._resolve();
  }

  async finish(): Promise<void> {
    const result = this.result!;
    const res = this.response;

    if (result.call('tag').toJS() === 'ok') {
      const response = result.call('value');
      const headers = response.call('headers').toJS() as Record<string, string>;

      Object.entries(headers).forEach(([key, value]) => {
        res.set(key, value);
      });

      if (headers['set-cookie']) {
        const cookies = setCookieParser.parse(headers['set-cookie']);
        cookies.forEach((cookie) => {
          res.cookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            path: cookie.path,
            expires: cookie.expires,
            sameSite: cookie.sameSite?.toLowerCase() as 'strict' | 'lax' | 'none' | undefined,
          });
        });
      }

      if (headers['location']) {
        const location = headers['location'];
        if (location.startsWith('http://localhost:3000/')) {
          res.set('location', location.replace('http://localhost:3000', ''));
        }
      }

      const body = response.call('body').toJS() as string;

      if (headers['content-type']?.startsWith('image/')) {
        try {
          const buffer = Buffer.from(body, 'base64');

          if (buffer.length === 0) {
            console.error('Empty buffer after base64 conversion');
            res.status(500).send('Failed to decode image data');
            return;
          }

          res.status(response.call('status_code').toJS() as number);
          res.type(headers['content-type']);
          res.send(buffer);
          return;
        } catch (e) {
          const error = e as Error;
          console.error(`failed to decode image (${headers['content-type']}):`, e);
          res.status(500).send(`Express Error: ${error.message}`);
        }
      }

      res.status(response.call('status_code').toJS() as number);
      res.send(body);
    } else {
      res.status(result.call('error').toJS() as number).send(
        `Internal Application Error: ${result.call('value').toJS()}`
      );
    }
  }
}

// We convert files from forms into data URIs and handle them via Rack DataUriUploads middleware.
const DATA_URI_UPLOAD_PREFIX = 'BbC14y';

const fileToDataURI = async (file: Buffer, mimetype?: string): Promise<string> => {
  const base64 = file.toString('base64');
  const mimeType = mimetype || 'application/octet-stream';
  return `data:${mimeType};base64,${base64}`;
};

const flattenObject = (
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, string> => {
  const params: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const paramKey = prefix ? `${prefix}[${key}]` : key;

    if (value === null || value === undefined) {
      // ignore
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      const nestedParams = flattenObject(value as Record<string, unknown>, paramKey);
      Object.entries(nestedParams).forEach(([k, v]) => (params[k] = v));
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          const nestedParams = flattenObject(item as Record<string, unknown>, `${paramKey}[${index}]`);
          Object.entries(nestedParams).forEach(([k, v]) => (params[k] = v));
        } else {
          params[`${paramKey}[]`] = String(item);
        }
      });
    } else {
      params[paramKey] = String(value);
    }
  }

  return params;
};

interface MulterFile {
  fieldname: string;
  buffer: Buffer;
  mimetype: string;
}

const prepareInput = async (req: Request): Promise<string | null> => {
  let input: string | null = null;

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.get('content-type');

    if (contentType?.includes('multipart/form-data')) {
      const formData = flattenObject({ ...req.body });
      const files = (req.files as MulterFile[] | undefined) || [];

      if (files.length > 0) {
        await Promise.all(
          files.map(async (file) => {
            try {
              const dataURI = await fileToDataURI(file.buffer, file.mimetype);
              formData[file.fieldname] = DATA_URI_UPLOAD_PREFIX + dataURI;
            } catch (e) {
              const error = e as Error;
              console.warn(
                `Failed to convert file into data URI: ${error.message}. Ignoring file form input ${file.fieldname}`
              );
            }
          })
        );
      }

      const params = new URLSearchParams(formData);
      input = params.toString();
    } else {
      let body = '';
      req.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });
      await new Promise<void>((resolve) => req.on('end', resolve));
      input = body;
    }
  }

  return input;
};

/**
 * Queue for serializing Rails requests.
 *
 * Rails isn't thread-safe in WASM, so we must process one request at a time.
 * This queue ensures requests are handled sequentially.
 */
export class RequestQueue {
  private _handler: RequestHandler;
  private isProcessing: boolean;
  private queue: QueuedRequest[];

  constructor(handler: RequestHandler) {
    this._handler = handler;
    this.isProcessing = false;
    this.queue = [];
  }

  async respond(req: Request, res: Response): Promise<void> {
    if (this.isProcessing) {
      return new Promise((resolve) => {
        this.queue.push({ req, res, resolve });
      });
    }
    await this.process(req, res);
    queueMicrotask(() => this.tick());
  }

  private async process(req: Request, res: Response): Promise<void> {
    this.isProcessing = true;
    try {
      await this._handler(req, res);
    } catch (e) {
      const error = e as Error;
      console.error(e);
      res.status(500).send(`Application Error: ${error.message}`);
    } finally {
      this.isProcessing = false;
    }
  }

  private async tick(): Promise<void> {
    if (this.queue.length === 0) {
      return;
    }
    const { req, res, resolve } = this.queue.shift()!;
    await this.process(req, res);
    resolve();
    queueMicrotask(() => this.tick());
  }
}

let counter = 0;

const requestHandler = async (vm: RubyVM, req: Request, res: Response): Promise<void> => {
  const input = await prepareInput(req);
  const incomingRequest = new IncomingRequest(req, input);
  const responseOut = new ResponseOutparam(req, res);

  const requestId = `req-${counter++}`;
  const responseId = `res-${counter}`;

  const globalObj = global as unknown as Record<string, unknown>;
  globalObj[requestId] = incomingRequest;
  globalObj[responseId] = responseOut;

  const command = `
    $incoming_handler.handle(
      Rack::WASI::IncomingRequest.new("${requestId}"),
      Rack::WASI::ResponseOutparam.new("${responseId}")
    )
  `;

  try {
    await vm.evalAsync(command);
    await responseOut.promise;
    await responseOut.finish();
  } catch (e) {
    const error = e as Error;
    res.status(500).send(`Unexpected Error: ${error.message.slice(0, 100)}`);
  } finally {
    delete globalObj[requestId];
    delete globalObj[responseId];
  }
};

/**
 * Create an Express.js server that bridges HTTP requests to the Ruby Rack application.
 *
 * @example
 * ```typescript
 * import { initVM, createRackServer } from 'rails-wasm';
 *
 * const vm = await initVM({ ... });
 * const server = await createRackServer(vm);
 *
 * server.listen(3000, () => {
 *   console.log('Rails server running on port 3000');
 * });
 * ```
 */
export const createRackServer = async (
  vm: RubyVM,
  opts: RackServerOptions = {}
): Promise<Express> => {
  const { skipRackup } = opts;

  if (!skipRackup) {
    // Set up Rack handler (if hasn't been already set up)
    await vm.evalAsync(`
      require "rack/builder"
      require "rack/wasi/incoming_handler"

      app = Rack::Builder.load_file("./config.ru")

      $incoming_handler = Rack::WASI::IncomingHandler.new(app)
    `);
  }

  const app = express();

  const upload = multer({ storage: multer.memoryStorage() });
  app.use(upload.any());
  app.use(createFrameLocationTrackingMiddleware());

  const queue = new RequestQueue((req, res) => requestHandler(vm, req, res));

  app.all('*path', async (req, res) => {
    await queue.respond(req, res);
  });

  return app;
};
