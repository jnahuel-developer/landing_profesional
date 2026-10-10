import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  checkDatabase,
  closePool,
  createDatabaseClient,
  createPool,
  runMigrations,
  seedDatabase,
} from '../../src/index.js';
import { applicationSchemaNames } from '../../src/schema.js';
import {
  createTemporaryDatabase,
  dropTemporaryDatabase,
  type TemporaryDatabase,
} from '../helpers/temporary-database.js';

const fallbackDatabaseUrl = 'postgresql://portfolio:portfolio_local_only@127.0.0.1:5432/portfolio';
const sourceDatabaseUrl = process.env.DATABASE_URL ?? fallbackDatabaseUrl;
let temporaryDatabase: TemporaryDatabase | undefined;

describe('PostgreSQL real', () => {
  beforeAll(async () => {
    temporaryDatabase = await createTemporaryDatabase(sourceDatabaseUrl);
  });

  afterAll(async () => {
    if (!temporaryDatabase) {
      return;
    }

    await dropTemporaryDatabase(sourceDatabaseUrl, temporaryDatabase.name);
  });

  it('abre, comprueba y cierra un pool controlado', async () => {
    const pool = createPool(temporaryDatabase!.url, { max: 1 });
    createDatabaseClient(pool);
    await expect(checkDatabase(pool)).resolves.toBeUndefined();
    await closePool(pool);
    await expect(pool.query('select 1')).rejects.toThrow();
  });

  it('aplica migraciones dos veces y crea solo los esquemas aprobados', async () => {
    const pool = createPool(temporaryDatabase!.url, { max: 1 });

    try {
      await runMigrations(pool);
      await expect(runMigrations(pool)).resolves.toBeUndefined();

      const schemas = await pool.query<{ schema_name: string }>(
        `select schema_name
           from information_schema.schemata
          where schema_name = any($1::text[])
          order by schema_name`,
        [applicationSchemaNames],
      );
      expect(schemas.rows.map(({ schema_name }) => schema_name)).toEqual(
        [...applicationSchemaNames].sort(),
      );

      const tables = await pool.query<{ table_schema: string; table_name: string }>(
        `select table_schema, table_name
           from information_schema.tables
          where table_schema = any($1::text[])`,
        [applicationSchemaNames],
      );
      expect(tables.rows.map(({ table_name }) => table_name).sort()).toEqual([
        'admin_audit',
        'admin_sessions',
        'admin_users',
        'analytics_consents',
        'analytics_daily',
        'analytics_events',
        'analytics_sessions',
        'contact_events',
        'contacts',
      ]);

      await seedDatabase(pool);
      await expect(seedDatabase(pool)).resolves.toBeUndefined();
    } finally {
      await closePool(pool);
    }
  });
});
