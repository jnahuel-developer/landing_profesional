import { randomUUID } from 'node:crypto';

import { Client } from 'pg';
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

const TEST_DATABASE_PREFIX = 'portfolio_test_';
const fallbackDatabaseUrl = 'postgresql://portfolio:portfolio_local_only@127.0.0.1:5432/portfolio';
const sourceDatabaseUrl = process.env.DATABASE_URL ?? fallbackDatabaseUrl;
const databaseName = `${TEST_DATABASE_PREFIX}${randomUUID().replaceAll('-', '')}`;

function quoteIdentifier(identifier: string): string {
  if (!identifier.startsWith(TEST_DATABASE_PREFIX) || !/^[a-z0-9_]+$/.test(identifier)) {
    throw new Error('Nombre de base temporal inseguro.');
  }

  return `"${identifier}"`;
}

function databaseUrlFor(name: string): string {
  const url = new URL(sourceDatabaseUrl);
  url.pathname = `/${name}`;
  return url.toString();
}

const adminUrl = databaseUrlFor('postgres');
const testDatabaseUrl = databaseUrlFor(databaseName);
let adminClient: Client;

describe('PostgreSQL real', () => {
  beforeAll(async () => {
    adminClient = new Client({ connectionString: adminUrl });
    await adminClient.connect();
    await adminClient.query(`create database ${quoteIdentifier(databaseName)}`);
  });

  afterAll(async () => {
    if (!adminClient) {
      return;
    }

    await adminClient.query(
      'select pg_terminate_backend(pid) from pg_stat_activity where datname = $1 and pid <> pg_backend_pid()',
      [databaseName],
    );
    await adminClient.query(`drop database if exists ${quoteIdentifier(databaseName)}`);
    await adminClient.end();
  });

  it('abre, comprueba y cierra un pool controlado', async () => {
    const pool = createPool(testDatabaseUrl, { max: 1 });
    createDatabaseClient(pool);
    await expect(checkDatabase(pool)).resolves.toBeUndefined();
    await closePool(pool);
    await expect(pool.query('select 1')).rejects.toThrow();
  });

  it('aplica migraciones dos veces y crea solo los esquemas aprobados', async () => {
    const pool = createPool(testDatabaseUrl, { max: 1 });

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
      expect(tables.rows).toEqual([]);

      await seedDatabase(pool);
      await expect(seedDatabase(pool)).resolves.toBeUndefined();
    } finally {
      await closePool(pool);
    }
  });
});
