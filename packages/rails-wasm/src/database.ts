import { PGlite } from '@electric-sql/pglite';
import { join } from 'node:path';

const MULTILINE_RX =
  /;\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE|WITH|EXPLAIN|ANALYZE|VACUUM|GRANT|REVOKE|BEGIN|COMMIT|ROLLBACK)/i;

interface QueryResult {
  rows: unknown[];
  fields: unknown[];
}

/**
 * Wrapper around PGlite that exposes a query interface compatible with
 * the Ruby pg adapter.
 * @internal
 */
class ExternalInterface {
  private db: PGlite;
  public identifier: string;

  constructor(db: PGlite, identifier: string) {
    this.db = db;
    this.identifier = identifier;
  }

  async query(sql: string, params?: unknown[]): Promise<QueryResult> {
    let res: QueryResult;

    if (MULTILINE_RX.test(sql)) {
      // Multiline SQL (multiple statements) - use exec
      const results = await this.db.exec(sql);
      res = results[0] as QueryResult;
    } else {
      // Single statement - use query
      res = (await this.db.query(sql, params)) as QueryResult;
    }

    return res;
  }
}

/**
 * PGLite adapter for Rails.
 *
 * Provides a PostgreSQL-compatible database interface using PGLite
 * (Postgres compiled to WASM). Rails applications can use this
 * adapter to run with a real SQL database in the browser.
 *
 * @example
 * ```typescript
 * import { PGLite4Rails } from 'rails-wasm/database';
 *
 * const pglite = new PGLite4Rails('./pgdata');
 * const interfaceId = await pglite.create_interface('development');
 * // The interface is now available in global[interfaceId]
 * ```
 */
export class PGLite4Rails {
  private dbs: Record<string, ExternalInterface>;
  private dataDir: string;

  constructor(dataDir: string) {
    // Created databases
    this.dbs = {};
    // Base directory for all databases
    this.dataDir = dataDir;
  }

  /**
   * Create or retrieve a database interface for the given database name.
   * The interface is registered in the global scope for Ruby to access.
   *
   * @param dbname - The database name (e.g., 'development', 'test')
   * @returns The identifier string used to access the interface from Ruby
   */
  async create_interface(dbname: string): Promise<string> {
    if (this.dbs[dbname]) {
      return this.dbs[dbname].identifier;
    }

    const dataDir = join(this.dataDir, dbname);

    const db = await PGlite.create({ dataDir });
    const ei = new ExternalInterface(db, `pglite4rails_${dbname}`);

    const identifier = ei.identifier;
    const globalObj = global as unknown as Record<string, ExternalInterface>;
    globalObj[identifier] = this.dbs[dbname] = ei;

    return identifier;
  }
}
