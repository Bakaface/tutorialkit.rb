#!/usr/bin/env node

/**
 * Postinstall check: verify that public/ruby.wasm exists.
 *
 * In the hybrid wasi-vfs approach, ruby.wasm is built by bin/build-wasm
 * and placed in public/. This script simply checks that it's there.
 */

import { existsSync } from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const wasmPath = path.join(__dirname, '..', 'public', 'ruby.wasm');

if (existsSync(wasmPath)) {
  console.log('[wait-for-wasm] public/ruby.wasm found');
} else {
  console.warn(
    '[wait-for-wasm] public/ruby.wasm not found.\n' +
    '  Run "bin/build-wasm" from the template root to build it.\n' +
    '  The dev server will work but Rails commands will fail without it.'
  );
}
