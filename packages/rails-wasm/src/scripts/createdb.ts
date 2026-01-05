import { PGLite4Rails } from '../database.js';

export interface CreateDbOptions {
  /** Directory to store database files */
  pgDataDir: string;
  /** Database name to create */
  dbname: string;
}

/**
 * Create a PGLite database interface.
 *
 * This is typically called during application setup to initialize
 * the database before running Rails migrations.
 *
 * @example
 * ```typescript
 * import { createDatabase } from 'rails-wasm/scripts';
 *
 * await createDatabase({
 *   pgDataDir: './pgdata',
 *   dbname: 'development'
 * });
 * ```
 */
export async function createDatabase(options: CreateDbOptions): Promise<string> {
  const { pgDataDir, dbname } = options;
  const pglite = new PGLite4Rails(pgDataDir);
  return pglite.create_interface(dbname);
}

/**
 * CLI entry point for createdb script.
 * Usage: node createdb.js <dbname>
 */
export async function main(args: string[] = process.argv.slice(2)): Promise<void> {
  const dbname = args[0];

  if (!dbname) {
    console.error('Usage: createdb <dbname>');
    process.exit(1);
  }

  // Default to relative path from script location
  const pgDataDir = new URL('../pgdata', import.meta.url).pathname;
  await createDatabase({ pgDataDir, dbname });
  console.log(`Database ${dbname} created/connected`);
}
