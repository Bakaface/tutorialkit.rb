import path from 'node:path';
import { createDatabase } from '@tutorialkit-rb/rails-wasm/scripts';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const pgDataDir = path.join(__dirname, '../pgdata');
const dbname = process.argv[2];

if (!dbname) {
  console.error('Database name is required');
  process.exit(1);
}

try {
  await createDatabase(dbname, pgDataDir);
} catch (error) {
  console.error('Failed to create database:', error.message);
  process.exit(1);
}
