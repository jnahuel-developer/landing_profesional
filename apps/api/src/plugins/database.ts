import { checkDatabase, closePool, createPool } from '@portfolio/database';
import type { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

export interface DatabaseDependency {
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
    check: async () => checkDatabase(pool),
    close: async () => closePool(pool),
  };
}
