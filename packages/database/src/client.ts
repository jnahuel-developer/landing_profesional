import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool, type PoolConfig } from 'pg';

export type DatabaseClient = NodePgDatabase;

export function createPool(
  databaseUrl: string,
  options: Omit<PoolConfig, 'connectionString'> = {},
): Pool {
  return new Pool({
    ...options,
    connectionString: databaseUrl,
  });
}

export function createDatabaseClient(pool: Pool): DatabaseClient {
  return drizzle(pool);
}

export async function checkDatabase(pool: Pool): Promise<void> {
  await pool.query('select 1');
}

export async function closePool(pool: Pool): Promise<void> {
  await pool.end();
}
