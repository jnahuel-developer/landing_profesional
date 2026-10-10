import { EventEmitter } from 'node:events';
import { randomBytes } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  normalizeIdentifier,
} from '../../src/modules/admin/password.js';
import { AdminRateLimit } from '../../src/modules/admin/rate-limit.js';
import { runAdminCommand } from '../../src/modules/admin/commands.js';
import { terminalInput } from '../../src/modules/admin/terminal.js';
import { adminCookie } from '../../src/modules/admin/routes.js';
import type { AdminRepository } from '@portfolio/database';
import type { ReadStream, WriteStream } from 'node:tty';
import { loadAdminConfig } from '../../src/modules/admin/config.js';

it('configura límites y origen exacto sin aceptar configuración insegura', () => {
  expect(loadAdminConfig({ WEB_ORIGIN: 'http://localhost:3000' })).toEqual({
    webOrigin: 'http://localhost:3000',
    secure: false,
    attempts: 5,
    globalAttempts: 100,
  });
  expect(
    loadAdminConfig({
      WEB_ORIGIN: 'https://example.test',
      NODE_ENV: 'production',
      ADMIN_LOGIN_ATTEMPTS: '7',
      ADMIN_LOGIN_GLOBAL_ATTEMPTS: '30',
    }),
  ).toMatchObject({ secure: true, attempts: 7, globalAttempts: 30 });
  for (const env of [
    {},
    { WEB_ORIGIN: 'null' },
    { WEB_ORIGIN: 'http://localhost:3000/' },
    { WEB_ORIGIN: 'http://localhost:3000', NODE_ENV: 'production' },
    { WEB_ORIGIN: 'https://example.test', ADMIN_LOGIN_ATTEMPTS: '0' },
    { WEB_ORIGIN: 'https://example.test', ADMIN_LOGIN_GLOBAL_ATTEMPTS: '100001' },
  ])
    expect(() => loadAdminConfig(env)).toThrow();
});

it('usa Argon2id real, parámetros explícitos y dummy válido sin cuenta', async () => {
  const secret = randomBytes(24).toString('hex');
  const hash = await hashPassword(secret);
  expect(hash.startsWith('$argon2id$v=19$')).toBe(true);
  expect(hash.split('$')[3]!.split(',').sort()).toEqual(['m=65536', 'p=1', 't=3']);
  expect(await verifyPassword(hash, secret)).toBe(true);
  expect(await verifyPassword(hash, randomBytes(24).toString('hex'))).toBe(false);
  expect(await verifyPassword(undefined, secret)).toBe(false);
  expect((await hashPassword(secret)) === hash).toBe(false);
  expect(normalizeIdentifier('  ADMIN  ')).toBe('admin');
  expect(() => normalizeIdentifier('bad name')).toThrow('ADMIN_IDENTIFIER_INVALID');
  expect(() => hashPassword('x'.repeat(11))).toThrow();
  expect(() => hashPassword('x'.repeat(129))).toThrow();
});
it('limita por IP y global, acota memoria, expira y demora progresivamente', () => {
  const limiter = new AdminRateLimit(5, 6, 2);
  expect(limiter.take('a', 0).delay).toBe(0);
  for (let i = 1; i < 5; i++) expect(limiter.take('a', 0).delay).toBe(i * 200);
  expect(limiter.take('a', 0)).toMatchObject({ allowed: false, retry: 900, report: true });
  expect(limiter.take('a', 0).report).toBe(false);
  expect(limiter.take('b', 0).allowed).toBe(true);
  expect(limiter.take('c', 0).allowed).toBe(false);
  expect(limiter.take('c', 900000).allowed).toBe(true);
  const bounded = new AdminRateLimit(5, 100, 1);
  bounded.take('a', 0);
  expect(bounded.take('b', 0).allowed).toBe(false);
});
it('cookie producción y borrado conservan atributos; desarrollo no exige Secure', () => {
  expect(adminCookie('', true, 0)).toBe(
    'admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Secure',
  );
  expect(adminCookie('', false)).not.toContain('Secure');
});
describe('servicios de CLI con entrada inyectada', () => {
  const repository = () =>
    ({
      user: vi.fn().mockResolvedValue(undefined),
      create: vi.fn(),
      invalidate: vi.fn(),
      retain: vi.fn(),
    }) as unknown as AdminRepository;
  it('crea, confirma y evita sobrescritura', async () => {
    const repo = repository();
    const secret = randomBytes(24).toString('hex');
    const answers = ['  Admin  ', secret, secret];
    const read = vi.fn(async () => answers.shift()!);
    await runAdminCommand('create', repo, { read });
    const [identifier, hash] = vi.mocked(repo.create).mock.calls[0]!;
    expect(identifier).toBe('admin');
    expect(await verifyPassword(hash, secret)).toBe(true);
    vi.mocked(repo.user).mockResolvedValue({ id: 'exists' } as never);
    await expect(runAdminCommand('create', repo, { read })).rejects.toThrow('ADMIN_ACCOUNT_EXISTS');
    expect(read).toHaveBeenCalledTimes(3);
  });
  it('cambia, revoca, retiene y rechaza confirmación sin tocar persistencia', async () => {
    const repo = repository();
    vi.mocked(repo.user).mockResolvedValue({ id: 'exists' } as never);
    const secret = randomBytes(24).toString('hex');
    await runAdminCommand('password', repo, { read: async () => secret });
    expect(await verifyPassword(vi.mocked(repo.invalidate).mock.calls[0]![0], secret)).toBe(true);
    await runAdminCommand('revoke-sessions', repo, { read: vi.fn() });
    expect(repo.invalidate).toHaveBeenLastCalledWith();
    await runAdminCommand('retain', repo, { read: vi.fn() });
    expect(repo.retain).toHaveBeenCalledOnce();
    vi.mocked(repo.invalidate).mockClear();
    const answers = [secret, secret + 'x'];
    await expect(
      runAdminCommand('password', repo, { read: async () => answers.shift()! }),
    ).rejects.toThrow('ADMIN_PASSWORD_CONFIRMATION');
    expect(repo.invalidate).not.toHaveBeenCalled();
  });
});
it('terminal sin TTY falla; entrada secreta no tiene eco y restaura modo al confirmar/cancelar', async () => {
  expect(() => terminalInput({ isTTY: false } as ReadStream, {} as WriteStream)).toThrow(
    'ADMIN_TTY_REQUIRED',
  );
  const stream = Object.assign(new EventEmitter(), {
    isTTY: true,
    isRaw: false,
    isPaused: () => true,
    pause: vi.fn(),
    resume: vi.fn(),
    setRawMode: vi.fn(),
  });
  const output = { isTTY: true, write: vi.fn() };
  const terminal = terminalInput(stream as unknown as ReadStream, output as unknown as WriteStream);
  const secret = randomBytes(20).toString('hex');
  const read = terminal.read('Password: ', true);
  stream.emit('keypress', secret, { name: 'x' });
  stream.emit('keypress', undefined, { name: 'backspace' });
  stream.emit('keypress', undefined, { name: 'return' });
  expect(await read).toBe(secret.slice(0, -1));
  expect(output.write.mock.calls.map(([text]) => text).join('')).toBe('Password: \n');
  expect(stream.setRawMode).toHaveBeenLastCalledWith(false);
  const cancel = terminal.read('Password: ', true);
  stream.emit('keypress', undefined, { name: 'c', ctrl: true });
  await expect(cancel).rejects.toThrow('ADMIN_INPUT_CANCELLED');
  expect(stream.listenerCount('keypress')).toBe(0);
});
