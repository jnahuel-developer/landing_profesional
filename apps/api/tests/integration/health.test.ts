import { checkDatabase, closePool, createPool } from '@portfolio/database';
import { describe, expect, it } from 'vitest';

import { buildApp } from '../../src/app.js';

const fallbackDatabaseUrl = 'postgresql://portfolio:portfolio_local_only@127.0.0.1:5432/portfolio';
const databaseUrl = process.env.DATABASE_URL ?? fallbackDatabaseUrl;

describe('health ready con PostgreSQL real', () => {
  it('responde 200 y cierra el pool con Fastify', async () => {
    const pool = createPool(databaseUrl, { max: 1 });
    const app = await buildApp({
      database: {
        check: async () => checkDatabase(pool),
        close: async () => closePool(pool),
      },
    });

    const response = await app.inject({ method: 'GET', url: '/api/v1/health/ready' });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.json()).toEqual({
      status: 'ok',
      checks: { database: 'up' },
    });

    await app.close();
    await expect(pool.query('select 1')).rejects.toThrow();
  });
});
