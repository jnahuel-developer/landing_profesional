import { randomBytes } from 'node:crypto';
import { afterAll, beforeAll, expect, it } from 'vitest';
import {
  createAdminRepository,
  createDatabaseClient,
  createPool,
  runMigrations,
} from '@portfolio/database';
import {
  createTemporaryDatabase,
  dropTemporaryDatabase,
  type TemporaryDatabase,
} from '../../../../packages/database/tests/helpers/temporary-database.js';
import { closeTestApps, createTestApp } from '../helpers/app.js';
import { hashPassword } from '../../src/modules/admin/password.js';
import { SESSION_MS } from '../../src/modules/admin/routes.js';
import { runAdminCommand } from '../../src/modules/admin/commands.js';

const source =
  process.env.DATABASE_URL ??
  'postgresql://portfolio:portfolio_local_only@127.0.0.1:5432/portfolio';
const origin = 'http://localhost:3000';
let temporary: TemporaryDatabase;
let pool: ReturnType<typeof createPool>;
let repo: ReturnType<typeof createAdminRepository>;
const secret = randomBytes(24).toString('hex');
beforeAll(async () => {
  temporary = await createTemporaryDatabase(source);
  pool = createPool(temporary.url);
  await runMigrations(pool);
  await runMigrations(pool);
  repo = createAdminRepository(createDatabaseClient(pool));
});
afterAll(async () => {
  await closeTestApps();
  await pool?.end();
  if (temporary) await dropTemporaryDatabase(source, temporary.name);
});
async function setup(attempts = 100, secure = false) {
  let time = Date.parse('2026-10-10T12:00:00Z');
  const app = await createTestApp({
    admin: {
      repository: repo,
      now: () => time,
      wait: async () => {},
      config: { webOrigin: origin, secure, attempts, globalAttempts: 100 },
      registerRoutes: (admin) => {
        admin.get('/fixture', async () => ({ private: true }));
        admin.post('/fixture', async () => ({ private: true }));
        admin.get('/fixture-error', async () => {
          throw Object.assign(new Error('safe'), { statusCode: 403 });
        });
      },
    },
  });
  const login = (password = secret, identifier = 'ADMIN', cookie = '') =>
    app.inject({
      method: 'POST',
      url: '/api/v1/admin/auth/login',
      headers: { origin, cookie },
      payload: { identifier, password },
    });
  const session = (cookie: string) =>
    app.inject({ url: '/api/v1/admin/auth/session', headers: { cookie } });
  return {
    app,
    login,
    session,
    now: () => time,
    advance: (ms: number) => {
      time += ms;
    },
  };
}
function cookie(response: { headers: Record<string, unknown> }) {
  return String(response.headers['set-cookie']).split(';')[0]!;
}
it('cuenta ausente segura, creación única incluso en carrera y hash sólo en PostgreSQL', async () => {
  const { login } = await setup();
  const absent = await login();
  expect(absent.statusCode).toBe(401);
  const hash = await hashPassword(secret);
  const results = await Promise.allSettled([
    repo.create('admin', hash),
    repo.create('admin', hash),
  ]);
  expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
  expect((await repo.user())!.identifier).toBe('admin');
  expect((await repo.user())!.passwordHash.startsWith('$argon2id$')).toBe(true);
  expect((await login(randomBytes(24).toString('hex'))).json().message).toBe(absent.json().message);
  expect((await login(secret, 'unknown')).statusCode).toBe(401);
});
it('digest, ocho horas absolutas, no renovación, rotación, guard común y CSRF', async () => {
  const { app, login, session, now, advance } = await setup();
  const first = await login();
  expect(first.statusCode).toBe(200);
  const firstCookie = cookie(first);
  expect(first.headers['set-cookie']).toContain('HttpOnly; SameSite=Strict; Max-Age=28800');
  expect(first.headers['cache-control']).toBe('no-store, private');
  expect(Object.keys(first.json()).sort()).toEqual(['csrf', 'expiresAt', 'identifier']);
  expect(first.json().expiresAt - now()).toBe(SESSION_MS);
  const stored = (await pool.query('select * from platform.admin_sessions')).rows;
  expect(stored.some((row) => firstCookie.includes(row.digest))).toBe(false);
  expect(stored.every((row) => row.digest.length === 64)).toBe(true);
  for (const bad of [
    '',
    `admin_session=${randomBytes(32).toString('hex')}`,
    'admin_session=invalid',
  ]) {
    expect((await session(bad)).statusCode).toBe(401);
    expect(
      (await app.inject({ url: '/api/v1/admin/fixture', headers: { cookie: bad } })).statusCode,
    ).toBe(401);
  }
  const second = await login(secret, 'admin', firstCookie);
  const active = cookie(second);
  expect(active).not.toBe(firstCookie);
  expect((await session(firstCookie)).statusCode).toBe(401);
  expect(
    (await app.inject({ url: '/api/v1/admin/fixture', headers: { cookie: active } })).statusCode,
  ).toBe(200);
  for (const headers of [
    { cookie: active },
    { cookie: active, origin: 'null' },
    { cookie: active, origin },
    { cookie: active, origin, 'x-admin-csrf': randomBytes(32).toString('hex') },
  ]) {
    expect(
      (await app.inject({ method: 'POST', url: '/api/v1/admin/fixture', headers })).statusCode,
    ).toBe(403);
  }
  expect(
    (
      await app.inject({
        method: 'POST',
        url: '/api/v1/admin/fixture',
        headers: { cookie: active, origin, 'x-admin-csrf': second.json().csrf },
      })
    ).statusCode,
  ).toBe(200);
  expect(
    (await app.inject({ url: '/api/v1/admin/fixture-error', headers: { cookie: active } }))
      .statusCode,
  ).toBe(403);
  advance(SESSION_MS - 1);
  expect((await session(active)).json().expiresAt).toBe(second.json().expiresAt);
  advance(1);
  expect((await session(active)).statusCode).toBe(401);
  expect(
    (await app.inject({ url: '/api/v1/admin/fixture', headers: { cookie: active } })).statusCode,
  ).toBe(401);
});
it('logout invalida servidor, reutilización rechazada, atributos idénticos e idempotencia', async () => {
  const { app, login, session } = await setup(100, true);
  const authenticated = await login();
  const active = cookie(authenticated);
  expect(authenticated.headers['set-cookie']).toContain('Secure');
  const logout = () =>
    app.inject({
      method: 'POST',
      url: '/api/v1/admin/auth/logout',
      headers: { origin, cookie: active, 'x-admin-csrf': authenticated.json().csrf },
    });
  expect((await logout()).statusCode).toBe(200);
  expect((await session(active)).statusCode).toBe(401);
  const again = await logout();
  expect(again.statusCode).toBe(200);
  expect(again.headers['set-cookie']).toBe(
    'admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Secure',
  );
});
it('comandos cambian contraseña y revocan todos los tokens contra servidor', async () => {
  const { login, session } = await setup();
  const a = cookie(await login());
  const b = cookie(await login());
  const replacement = randomBytes(24).toString('hex');
  await runAdminCommand('password', repo, { read: async () => replacement });
  for (const active of [a, b]) expect((await session(active)).statusCode).toBe(401);
  expect((await login()).statusCode).toBe(401);
  const fresh = cookie(await login(replacement));
  await runAdminCommand('revoke-sessions', repo, { read: async () => '' });
  expect((await session(fresh)).statusCode).toBe(401);
  await repo.invalidate(await hashPassword(secret));
  const staleUser = (await repo.user())!;
  await repo.invalidate();
  expect(
    await repo.rotate(staleUser, {
      digest: randomBytes(32).toString('hex'),
      csrf: randomBytes(32).toString('hex'),
      userId: staleUser.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + SESSION_MS),
    }),
  ).toBe(false);
});
it('rechaza origen, JSON inválido/excesivo, conserva status y limita sin confiar XFF', async () => {
  const { app, login, advance } = await setup(5);
  for (const value of [undefined, 'null', 'https://evil.example', `${origin}/`]) {
    expect(
      (
        await app.inject({
          method: 'POST',
          url: '/api/v1/admin/auth/login',
          headers: value ? { origin: value } : {},
          payload: { identifier: 'admin', password: secret },
        })
      ).statusCode,
    ).toBe(403);
  }
  const send = (payload: string) =>
    app.inject({
      method: 'POST',
      url: '/api/v1/admin/auth/login',
      headers: {
        origin,
        'content-type': 'application/json',
        'x-forwarded-for': randomBytes(8).toString('hex'),
      },
      payload,
    });
  expect((await send('{')).statusCode).toBe(400);
  expect(
    (await send(JSON.stringify({ identifier: 'admin', password: secret, extra: true }))).statusCode,
  ).toBe(400);
  expect(
    (await send(JSON.stringify({ identifier: 'admin', password: 'x'.repeat(2048) }))).statusCode,
  ).toBe(413);
  await login(secret, 'missing');
  await login(secret, 'missing');
  const limited = await login();
  expect(limited.statusCode).toBe(429);
  expect(limited.headers['retry-after']).toBe('900');
  await login();
  advance(900000);
  expect((await login()).statusCode).toBe(200);
  const columns = (
    await pool.query(
      "select column_name from information_schema.columns where table_schema='platform' and table_name='admin_audit' order by column_name",
    )
  ).rows.map((row) => row.column_name);
  expect(columns).toEqual(['code', 'created_at', 'id']);
  const rows = (await pool.query('select code from platform.admin_audit')).rows;
  for (const code of [
    'LOGIN_OK',
    'LOGIN_FAILED',
    'RATE_LIMIT',
    'LOGOUT',
    'PASSWORD_CHANGED',
    'SESSIONS_REVOKED',
  ])
    expect(rows.some((row) => row.code === code)).toBe(true);
});
it('retención exacta 180 días e idempotencia sin tocar cuenta ni contactos/analítica', async () => {
  const { login, now } = await setup();
  await login();
  const time = new Date(now() + SESSION_MS);
  const boundary = new Date(time.getTime() - 180 * 86400_000);
  await pool.query('insert into platform.admin_audit (code,created_at) values ($1,$2),($1,$3)', [
    'LOGIN_FAILED',
    boundary,
    new Date(boundary.getTime() - 1),
  ]);
  const user = await repo.user();
  await repo.retain(time);
  const rows = (await pool.query('select * from platform.admin_audit')).rows;
  expect(rows.some((row) => row.created_at.getTime() === boundary.getTime())).toBe(true);
  expect(rows.some((row) => row.created_at.getTime() < boundary.getTime())).toBe(false);
  expect(
    Number(
      (
        await pool.query('select count(*) from platform.admin_sessions where expires_at <= $1', [
          time,
        ])
      ).rows[0].count,
    ),
  ).toBe(0);
  expect(
    Number(
      (
        await pool.query('select count(*) from platform.admin_sessions where expires_at > $1', [
          time,
        ])
      ).rows[0].count,
    ),
  ).toBeGreaterThan(0);
  await repo.retain(time);
  expect((await pool.query('select * from platform.admin_audit')).rows).toEqual(rows);
  expect((await repo.user())?.id === user?.id).toBe(true);
});
it('DB caída no autoriza ni confirma logout y devuelve 503 seguro', async () => {
  const downPool = createPool(temporary.url);
  const downRepo = createAdminRepository(createDatabaseClient(downPool));
  await downPool.end();
  const app = await createTestApp({ admin: { repository: downRepo } });
  for (const request of [
    {
      url: '/api/v1/admin/auth/session',
      headers: { cookie: `admin_session=${randomBytes(32).toString('hex')}` },
    },
    { method: 'POST' as const, url: '/api/v1/admin/auth/logout', headers: { origin } },
    {
      method: 'POST' as const,
      url: '/api/v1/admin/auth/login',
      headers: { origin },
      payload: { identifier: 'admin', password: secret },
    },
  ]) {
    const result = await app.inject(request);
    expect(result.statusCode).toBe(503);
    expect(result.headers['set-cookie']).toBeUndefined();
    expect(result.json().code).toBe('SERVICE_UNAVAILABLE');
  }
});
