import { randomUUID } from 'node:crypto';
import { expect, it } from 'vitest';
import { loadAnalyticsConfig } from '../../src/modules/analytics/config.js';
import { cookieHeader, readCookie, signCookie } from '../../src/modules/analytics/cookies.js';
const secret = 'fictitious-test-only-signing-secret-32-chars';
it('valida configuración temprana sin revelar valores ni requerir secretos reales', () => {
  for (const environment of [
    {},
    { ANALYTICS_COOKIE_SECRET: 'short', WEB_ORIGIN: 'https://example.com' },
    { ANALYTICS_COOKIE_SECRET: secret, WEB_ORIGIN: 'https://example.com/path' },
    { ANALYTICS_COOKIE_SECRET: secret, WEB_ORIGIN: 'http://example.com', NODE_ENV: 'production' },
  ])
    expect(() => loadAnalyticsConfig(environment)).toThrow();
  expect(
    loadAnalyticsConfig({
      ANALYTICS_COOKIE_SECRET: secret,
      WEB_ORIGIN: 'https://example.com',
      NODE_ENV: 'production',
    }).secure,
  ).toBe(true);
});
it('firma, valida vencimiento, manipulación y atributos de cookie sin Domain', () => {
  const data = { kind: 'accepted' as const, expires: 2000, id: randomUUID() };
  const cookie = signCookie(data, secret);
  expect(readCookie(`pref=${cookie}`, 'pref', secret, 1000)).toEqual(data);
  expect(readCookie(`pref=${cookie}x`, 'pref', secret, 1000)).toBeNull();
  expect(readCookie(`pref=${cookie}`, 'pref', secret, 2000)).toBeNull();
  expect(readCookie('pref=malformed', 'pref', secret, 1000)).toBeNull();
  const header = cookieHeader('pref', cookie, 180 * 86400, true);
  expect(header).toContain('Max-Age=15552000; Path=/; HttpOnly; SameSite=Lax; Secure');
  expect(header).not.toContain('Domain');
});
