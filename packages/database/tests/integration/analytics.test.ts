import { randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, expect, it } from 'vitest';
import {
  aggregateAnalytics,
  analyticsDay,
  createAnalyticsRepository,
  createDatabaseClient,
  createPool,
  retainAnalytics,
  runMigrations,
} from '../../src/index.js';
import {
  createTemporaryDatabase,
  dropTemporaryDatabase,
  type TemporaryDatabase,
} from '../helpers/temporary-database.js';
const source =
  process.env.DATABASE_URL ??
  'postgresql://portfolio:portfolio_local_only@127.0.0.1:5432/portfolio';
let temporary: TemporaryDatabase;
let pool: ReturnType<typeof createPool>;
const now = new Date('2026-10-09T12:00:00Z');
beforeAll(async () => {
  temporary = await createTemporaryDatabase(source);
  pool = createPool(temporary.url);
  await runMigrations(pool);
  await runMigrations(pool);
});
afterAll(async () => {
  await pool?.end();
  if (temporary) await dropTemporaryDatabase(source, temporary.name);
});
it('agrega repetida y concurrentemente sin duplicar; preserva históricos sin fuente y límites de retención calendario', async () => {
  const db = createDatabaseClient(pool);
  const repository = createAnalyticsRepository(db);
  const receipt = randomUUID();
  const visitor = randomUUID();
  const activity = new Date('2026-10-08T12:00:00Z');
  await repository.accept(receipt, activity, new Date('2027-01-01T00:00:00Z'));
  const id = randomUUID();
  const input = {
    id,
    name: 'contact_submitted',
    at: activity.getTime(),
    dimensions: {
      page: 'home',
      language: 'en',
      theme: 'dark',
      device: 'mobile',
      browser: 'safari',
    },
    properties: { page: 'home' },
  };
  const session = await repository.ingest(receipt, visitor, undefined, [input], activity);
  await repository.ingest(
    receipt,
    visitor,
    session!,
    [
      {
        ...input,
        id: randomUUID(),
        name: 'contact_failed',
        properties: { category: 'unavailable' },
      },
    ],
    new Date(activity.getTime() + 60_000),
  );
  expect(
    (
      await pool.query(
        'select duration_seconds,counters from platform.analytics_sessions where id=$1',
        [session],
      )
    ).rows[0],
  ).toMatchObject({ duration_seconds: 60, counters: { contact_submitted: 1, contact_failed: 1 } });
  await aggregateAnalytics(db, '2026-10-08', now);
  const first = (await pool.query('select metrics from platform.analytics_daily')).rows;
  await Promise.all([
    aggregateAnalytics(db, '2026-10-08', now),
    aggregateAnalytics(db, '2026-10-08', now),
  ]);
  expect((await pool.query('select metrics from platform.analytics_daily')).rows).toEqual(first);
  const serialized = JSON.stringify(first);
  expect(serialized).toContain('contact_submitted');
  expect(serialized).toContain('contact_failed');
  expect(serialized).not.toContain(visitor);
  expect(serialized).not.toContain(session);
  // Exact boundary retained; one millisecond older is deleted. Fixtures stay in the disposable DB.
  const boundary = new Date(now.getTime() - 180 * 86400_000);
  await pool.query('update platform.analytics_events set received_at=$1 where id=$2', [
    boundary,
    id,
  ]);
  await pool.query('update platform.analytics_events set received_at=$1 where id<>$2', [
    new Date(boundary.getTime() - 1),
    id,
  ]);
  const oldest = randomUUID();
  const exact = randomUUID();
  for (const [sid, last] of [
    [oldest, '2024-10-09T11:59:59.999Z'],
    [exact, '2024-10-09T12:00:00Z'],
  ])
    await pool.query(
      'insert into platform.analytics_sessions(id,visitor_id,entry,first_at,last_at) values($1,$2,$3,$4,$4)',
      [sid, randomUUID(), 'home', last],
    );
  await repository.revoke(receipt, now);
  await retainAnalytics(db, now);
  expect((await pool.query('select id from platform.analytics_events')).rows).toEqual([{ id }]);
  expect(
    (
      await pool.query('select id from platform.analytics_sessions where id=any($1::uuid[])', [
        [oldest, exact],
      ])
    ).rows,
  ).toEqual([{ id: exact }]);
  expect((await pool.query('select count(*) from platform.analytics_consents')).rows[0].count).toBe(
    '0',
  );
  const future = new Date('2027-05-01T00:00:00Z');
  await retainAnalytics(db, future);
  expect((await pool.query('select count(*) from platform.analytics_events')).rows[0].count).toBe(
    '0',
  );
  expect(await aggregateAnalytics(db, '2026-10-08', future)).toBe(false);
  expect((await pool.query('select metrics from platform.analytics_daily')).rows).toEqual(first);
  expect(analyticsDay(undefined, now)).toBe('2026-10-08');
  for (const day of ['2026-02-30', '2026-10-09', '2026-01-01;delete', 'invalid'])
    expect(() => analyticsDay(day, now)).toThrow();
});
it('retiene 24 meses calendario incluyendo el día adicional de año bisiesto', async () => {
  const db = createDatabaseClient(pool);
  const ids = [randomUUID(), randomUUID()];
  for (const [i, last] of ['2024-02-28T12:00:00Z', '2024-02-28T11:59:59.999Z'].entries())
    await pool.query(
      'insert into platform.analytics_sessions(id,visitor_id,entry,first_at,last_at) values($1,$2,$3,$4,$4)',
      [ids[i], randomUUID(), 'home', last],
    );
  await retainAnalytics(db, new Date('2026-02-28T12:00:00Z'));
  expect(
    (await pool.query('select id from platform.analytics_sessions where id=any($1::uuid[])', [ids]))
      .rows,
  ).toEqual([{ id: ids[0] }]);
});
it('ejecuta comandos raíz con cargador .env y día explícito sobre base temporal', async () => {
  const cwd = fileURLToPath(new URL('../../../../', import.meta.url));
  const day = analyticsDay(undefined);
  const env = { ...process.env, DATABASE_URL: temporary.url };
  const aggregate = await promisify(execFile)(
    process.execPath,
    ['--run', 'analytics:aggregate', '--', day],
    { cwd, env, timeout: 30000 },
  );
  expect(aggregate.stdout).toContain(day);
  const retain = await promisify(execFile)(process.execPath, ['--run', 'analytics:retain'], {
    cwd,
    env,
    timeout: 30000,
  });
  expect(retain.stdout).toContain('Retención analítica aplicada');
}, 60000);
