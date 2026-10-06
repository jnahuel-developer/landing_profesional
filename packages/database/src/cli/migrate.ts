import { closePool, createPool } from '../client.js';
import { loadDatabaseConfig } from '../config.js';
import { runMigrations } from '../migrations.js';

const config = loadDatabaseConfig();
const pool = createPool(config.databaseUrl);

try {
  await runMigrations(pool);
  console.log('Migraciones aplicadas correctamente.');
} finally {
  await closePool(pool);
}
