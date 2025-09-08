import { PGLite4Rails } from '../database.js';

export async function createDatabase(dbName: string, dataDir: string): Promise<void> {
  const pglite = new PGLite4Rails(dataDir);
  await pglite.create_interface(dbName);
  console.log(`Database ${dbName} created successfully`);
}
