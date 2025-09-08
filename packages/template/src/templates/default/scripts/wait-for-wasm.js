#!/usr/bin/env node

import path from 'node:path';
import { waitForWasm } from '@tutorialkit-rb/rails-wasm/scripts';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

try {
  await waitForWasm({
    targetDir: path.join(__dirname, '../node_modules/@ruby/wasm-wasi/dist'),
    wasmFile: path.join(__dirname, '../ruby.wasm'),
    logFile: path.join(__dirname, '../ruby.wasm.log.txt'),
    statusTimeout: 30000,
    overallTimeout: 300000,
  });
} catch (error) {
  console.error('Preinstall script failed:', error);
  process.exit(1);
}
