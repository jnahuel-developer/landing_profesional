import { fileURLToPath } from 'node:url';

import { migrate } from 'drizzle-orm/node-postgres/migrator';
import type { Pool } from 'pg';

import { createDatabaseClient } from './client.js';

const migrationsFolder = fileURLToPath(new URL('../drizzle', import.meta.url));

export async function runMigrations(pool: Pool): Promise<void> {
  await migrate(createDatabaseClient(pool), { migrationsFolder });
}
