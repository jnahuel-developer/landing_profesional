import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTestApp, closeTestApps } from '../helpers/app.js';
import { ContactNotifier, ResendTransport } from '../../src/modules/contacts/mail.js';
import { loadContactConfig } from '../../src/modules/contacts/config.js';

const input = {
  name: ' Consulta Ñ ',
  email: 'test@example.com',
  message: '<texto> & 日本語',
  privacyAccepted: true,
  locale: 'es',
  website: '',
  formStartedAt: 1000,
};
function dependencies() {
  const receive = vi.fn(async () => 'internal-id');
  const recordNotification = vi.fn(async () => undefined);
  const send = vi.fn(async () => undefined);
  return {
    receive,
    recordNotification,
    send,
    options: {
      repository: { receive, recordNotification },
      notifier: new ContactNotifier({ send }, 'portfolio@localhost', 'test@localhost'),
      now: () => 5000,
    },
  };
}
describe('contactos', () => {
  afterEach(closeTestApps);
  it('normaliza, persiste antes del correo y sólo publica recepción', async () => {
    const d = dependencies();
    const app = await createTestApp({ contacts: d.options });
    const response = await app.inject({ method: 'POST', url: '/api/v1/contacts', payload: input });
    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({ received: true });
    expect(d.receive).toHaveBeenCalledExactlyOnceWith({
      name: 'Consulta Ñ',
      email: input.email,
      message: input.message,
      locale: 'es',
      company: undefined,
      projectType: undefined,
    });
    expect(d.receive.mock.invocationCallOrder[0]).toBeLessThan(d.send.mock.invocationCallOrder[0]!);
    expect(d.recordNotification).toHaveBeenCalledWith('internal-id', 'SENT');
  });
  it('fallo de DB no envía correo y no filtra el error', async () => {
    const d = dependencies();
    d.receive.mockRejectedValue(new Error('secret test@example.com'));
    const app = await createTestApp({ contacts: d.options });
    const response = await app.inject({ method: 'POST', url: '/api/v1/contacts', payload: input });
    expect(response.statusCode).toBe(503);
    expect(response.body).not.toMatch(/secret|test@example/);
    expect(d.send).not.toHaveBeenCalled();
  });
  it.each([false, true])(
    'fallo SMTP o de registro posterior mantiene recepción: %s',
    async (recordFails) => {
      const d = dependencies();
      d.send.mockRejectedValue(new Error('sensitive transport input'));
      if (recordFails)
        d.recordNotification.mockRejectedValue(new Error('sensitive database input'));
      const app = await createTestApp({ contacts: d.options });
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/contacts',
        payload: input,
      });
      expect(response.statusCode).toBe(201);
      expect(response.json()).toEqual({ received: true });
      expect(d.receive).toHaveBeenCalledOnce();
      expect(d.recordNotification).toHaveBeenCalledWith('internal-id', 'FAILED');
    },
  );
  it('honeypot responde sin persistir y tiempo mínimo permite reintentar', async () => {
    const d = dependencies();
    let time = 1000;
    const app = await createTestApp({ contacts: { ...d.options, now: () => time } });
    const post = (payload: object) =>
      app.inject({ method: 'POST', url: '/api/v1/contacts', payload });
    expect((await post({ ...input, website: 'bot' })).statusCode).toBe(201);
    expect(d.receive).not.toHaveBeenCalled();
    const fast = await post(input);
    expect(fast.statusCode).toBe(400);
    expect(fast.json().code).toBe('CONTACT_TOO_FAST');
    time = 3000;
    expect((await post(input)).statusCode).toBe(201);
    expect(d.receive).toHaveBeenCalledOnce();
  });
  it('conserva 400 y 413 seguros', async () => {
    const d = dependencies();
    const app = await createTestApp({ contacts: d.options });
    for (const invalid of [
      { locale: 'fr' },
      { privacyAccepted: false },
      { message: 'x'.repeat(2001) },
      { email: 'x\r\nBcc:a@b.com' },
    ]) {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/contacts',
        payload: { ...input, ...invalid },
      });
      expect(response.statusCode).toBe(400);
      expect(response.body).not.toContain(input.email);
    }
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/contacts',
      payload: { ...input, message: 'x'.repeat(17000) },
    });
    expect(response.statusCode).toBe(413);
    expect(response.json().code).toBe('PAYLOAD_TOO_LARGE');
    expect(d.receive).not.toHaveBeenCalled();
  });
  it('limita por IP real, ignora XFF, expira y aísla instancias', async () => {
    const d = dependencies();
    let time = 5000;
    const app = await createTestApp({ contacts: { ...d.options, now: () => time, rateLimit: 1 } });
    const post = () =>
      app.inject({
        method: 'POST',
        url: '/api/v1/contacts',
        payload: input,
        headers: { 'x-forwarded-for': Math.random().toString() },
      });
    expect((await post()).statusCode).toBe(201);
    const limited = await post();
    expect(limited.statusCode).toBe(429);
    expect(limited.json().code).toBe('RATE_LIMITED');
    time += 60000;
    expect((await post()).statusCode).toBe(201);
    const other = await createTestApp({ contacts: d.options });
    expect(
      (await other.inject({ method: 'POST', url: '/api/v1/contacts', payload: input })).statusCode,
    ).toBe(201);
  });
});

describe('correo encapsulado', () => {
  it('Resend usa HTTP simulado, texto plano y Reply-To', async () => {
    const http = vi.fn<typeof fetch>().mockResolvedValue(new Response('{}', { status: 200 }));
    const notifier = new ContactNotifier(
      new ResendTransport('fake-key', http),
      'portfolio@localhost',
      'test@localhost',
    );
    expect(await notifier.notify(input as Parameters<typeof notifier.notify>[0])).toBe('SENT');
    const body = JSON.parse(http.mock.calls[0]![1]!.body as string);
    expect(body).toMatchObject({
      from: 'portfolio@localhost',
      reply_to: input.email,
      to: ['test@localhost'],
    });
    expect(body.html).toBeUndefined();
    expect(body.text).toContain(input.message);
    http.mockResolvedValue(new Response('sensitive provider error', { status: 500 }));
    expect(await notifier.notify(input as Parameters<typeof notifier.notify>[0])).toBe('FAILED');
  });
  it('timeout cancela HTTP y entrega sólo un resultado categórico', async () => {
    let signal: AbortSignal | undefined;
    const http = vi.fn<typeof fetch>().mockImplementation(async (_, options) => {
      signal = options?.signal as AbortSignal;
      return new Promise(() => {});
    });
    const notifier = new ContactNotifier(
      new ResendTransport('fake', http),
      'portfolio@localhost',
      'test@localhost',
      10,
    );
    expect(await notifier.notify(input as Parameters<typeof notifier.notify>[0])).toBe('FAILED');
    expect(signal?.aborted).toBe(true);
  });
  it('sólo exige configuración del transporte seleccionado sin revelar valores', () => {
    const base = { MAIL_FROM: 'portfolio@localhost', MAIL_TO: 'test@localhost' };
    expect(() =>
      loadContactConfig({ ...base, MAIL_TRANSPORT: 'resend', RESEND_API_KEY: 'fake' }),
    ).not.toThrow();
    expect(() => loadContactConfig({ ...base, SMTP_HOST: '127.0.0.1' })).not.toThrow();
    expect(() => loadContactConfig({ ...base, MAIL_TRANSPORT: 'resend' })).toThrow(
      'RESEND_API_KEY',
    );
    expect(() => loadContactConfig({ ...base, MAIL_FROM: 'secret\r\nBcc: bad' })).toThrow(
      'MAIL_FROM debe',
    );
  });
});
