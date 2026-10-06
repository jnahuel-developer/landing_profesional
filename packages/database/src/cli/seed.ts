import { closePool, createPool } from '../client.js';
import { loadDatabaseConfig } from '../config.js';
import { seedDatabase } from '../seed.js';

const config = loadDatabaseConfig();
const pool = createPool(config.databaseUrl);

try {
  await seedDatabase(pool);
  console.log('Semilla técnica aplicada correctamente.');
} finally {
  await closePool(pool);
}
