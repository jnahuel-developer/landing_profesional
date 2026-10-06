import Fastify from 'fastify';

const serviceStatus = {
  service: 'portfolio-api',
  version: 'v1',
  status: 'operational',
} as const;

export function buildApp() {
  const app = Fastify({ logger: true });

  app.get('/api/v1', async () => serviceStatus);

  return app;
}
