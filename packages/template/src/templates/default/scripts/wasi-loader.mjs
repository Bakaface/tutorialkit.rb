// Node.js module resolution hook: remaps bare 'wasi' → 'node:wasi'
// WebContainer provides 'wasi' as a bare specifier; Node.js needs 'node:wasi'.
// Usage: node --loader ./scripts/wasi-loader.mjs

export function resolve(specifier, context, next) {
  if (specifier === 'wasi') {
    return { url: 'node:wasi', shortCircuit: true };
  }
  return next(specifier, context);
}
