import {
  checkDatabase,
  closePool,
  createPool,
  createDatabaseClient,
  createContactRepository,
  type ContactRepository,
  createAnalyticsRepository,
  type AnalyticsRepository,
  createAdminRepository,
  type AdminRepository,
} from '@portfolio/database';
import type { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

export interface DatabaseDependency {
  contacts?: ContactRepository;
  analytics?: AnalyticsRepository;
  admin?: AdminRepository;
  check(): Promise<void>;
  close(): Promise<void>;
}

declare module 'fastify' {
  interface FastifyInstance {
    database: DatabaseDependency;
  }
}

interface DatabasePluginOptions {
  database: DatabaseDependency;
}

const databasePluginImplementation: FastifyPluginAsync<DatabasePluginOptions> = async (
  app,
  options,
) => {
  app.decorate('database', options.database);
  app.addHook('onClose', async () => {
    await options.database.close();
  });
};

export const databasePlugin = fastifyPlugin(databasePluginImplementation, {
  name: 'database',
});

export function createPostgresDependency(databaseUrl: string): DatabaseDependency {
  const pool = createPool(databaseUrl);

  return {
    contacts: createContactRepository(createDatabaseClient(pool)),
    analytics: createAnalyticsRepository(createDatabaseClient(pool)),
    admin: createAdminRepository(createDatabaseClient(pool)),
    check: async () => checkDatabase(pool),
    close: async () => closePool(pool),
  };
}
