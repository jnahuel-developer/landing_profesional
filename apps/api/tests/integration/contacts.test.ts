import { randomUUID } from 'node:crypto';
import {
  createPool,
  createDatabaseClient,
  createContactRepository,
  runMigrations,
} from '@portfolio/database';
import { afterAll, beforeAll, expect, it } from 'vitest';
import {
  createTemporaryDatabase,
  dropTemporaryDatabase,
  type TemporaryDatabase,
} from '../../../../packages/database/tests/helpers/temporary-database.js';
import { ContactNotifier, SmtpTransport } from '../../src/modules/contacts/mail.js';
import { closeTestApps, createTestApp } from '../helpers/app.js';

const source =
  process.env.DATABASE_URL ??
  'postgresql://portfolio:portfolio_local_only@127.0.0.1:5432/portfolio';
let temporary: TemporaryDatabase;
let pool: ReturnType<typeof createPool>;
beforeAll(async () => {
  temporary = await createTemporaryDatabase(source);
  pool = createPool(temporary.url);
  await runMigrations(pool);
});
afterAll(async () => {
  await closeTestApps();
  await pool?.end();
  if (temporary) await dropTemporaryDatabase(source, temporary.name);
});
it('commit anterior al SMTP real y mensaje comprobable en API de Mailpit', async () => {
  const identifier = randomUUID();
  const to = `contact-${identifier}@localhost`;
  const repository = createContactRepository(createDatabaseClient(pool));
  const smtp = new SmtpTransport('127.0.0.1', 1025);
  const notifier = new ContactNotifier(
    {
      send: async (message, signal) => {
        const rows = await pool.query(
          'select status, notification_status from platform.contacts where message = $1',
          [identifier],
        );
        expect(rows.rows).toEqual([{ status: 'NEW', notification_status: 'PENDING' }]);
        await smtp.send(message, signal);
      },
    },
    'portfolio@localhost',
    to,
  );
  const app = await createTestApp({ contacts: { repository, notifier } });
  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/contacts',
    payload: {
      name: 'Visitante de prueba',
      email: 'test@example.com',
      message: identifier,
      locale: 'en',
      website: '',
      formStartedAt: Date.now() - 3000,
      privacyAccepted: true,
    },
  });
  expect(response.statusCode).toBe(201);
  const contacts = await pool.query(
    'select id, notification_status from platform.contacts where message = $1',
    [identifier],
  );
  expect(contacts.rows).toHaveLength(1);
  expect(contacts.rows[0].notification_status).toBe('SENT');
  const search = await fetch(
    `http://127.0.0.1:8025/api/v1/search?query=${encodeURIComponent(`to:${to}`)}`,
  );
  expect(search.ok).toBe(true);
  const result = (await search.json()) as { messages: { ID: string }[] };
  expect(result.messages).toHaveLength(1);
  const mail = (await (
    await fetch(`http://127.0.0.1:8025/api/v1/message/${result.messages[0]!.ID}`)
  ).json()) as { Text: string; From: { Address: string }; ReplyTo: { Address: string }[] };
  expect(mail.Text).toContain(identifier);
  expect(mail.From.Address).toBe('portfolio@localhost');
  expect(mail.ReplyTo[0]?.Address).toBe('test@example.com');
});
it('SMTP caído mediante puerto aislado conserva contacto y evento FAILED con 201', async () => {
  const marker = randomUUID();
  const repository = createContactRepository(createDatabaseClient(pool));
  const app = await createTestApp({
    contacts: {
      repository,
      notifier: new ContactNotifier(
        new SmtpTransport('127.0.0.1', 1),
        'portfolio@localhost',
        'test@localhost',
        100,
      ),
    },
  });
  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/contacts',
    payload: {
      name: 'Prueba',
      email: 'test@example.com',
      message: marker,
      privacyAccepted: true,
      locale: 'es',
      website: '',
      formStartedAt: 0,
    },
  });
  expect(response.statusCode).toBe(201);
  expect(response.json()).toEqual({ received: true });
  const result = await pool.query(
    'select id, notification_status from platform.contacts where message = $1',
    [marker],
  );
  expect(result.rows).toHaveLength(1);
  expect(result.rows[0].notification_status).toBe('FAILED');
  expect(
    (
      await pool.query(
        'select type from platform.contact_events where contact_id = $1 order by created_at',
        [result.rows[0].id],
      )
    ).rows.map((row) => row.type),
  ).toEqual(['RECEIVED', 'NOTIFICATION_FAILED']);
});

it('fallo al registrar la notificación revierte sólo ese resultado y conserva recepción', async () => {
  const marker = randomUUID();
  const repository = createContactRepository(createDatabaseClient(pool));
  await pool.query(
    `create function platform.reject_notification() returns trigger language plpgsql as $$ begin if NEW.type <> 'RECEIVED' then raise exception 'TEST_NOTIFICATION_RECORD_FAILURE'; end if; return NEW; end $$`,
  );
  await pool.query(
    'create trigger reject_notification before insert on platform.contact_events for each row execute function platform.reject_notification()',
  );
  try {
    const app = await createTestApp({
      contacts: {
        repository,
        notifier: new ContactNotifier(
          { send: async () => undefined },
          'portfolio@localhost',
          'test@localhost',
        ),
      },
    });
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/contacts',
      payload: {
        name: 'Prueba',
        email: 'test@example.com',
        message: marker,
        privacyAccepted: true,
        locale: 'es',
        website: '',
        formStartedAt: 0,
      },
    });
    expect(response.statusCode).toBe(201);
    const result = await pool.query(
      'select id, notification_status from platform.contacts where message = $1',
      [marker],
    );
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].notification_status).toBe('PENDING');
    expect(
      (
        await pool.query('select type from platform.contact_events where contact_id = $1', [
          result.rows[0].id,
        ])
      ).rows,
    ).toEqual([{ type: 'RECEIVED' }]);
  } finally {
    await pool.query('drop trigger reject_notification on platform.contact_events');
  }
});
