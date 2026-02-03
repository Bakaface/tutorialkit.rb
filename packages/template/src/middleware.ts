import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Required for WebContainer (SharedArrayBuffer)
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

  // Allow embedding in cross-origin pages
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

  return response;
});
