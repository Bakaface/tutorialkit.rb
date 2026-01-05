#!/usr/bin/env node

import { waitForWasm } from "../node_modules/rails-wasm/dist/scripts/index.js";
import path from "node:path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

await waitForWasm({
  targetDir: path.join(__dirname, "../node_modules/@ruby/wasm-wasi/dist"),
  wasmFile: path.join(__dirname, "../ruby.wasm"),
  logFile: path.join(__dirname, "../ruby.wasm.log.txt"),
});
