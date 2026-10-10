import { randomBytes } from 'node:crypto';
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';
import { createAdminRepository } from '../../packages/database/src/admin';
import { createDatabaseClient, createPool } from '../../packages/database/src/client';
import { hashPassword } from '../../apps/api/src/modules/admin/password';

test.describe.configure({ mode: 'serial' });
let pool: ReturnType<typeof createPool>;
const identifier = `e2e-${randomBytes(8).toString('hex')}`;
const secret = randomBytes(24).toString('hex');
const origin = 'http://localhost:3000';
test.beforeAll(async () => {
  const name = process.env.ADMIN_E2E_DATABASE;
  const url = process.env.DATABASE_URL;
  if (
    !name ||
    !/^portfolio_test_[a-z0-9]+$/.test(name) ||
    !url ||
    new URL(url).pathname !== `/${name}`
  )
    throw new Error('ADMIN_E2E_REQUIRES_ISOLATED_DATABASE');
  pool = createPool(url);
  await createAdminRepository(createDatabaseClient(pool)).create(
    identifier,
    await hashPassword(secret),
  );
});
test.afterAll(async () => {
  if (!pool) return;
  try {
    // The beforeAll guard restricts this pool to this run's disposable database.
    await pool.query('delete from platform.admin_users where identifier=$1', [identifier]);
  } finally {
    await pool.end();
  }
});

for (const locale of ['es', 'en']) {
  test(`login, acceso directo, cookie falsa, logout y axe ${locale}`, async ({
    page,
    context,
    request,
  }) => {
    const base = `${locale === 'en' ? '/en' : ''}/admin`;
    const api = '/api/v1/admin/auth/';
    expect((await request.get('http://127.0.0.1:4000/api/v1/admin/auth/session')).status()).toBe(
      401,
    );
    await context.addCookies([
      { name: 'admin_session', value: randomBytes(32).toString('hex'), url: origin },
    ]);
    await page.goto(base);
    await expect(page).toHaveURL(`${origin}${base}/login`);
    const publicRequests: string[] = [];
    page.on('request', (req) => {
      if (/privacy\/consent|analytics\/events/.test(req.url())) publicRequests.push(req.url());
    });
    await page
      .getByLabel(locale === 'es' ? 'Usuario' : 'Username', { exact: true })
      .fill(identifier);
    await page
      .getByLabel(locale === 'es' ? 'Contraseña' : 'Password', { exact: true })
      .fill(randomBytes(24).toString('hex'));
    await page
      .getByRole('button', { name: locale === 'es' ? 'Ingresar' : 'Sign in', exact: true })
      .click();
    await expect(page.getByRole('status')).toContainText(locale === 'es' ? 'No se pudo' : 'Unable');
    await expect(
      page.getByLabel(locale === 'es' ? 'Usuario' : 'Username', { exact: true }),
    ).toHaveValue(identifier);
    await expect(
      page.getByLabel(locale === 'es' ? 'Contraseña' : 'Password', { exact: true }),
    ).toHaveValue('');
    const loginAxe = await new AxeBuilder({ page }).analyze();
    expect(loginAxe.violations).toEqual([]);
    await page
      .getByLabel(locale === 'es' ? 'Contraseña' : 'Password', { exact: true })
      .fill(secret);
    await page
      .getByRole('button', { name: locale === 'es' ? 'Ingresar' : 'Sign in', exact: true })
      .focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(`${origin}${base}`);
    await expect(page.getByText(identifier, { exact: true })).toBeVisible();
    const stored = (await context.cookies()).find((value) => value.name === 'admin_session')!;
    expect(stored.httpOnly).toBe(true);
    expect(stored.sameSite).toBe('Strict');
    const session = await (await context.request.get(`${api}session`)).json();
    const privateAxe = await new AxeBuilder({ page }).analyze();
    expect(privateAxe.violations).toEqual([]);
    await page
      .getByRole('button', { name: locale === 'es' ? 'Cerrar sesión' : 'Sign out', exact: true })
      .focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(`${origin}${base}/login`);
    const reuse = await request.get('http://127.0.0.1:4000/api/v1/admin/auth/session', {
      headers: { Cookie: `admin_session=${stored.value}` },
    });
    expect(reuse.status()).toBe(401);
    expect(session.expiresAt).toBeGreaterThan(Date.now());
    expect(publicRequests).toEqual([]);
    await page.goto(base);
    await expect(page).toHaveURL(`${origin}${base}/login`);
  });
}
test('expiración controlada en DB y cookie anterior rechazada sin renovación', async ({
  page,
  context,
}) => {
  const logged = await context.request.post('/api/v1/admin/auth/login', {
    headers: { Origin: origin },
    data: { identifier, password: secret },
  });
  expect(logged.status()).toBe(200);
  expect(logged.headers()['cache-control']).toBe('no-store, private');
  const session = await logged.json();
  // Avoid a millisecond margin between independent test and API process clocks.
  const expired = await pool.query(
    'update platform.admin_sessions set expires_at=$1 where csrf=$2',
    [new Date(0), session.csrf],
  );
  expect(expired.rowCount).toBe(1);
  expect((await context.request.get('/api/v1/admin/auth/session')).status()).toBe(401);
  await page.goto('/admin');
  await expect(page).toHaveURL(`${origin}/admin/login`);
  await expect(page.getByText(identifier, { exact: true })).toHaveCount(0);
});
