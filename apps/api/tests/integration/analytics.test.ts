import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, expect, it } from 'vitest';
import {
  createAnalyticsRepository,
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
const source =
  process.env.DATABASE_URL ??
  'postgresql://portfolio:portfolio_local_only@127.0.0.1:5432/portfolio';
const origin = 'http://localhost:3000';
const config = {
  secret: 'fictitious-integration-only-signing-key',
  webOrigin: origin,
  secure: false,
};
let temporary: TemporaryDatabase;
let pool: ReturnType<typeof createPool>;
beforeAll(async () => {
  temporary = await createTemporaryDatabase(source);
  pool = createPool(temporary.url);
  await runMigrations(pool);
  await runMigrations(pool);
});
afterAll(async () => {
  await closeTestApps();
  await pool?.end();
  if (temporary) await dropTemporaryDatabase(source, temporary.name);
});
function cookies(response: { headers: Record<string, unknown> }) {
  const values = response.headers['set-cookie'];
  return (Array.isArray(values) ? values : [values])
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.split(';')[0])
    .join('; ');
}
function event(at: number) {
  return {
    id: randomUUID(),
    name: 'page_view',
    at,
    dimensions: {
      page: 'home',
      language: 'es',
      theme: 'light',
      device: 'desktop',
      browser: 'other',
    },
    properties: { page: 'home' },
  };
}
async function setup() {
  let time = Date.parse('2026-10-09T12:00:00Z');
  const app = await createTestApp({
    analytics: {
      config,
      repository: createAnalyticsRepository(createDatabaseClient(pool)),
      now: () => time,
    },
  });
  return {
    app,
    now: () => time,
    advance: (ms: number) => {
      time += ms;
    },
  };
}
it('sin decisión y rechazo no crean identidad ni perfiles; aceptación 180 días y revocación bloquean lotes tardíos', async () => {
  const { app, now } = await setup();
  const count = await pool.query('select count(*) from platform.analytics_consents');
  const undecided = await app.inject({ url: '/api/v1/privacy/consent' });
  expect(undecided.json()).toEqual({ state: 'undecided', expiresAt: null });
  expect(undecided.headers['cache-control']).toContain('no-store');
  const rejected = await app.inject({
    method: 'POST',
    url: '/api/v1/privacy/consent',
    headers: { origin },
    payload: { analytics: false },
  });
  expect(rejected.statusCode).toBe(200);
  expect(rejected.json().expiresAt - now()).toBe(180 * 86400_000);
  expect((await pool.query('select count(*) from platform.analytics_consents')).rows).toEqual(
    count.rows,
  );
  expect(cookies(rejected)).toContain('analytics_visitor=;');
  const batch = { version: 1, events: [event(now())] };
  for (const cookie of ['', cookies(rejected)])
    expect(
      (
        await app.inject({
          method: 'POST',
          url: '/api/v1/analytics/events',
          headers: { origin, cookie },
          payload: batch,
        })
      ).statusCode,
    ).toBe(403);
  const accepted = await app.inject({
    method: 'POST',
    url: '/api/v1/privacy/consent',
    headers: { origin },
    payload: { analytics: true },
  });
  expect(accepted.statusCode).toBe(200);
  const cookie = cookies(accepted);
  expect(cookie).toMatch(/analytics_visitor=.+/);
  const sent = await app.inject({
    method: 'POST',
    url: '/api/v1/analytics/events',
    headers: { origin, cookie },
    payload: batch,
  });
  expect(sent.statusCode).toBe(200);
  expect(
    (
      await pool.query('select count(*) from platform.analytics_events where id=$1', [
        batch.events[0]!.id,
      ])
    ).rows[0].count,
  ).toBe('1');
  expect(
    (
      await app.inject({
        method: 'DELETE',
        url: '/api/v1/privacy/consent',
        headers: { origin, cookie },
      })
    ).statusCode,
  ).toBe(200);
  expect(
    (
      await app.inject({
        method: 'POST',
        url: '/api/v1/analytics/events',
        headers: { origin, cookie },
        payload: { version: 1, events: [event(now())] },
      })
    ).statusCode,
  ).toBe(403);
  expect(
    (
      await pool.query('select count(*) from platform.analytics_events where id=$1', [
        batch.events[0]!.id,
      ])
    ).rows[0].count,
  ).toBe('1');
});
it('rechaza cookies manipuladas, expiradas, orígenes falsos, propiedades libres, backdating, UTM desconocidas y payload excesivo', async () => {
  const { app, now, advance } = await setup();
  const accepted = await app.inject({
    method: 'POST',
    url: '/api/v1/privacy/consent',
    headers: { origin },
    payload: { analytics: true },
  });
  const cookie = cookies(accepted);
  const send = (payload: unknown, headers = { origin, cookie }) =>
    app.inject({ method: 'POST', url: '/api/v1/analytics/events', headers, payload });
  expect(
    (await send({ version: 1, events: [event(now())] }, { origin: 'https://evil.example', cookie }))
      .statusCode,
  ).toBe(403);
  expect(
    (
      await send(
        { version: 1, events: [event(now())] },
        { origin, cookie: cookie.replace('privacy_preference=', 'privacy_preference=x') },
      )
    ).statusCode,
  ).toBe(403);
  expect((await send({ version: 1, events: [event(now() - 300001)] })).statusCode).toBe(400);
  for (const payload of [
    { version: 1, consent: true, events: [event(now())] },
    { version: 1, events: [{ ...event(now()), properties: { page: 'home', email: 'forbidden' } }] },
    {
      version: 1,
      events: [
        { ...event(now()), dimensions: { ...event(now()).dimensions, utm_source: 'private' } },
      ],
    },
    { version: 1, events: Array.from({ length: 21 }, () => event(now())) },
  ])
    expect((await send(payload)).statusCode).toBe(400);
  expect(
    (await send({ version: 1, events: [event(now())], extra: 'x'.repeat(32768) })).statusCode,
  ).toBe(413);
  advance(180 * 86400_000);
  expect((await send({ version: 1, events: [event(now())] })).statusCode).toBe(403);
  expect(
    (await app.inject({ url: '/api/v1/privacy/consent', headers: { cookie } })).json().state,
  ).toBe('undecided');
});
it('rota visitante sin correspondencias a 30 días, sesión a 30 minutos y aceptación posterior al retiro', async () => {
  const { app, now, advance } = await setup();
  const accepted = await app.inject({
    method: 'POST',
    url: '/api/v1/privacy/consent',
    headers: { origin },
    payload: { analytics: true },
  });
  const preference = cookies(accepted).split('; ')[0]!;
  let cookie = cookies(accepted);
  const ids: { visitor_id: string; id: string }[] = [];
  for (const delta of [0, 29 * 60_000, 30 * 60_000, 30 * 86400_000]) {
    advance(delta);
    const input = event(now());
    const sent = await app.inject({
      method: 'POST',
      url: '/api/v1/analytics/events',
      headers: { origin, cookie },
      payload: { version: 1, events: [input] },
    });
    expect(sent.statusCode).toBe(200);
    cookie = `${preference}; ${cookies(sent)}`;
    ids.push(
      (
        await pool.query(
          'select s.id,s.visitor_id from platform.analytics_sessions s join platform.analytics_events e on e.session_id=s.id where e.id=$1',
          [input.id],
        )
      ).rows[0],
    );
  }
  expect(ids[0]!.id).toBe(ids[1]!.id);
  expect(ids[1]!.id).not.toBe(ids[2]!.id);
  expect(ids[0]!.visitor_id).toBe(ids[2]!.visitor_id);
  expect(ids[2]!.visitor_id).not.toBe(ids[3]!.visitor_id);
  const links = await pool.query(
    'select consent_id from platform.analytics_sessions where id=any($1::uuid[]) order by first_at',
    [ids.map((row) => row.id)],
  );
  expect(links.rows.slice(0, -1).every((row) => row.consent_id === null)).toBe(true);
  expect(links.rows.at(-1)!.consent_id).not.toBeNull();
  expect(ids.every((row) => row.id !== row.visitor_id)).toBe(true);
  await app.inject({
    method: 'DELETE',
    url: '/api/v1/privacy/consent',
    headers: { origin, cookie },
  });
  const again = await app.inject({
    method: 'POST',
    url: '/api/v1/privacy/consent',
    headers: { origin, cookie },
    payload: { analytics: true },
  });
  expect(cookies(again)).not.toBe(cookies(accepted));
});
it('deduplica el reintento incluso si se perdió la respuesta que emitía cookie de sesión', async () => {
  const { app, now } = await setup();
  const accepted = await app.inject({
    method: 'POST',
    url: '/api/v1/privacy/consent',
    headers: { origin },
    payload: { analytics: true },
  });
  const cookie = cookies(accepted);
  const input = event(now());
  const before = (await pool.query('select count(*) from platform.analytics_sessions')).rows;
  for (let i = 0; i < 2; i++)
    expect(
      (
        await app.inject({
          method: 'POST',
          url: '/api/v1/analytics/events',
          headers: { origin, cookie },
          payload: { version: 1, events: [input] },
        })
      ).statusCode,
    ).toBe(200);
  expect(
    Number((await pool.query('select count(*) from platform.analytics_sessions')).rows[0].count),
  ).toBe(Number(before[0].count) + 1);
  expect(
    (await pool.query('select count(*) from platform.analytics_events where id=$1', [input.id]))
      .rows[0].count,
  ).toBe('1');
});
