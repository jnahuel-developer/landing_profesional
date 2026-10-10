import { afterEach, expect, it, vi } from 'vitest';
import type { AnalyticsDimensions } from '@portfolio/contracts';
import { AnalyticsClient } from '../src/analytics/client';
import { ConsentController } from '../src/analytics/consent';

const dimensions: AnalyticsDimensions = {
  page: 'home',
  language: 'es',
  theme: 'light',
  browser: 'other',
  device: 'desktop',
};
const clients: AnalyticsClient[] = [];
function setup(transport = vi.fn<typeof fetch>().mockResolvedValue(new Response('{}'))) {
  const client = new AnalyticsClient(() => dimensions, transport);
  clients.push(client);
  return { client, transport };
}
afterEach(() => {
  for (const client of clients) client.stop();
  clients.length = 0;
  vi.useRealTimers();
});
it('cero identidad, cola y llamadas antes de aceptación y después del rechazo', async () => {
  vi.useFakeTimers();
  const { client, transport } = setup();
  const identity = vi.spyOn(crypto, 'randomUUID');
  for (let i = 0; i < 120; i++)
    client.track({ name: 'contact_started', properties: { page: 'home' } });
  client.activate('home:es');
  await client.flush();
  await vi.advanceTimersByTimeAsync(30_000);
  expect(client.size).toBe(0);
  expect(identity).not.toHaveBeenCalled();
  expect(transport).not.toHaveBeenCalled();
  let pending = false;
  const consentTransport = vi
    .fn<typeof fetch>()
    .mockResolvedValue(
      new Response(JSON.stringify({ state: 'rejected', expiresAt: Date.now() + 180 * 86400_000 })),
    );
  const controller = new ConsentController(
    client,
    {
      pending: () => pending,
      remember: (value) => {
        pending = value;
      },
    },
    consentTransport,
  );
  await controller.choose(false);
  client.track({ name: 'page_view', properties: { page: 'home' } });
  expect(client.size).toBe(0);
  expect(transport).not.toHaveBeenCalled();
  expect(identity).not.toHaveBeenCalled();
  controller.suspend();
  identity.mockRestore();
});
it('documento sin duplicación por remount, sesión y cola acotadas', async () => {
  vi.useFakeTimers();
  const transport = vi.fn<typeof fetch>().mockImplementation(() => new Promise(() => {}));
  const { client } = setup(transport);
  client.start();
  client.activate('home:es');
  client.activate('home:es');
  for (let i = 0; i < 2; i++)
    client.track({ name: 'section_viewed', properties: { section: 'home' } });
  for (let i = 0; i < 2; i++)
    client.track({ name: 'contact_started', properties: { page: 'home' } });
  expect(client.size).toBe(3);
  for (let i = 0; i < 150; i++)
    client.track({ name: 'theme_changed', properties: { previous: 'light', next: 'dark' } });
  expect(client.size).toBe(100);
  expect(transport).toHaveBeenCalledOnce();
  client.stop();
  expect((transport.mock.calls[0]![1]?.signal as AbortSignal).aborted).toBe(true);
  expect(client.size).toBe(0);
  const beacon = vi.fn(() => true);
  client.beacon(beacon);
  expect(beacon).not.toHaveBeenCalled();
});
it('reintenta una sola vez con los mismos UUID y nunca reintenta rechazos permanentes', async () => {
  vi.useFakeTimers();
  const { client, transport } = setup(
    vi.fn<typeof fetch>().mockResolvedValue(new Response('{}', { status: 503 })),
  );
  client.start();
  client.activate('home:es');
  await client.flush();
  await vi.advanceTimersByTimeAsync(1000);
  expect(transport).toHaveBeenCalledTimes(2);
  expect(transport.mock.calls[0]![1]?.body).toBe(transport.mock.calls[1]![1]?.body);
  await vi.advanceTimersByTimeAsync(20_000);
  expect(transport).toHaveBeenCalledTimes(2);
  transport.mockResolvedValue(new Response('{}', { status: 400 }));
  client.track({ name: 'contact_started', properties: { page: 'home' } });
  await client.flush();
  await vi.advanceTimersByTimeAsync(1000);
  expect(transport).toHaveBeenCalledTimes(3);
});
it('retiro cancela reintento y fetch, persiste fallo y una recarga nunca restaura aceptación antigua', async () => {
  vi.useFakeTimers();
  const { client, transport } = setup(
    vi.fn<typeof fetch>().mockResolvedValue(new Response('{}', { status: 503 })),
  );
  client.start();
  client.activate('home:es');
  await client.flush();
  let pending = false;
  const storage = {
    pending: () => pending,
    remember: (value: boolean) => {
      pending = value;
    },
  };
  const server = vi.fn<typeof fetch>().mockRejectedValue(new Error('offline'));
  const controller = new ConsentController(client, storage, server);
  await controller.choose(false);
  expect(controller.getSnapshot()).toEqual({ state: 'rejected', pending: true, failed: true });
  expect(pending).toBe(true);
  await vi.advanceTimersByTimeAsync(2000);
  expect(transport).toHaveBeenCalledOnce();
  const reloaded = new ConsentController(client, storage, server);
  await reloaded.refresh();
  expect(server.mock.calls.every((call) => call[1]?.method === 'DELETE')).toBe(true);
  expect(client.active).toBe(false);
  server.mockResolvedValue(
    new Response(JSON.stringify({ state: 'rejected', expiresAt: Date.now() + 86400_000 })),
  );
  await reloaded.refresh();
  expect(pending).toBe(false);
  expect(reloaded.getSnapshot().failed).toBe(false);
  controller.suspend();
  reloaded.suspend();
});
it('se detiene entre pestañas y al vencer la preferencia', async () => {
  vi.useFakeTimers();
  const { client } = setup();
  const storage = { pending: () => false, remember: vi.fn() };
  const server = vi
    .fn<typeof fetch>()
    .mockResolvedValue(
      new Response(JSON.stringify({ state: 'accepted', expiresAt: Date.now() + 2000 })),
    );
  const controller = new ConsentController(client, storage, server);
  await controller.refresh();
  expect(client.active).toBe(true);
  await vi.advanceTimersByTimeAsync(2000);
  expect(client.active).toBe(false);
  expect(controller.getSnapshot().state).toBe('undecided');
  client.start();
  controller.remote(false);
  expect(client.active).toBe(false);
  expect(storage.remember).toHaveBeenCalledWith(true);
  controller.suspend();
});

it('recuperar una aceptación vigente tras remount conserva cola y deduplicación', async () => {
  vi.useFakeTimers();
  const { client, transport } = setup();
  const server = vi
    .fn<typeof fetch>()
    .mockImplementation(
      async () =>
        new Response(
          JSON.stringify({ state: 'accepted', expiresAt: Date.now() + 180 * 86400_000 }),
        ),
    );
  const controller = new ConsentController(
    client,
    { pending: () => false, remember: () => {} },
    server,
  );
  await controller.refresh();
  client.activate('home:es');
  client.track({ name: 'theme_changed', properties: { previous: 'light', next: 'dark' } });
  await controller.refresh();
  client.activate('home:es');
  expect(client.size).toBe(2);
  await client.flush();
  const batch = JSON.parse(transport.mock.calls[0]![1]!.body as string) as {
    events: { name: string }[];
  };
  expect(batch.events.map((event) => event.name)).toEqual(['page_view', 'theme_changed']);
  controller.suspend();
});
