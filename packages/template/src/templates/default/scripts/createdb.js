import { createDatabase } from "rails-wasm/scripts";
import path from "node:path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const pgDataDir = path.join(__dirname, "../pgdata");
const dbname = process.argv[2];

if (!dbname) {
  console.error('Usage: node createdb.js <dbname>');
  process.exit(1);
}

await createDatabase({ pgDataDir, dbname });
console.log(`Database ${dbname} created/connected`);
