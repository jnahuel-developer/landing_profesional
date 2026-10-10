import { buildApp } from './app.js';
import { loadRuntimeConfig } from './config/env.js';
import { createPostgresDependency } from './plugins/database.js';
import { loadContactConfig } from './modules/contacts/config.js';
import { loadAnalyticsConfig } from './modules/analytics/config.js';
import { loadAdminConfig } from './modules/admin/config.js';

const config = loadRuntimeConfig();
const contacts = loadContactConfig(process.env);
const analytics = { config: loadAnalyticsConfig() };
const app = await buildApp({
  nodeEnv: config.nodeEnv,
  database: createPostgresDependency(config.databaseUrl),
  logger: true,
  contacts,
  analytics,
  admin: { config: loadAdminConfig() },
});
let isClosing = false;

async function closeServer(signal: NodeJS.Signals): Promise<void> {
  if (isClosing) {
    return;
  }

  isClosing = true;
  app.log.info({ signal }, 'Closing API');
  await app.close();
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void closeServer(signal);
  });
}

try {
  await app.listen({ host: '127.0.0.1', port: config.port });
  app.log.info({ environment: config.nodeEnv }, 'API is operational');
} catch (error) {
  app.log.error({ err: error }, 'API failed to start');
  await app.close();
  process.exitCode = 1;
}
