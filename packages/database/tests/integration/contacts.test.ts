import { afterAll, beforeAll, expect, it } from 'vitest';
import {
  createPool,
  createDatabaseClient,
  createContactRepository,
  runMigrations,
  type ContactRepository,
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
let repository: ContactRepository;
const input = {
  name: 'Consulta Ñ',
  email: 'test@example.com',
  message: 'Texto <no HTML> 日本語',
  locale: 'es' as const,
};
beforeAll(async () => {
  temporary = await createTemporaryDatabase(source);
  pool = createPool(temporary.url);
  await runMigrations(pool);
  repository = createContactRepository(createDatabaseClient(pool));
});
afterAll(async () => {
  await pool?.end();
  if (temporary) await dropTemporaryDatabase(source, temporary.name);
});
it('crea exactamente un contacto y evento; admite múltiples consultas del mismo correo', async () => {
  const first = await repository.receive(input);
  const contacts = await pool.query('select * from platform.contacts where id = $1', [first]);
  expect(contacts.rows).toHaveLength(1);
  expect(contacts.rows[0]).toMatchObject({
    status: 'NEW',
    notification_status: 'PENDING',
    privacy_notice_version: '2026-10-05',
    message: input.message,
  });
  expect(contacts.rows[0].consent_at).toBeInstanceOf(Date);
  const events = await pool.query('select * from platform.contact_events where contact_id = $1', [
    first,
  ]);
  expect(events.rows).toHaveLength(1);
  expect(events.rows[0].type).toBe('RECEIVED');
  expect(Object.keys(events.rows[0]).sort()).toEqual(['contact_id', 'created_at', 'id', 'type']);
  await repository.recordNotification(first, 'FAILED');
  expect(
    (await pool.query('select notification_status from platform.contacts where id = $1', [first]))
      .rows[0].notification_status,
  ).toBe('FAILED');
  expect(
    (
      await pool.query(
        'select type from platform.contact_events where contact_id = $1 order by created_at',
        [first],
      )
    ).rows.map((row) => row.type),
  ).toEqual(['RECEIVED', 'NOTIFICATION_FAILED']);
  expect(await repository.receive(input)).not.toBe(first);
});
it('revierte el contacto si falla el evento de recepción dentro de la transacción', async () => {
  await pool.query(
    `create function platform.reject_test_event() returns trigger language plpgsql as $$ begin raise exception 'TEST_EVENT_FAILURE'; end $$`,
  );
  await pool.query(
    'create trigger reject_test_event before insert on platform.contact_events for each row execute function platform.reject_test_event()',
  );
  try {
    const before = await pool.query('select count(*) from platform.contacts');
    await expect(repository.receive(input)).rejects.toThrow();
    expect((await pool.query('select count(*) from platform.contacts')).rows).toEqual(before.rows);
  } finally {
    await pool.query('drop trigger reject_test_event on platform.contact_events');
  }
});
