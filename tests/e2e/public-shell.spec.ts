import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { appRoutes, primaryRoutes, routes } from '../../apps/web/src/config/routes';
import messages from '../../apps/web/src/messages/es.json';

test('todas las rutas obligatorias son alcanzables y presentan su título', async ({ page }) => {
  for (const route of appRoutes) {
    const response = await page.goto(route.path);
    expect(response?.ok(), route.path).toBe(true);
    await expect(
      page.getByRole('heading', { level: 1, name: messages.Routes[route.id].title }),
    ).toBeVisible();
  }
});

test('navega con teclado, conserva estado activo y respeta el historial', async ({ page }) => {
  await page.goto(routes.home.path);
  const primary = page.getByRole('navigation', { name: 'Navegación principal' });
  await expect(primary.getByRole('link', { name: messages.Routes.home.label })).toHaveAttribute(
    'aria-current',
    'page',
  );

  const solutions = primary.getByRole('link', { name: messages.Routes.solutions.label });
  await solutions.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(`${routes.solutions.path}$`));
  await expect(
    page
      .getByRole('navigation', { name: 'Navegación principal' })
      .getByRole('link', { name: messages.Routes.solutions.label }),
  ).toHaveAttribute('aria-current', 'page');

  await page.goBack();
  await expect(page).toHaveURL(new RegExp('/$'));
  await page.goForward();
  await expect(page).toHaveURL(new RegExp(`${routes.solutions.path}$`));
});

test('entra al laboratorio y ofrece una salida al portfolio', async ({ page }) => {
  await page.goto(routes.home.path);
  await page.getByRole('link', { name: messages.Routes.laboratory.label }).first().click();
  await expect(page).toHaveURL(new RegExp(`${routes.laboratory.path}$`));
  await page.getByRole('link', { name: 'Volver al portfolio' }).click();
  await expect(page).toHaveURL(new RegExp('/$'));
});

test('el skip link mueve el foco al contenido principal', async ({ page }) => {
  await page.goto(routes.home.path);
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Saltar al contenido principal' });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
});

test('el menú reducido abre, navega y se cierra con teclado', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(routes.home.path);
  const details = page.locator('details.compact-navigation');
  const summary = details.locator('summary');

  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  await expect(summary).toContainText('Cerrar navegación');

  const contact = page
    .getByRole('navigation', { name: 'Navegación reducida' })
    .getByRole('link', { name: messages.Routes.contact.label });
  await contact.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(`${routes.contact.path}$`));
  await expect(details).not.toHaveAttribute('open', '');
});

test('mantiene enlaces esenciales disponibles sin JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(routes.home.path);
  const primary = page.getByRole('navigation', { name: 'Navegación principal' });

  for (const route of primaryRoutes) {
    await expect(
      primary.getByRole('link', { name: messages.Routes[route.id].label }),
    ).toHaveAttribute('href', route.path);
  }
  await expect(
    page.getByRole('link', { name: messages.Routes.laboratory.label }).first(),
  ).toHaveAttribute('href', routes.laboratory.path);
  await context.close();
});

test('la ruta inexistente presenta un 404 navegable', async ({ page }) => {
  const response = await page.goto('/ruta-inexistente');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1, name: 'Página no encontrada' })).toBeVisible();
  await page.getByRole('link', { name: 'Volver al inicio' }).last().click();
  await expect(page).toHaveURL(new RegExp('/$'));
});

for (const route of [routes.home, routes.laboratory, routes.admin]) {
  test(`no presenta violaciones críticas de axe en ${route.path}`, async ({ page }) => {
    await page.goto(route.path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(({ impact }) => impact === 'critical')).toEqual([]);
  });
}

for (const viewport of [
  { height: 900, label: 'desktop', width: 1440 },
  { height: 720, label: 'mínimo soportado', width: 1280 },
  { height: 768, label: 'notebook intermedia', width: 1366 },
  { height: 844, label: 'contingencia móvil', width: 390 },
]) {
  test(`no desborda horizontalmente en ${viewport.label}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(routes.home.path);
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}

test('conserva el catálogo interno durante el desarrollo', async ({ page }) => {
  await page.goto('/dev/ui');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Sistema visual compartido' }),
  ).toBeVisible();
});

test('expone la API y healthchecks con PostgreSQL disponible', async ({ request }) => {
  const service = await request.get('http://127.0.0.1:4000/api/v1');
  const live = await request.get('http://127.0.0.1:4000/api/v1/health/live');
  const ready = await request.get('http://127.0.0.1:4000/api/v1/health/ready');

  expect(service.ok()).toBe(true);
  await expect(service.json()).resolves.toEqual({
    service: 'portfolio-api',
    status: 'operational',
    version: 'v1',
  });
  expect(live.ok()).toBe(true);
  await expect(live.json()).resolves.toEqual({ status: 'ok', service: 'portfolio-api' });
  expect(ready.ok()).toBe(true);
  await expect(ready.json()).resolves.toEqual({
    status: 'ok',
    checks: { database: 'up' },
  });
});
