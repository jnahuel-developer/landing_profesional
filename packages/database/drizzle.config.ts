import { defineConfig } from 'drizzle-kit';

import { loadDatabaseConfig } from './src/config.js';

const config = loadDatabaseConfig();

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: config.databaseUrl,
  },
});
