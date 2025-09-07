import { join } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const MULTILINE_RX =
  /;\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE|WITH|EXPLAIN|ANALYZE|VACUUM|GRANT|REVOKE|BEGIN|COMMIT|ROLLBACK)/i;

class ExternalInterface {
  identifier: string;
  private db: PGlite;

  constructor(db: PGlite, identifier: string) {
    this.db = db;
    this.identifier = identifier;
  }

  async query(sql: string, params?: any): Promise<any> {
    let res: any;

    if (MULTILINE_RX.test(sql)) {
      res = (await this.db.exec(sql, params))[0];
    } else {
      res = await this.db.query(sql, params);
    }

    return res;
  }
}

export class PGLite4Rails {
  private dbs: Record<string, ExternalInterface> = {};
  private dataDir: string;

  constructor(dataDir: string) {
    // Created databases
    this.dbs = {};

    // Base directory for all databases
    this.dataDir = dataDir;
  }

  async create_interface(dbname: string): Promise<string> {
    if (this.dbs[dbname]) {
      return this.dbs[dbname].identifier;
    }

    const dataDir = join(this.dataDir, dbname);

    const db = await PGlite.create({ dataDir });
    const ei = new ExternalInterface(db, `pglite4rails_${dbname}`);

    const identifier = ei.identifier;
    (global as any)[identifier] = this.dbs[dbname] = ei;

    return identifier;
  }
}
