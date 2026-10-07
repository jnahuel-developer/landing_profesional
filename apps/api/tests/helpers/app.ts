import type { FastifyInstance } from 'fastify';

import { buildApp, type BuildAppOptions } from '../../src/app.js';

const openApplications = new Set<FastifyInstance>();

export async function createTestApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = await buildApp(options);
  openApplications.add(app);
  return app;
}

export async function closeTestApps(): Promise<void> {
  const applications = [...openApplications];
  openApplications.clear();

  await Promise.all(applications.map(async (app) => app.close()));
}
