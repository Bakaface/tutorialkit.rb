import { spawnRails } from "rails-wasm/scripts";
import path from "node:path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const railsRootDir = path.join(__dirname, "../workspace/store");

const exitCode = await spawnRails({ railsRootDir }, process.argv.slice(2));
process.exit(exitCode);
