import { ERROR_CODES } from '@portfolio/contracts';
import { Type } from 'typebox';
import { describe, expect, it, vi } from 'vitest';

import { buildApp } from '../../src/app.js';
import type { DatabaseDependency } from '../../src/plugins/database.js';

function databaseDependency(overrides: Partial<DatabaseDependency> = {}): DatabaseDependency {
  return {
    check: overrides.check ?? (async () => undefined),
    close: overrides.close ?? (async () => undefined),
  };
}

describe('aplicación Fastify', () => {
  it('se construye, inyecta la ruta técnica y cierra sin listener', async () => {
    const close = vi.fn(async () => undefined);
    const app = await buildApp({ database: databaseDependency({ close }) });

    const response = await app.inject({ method: 'GET', url: '/api/v1' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      service: 'portfolio-api',
      version: 'v1',
      status: 'operational',
    });
    await app.close();
    await app.close();
    expect(close).toHaveBeenCalledOnce();
  });

  it('mantiene live disponible sin consultar PostgreSQL', async () => {
    const check = vi.fn(async () => {
      throw new Error('connection details must not be exposed');
    });
    const app = await buildApp({ database: databaseDependency({ check }) });

    const response = await app.inject({ method: 'GET', url: '/api/v1/health/live' });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.json()).toEqual({ status: 'ok', service: 'portfolio-api' });
    expect(check).not.toHaveBeenCalled();
    await app.close();
  });

  it('devuelve ready 503 con un contrato seguro cuando PostgreSQL falla', async () => {
    const app = await buildApp({
      database: databaseDependency({
        check: async () => {
          throw new Error('postgresql://usuario:secreto@localhost/base select 1');
        },
      }),
    });

    const response = await app.inject({ method: 'GET', url: '/api/v1/health/ready' });
    const payload = response.json();

    expect(response.statusCode).toBe(503);
    expect(response.headers['content-type']).toContain('application/json');
    expect(payload).toMatchObject({
      code: ERROR_CODES.serviceUnavailable,
      message: 'La base de datos no está disponible.',
    });
    expect(payload.requestId).toEqual(expect.any(String));
    expect(response.body).not.toContain('secreto');
    expect(response.body).not.toContain('select 1');
    await app.close();
  });

  it('serializa los errores de validación con request ID', async () => {
    const app = await buildApp();
    app.get(
      '/validation-test',
      {
        schema: {
          querystring: Type.Object({ limit: Type.Integer() }),
        },
      },
      async () => ({ ok: true }),
    );

    const response = await app.inject({
      method: 'GET',
      url: '/validation-test?limit=invalid',
    });
    const payload = response.json();

    expect(response.statusCode).toBe(400);
    expect(payload.code).toBe(ERROR_CODES.validation);
    expect(payload.requestId).toEqual(expect.any(String));
    expect(payload.details).toEqual(expect.any(Array));
    await app.close();
  });

  it('expone OpenAPI solo en development', async () => {
    const development = await buildApp({ nodeEnv: 'development' });
    const test = await buildApp({ nodeEnv: 'test' });
    const production = await buildApp({ nodeEnv: 'production' });

    const specification = await development.inject({
      method: 'GET',
      url: '/documentation/json',
    });
    const userInterface = await development.inject({
      method: 'GET',
      url: '/documentation/',
    });

    expect(specification.statusCode).toBe(200);
    expect(userInterface.statusCode).toBe(200);
    expect(userInterface.headers['content-type']).toContain('text/html');
    expect(specification.json().paths).toHaveProperty('/api/v1/health/live');
    expect((await test.inject({ method: 'GET', url: '/documentation/json' })).statusCode).toBe(404);
    expect(
      (await production.inject({ method: 'GET', url: '/documentation/json' })).statusCode,
    ).toBe(404);

    await Promise.all([development.close(), test.close(), production.close()]);
  });
});
