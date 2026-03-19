// HTTP bridge for Ruby WASM — registers global.wasmHttpBridge
// Follows the same pattern as PGLite (global.pglite = new PGLite4Rails(...))

export function initHttpBridge() {
  global.wasmHttpBridge = {
    async fetch(url, method, headersJson, body) {
      try {
        const headers = JSON.parse(headersJson);
        const options = { method, headers };
        if (body && method !== 'GET' && method !== 'HEAD') {
          options.body = body;
        }

        console.log(`[http-bridge] ${method} ${url}`);
        options.signal = AbortSignal.timeout(30000);
        const response = await fetch(url, options);
        console.log(`[http-bridge] ${response.status} ${url}`);

        const contentType = response.headers.get('content-type') || '';
        const isBinary = /octet-stream|image\/|audio\/|video\/|application\/pdf|application\/zip/.test(contentType);

        let responseBody;
        if (isBinary) {
          const buffer = await response.arrayBuffer();
          const bytes = new Uint8Array(buffer);
          let binary = '';
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          responseBody = btoa(binary);
        } else {
          responseBody = await response.text();
        }

        const responseHeaders = {};
        response.headers.forEach((v, k) => { responseHeaders[k] = v; });

        return JSON.stringify({
          ok: true,
          status: response.status,
          headers: responseHeaders,
          body: responseBody,
          binary: isBinary
        });
      } catch (error) {
        const detail = error.cause ? `${error.message} (cause: ${error.cause.message || error.cause})` : error.message;
        console.error(`[http-bridge] ERROR ${method} ${url}: ${detail}`);
        return JSON.stringify({
          ok: false,
          error: detail
        });
      }
    }
  };
}
