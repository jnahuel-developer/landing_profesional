import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { documents, getSectionHref, sections, routes } from '../../apps/web/src/config/routes';
import english from '../../apps/web/src/messages/en.json';
import spanish from '../../apps/web/src/messages/es.json';

test('renderiza las seis secciones semánticas en orden para ambos idiomas', async ({ page }) => {
  for (const [path, messages] of [
    ['/', spanish],
    ['/en', english],
  ] as const) {
    await page.goto(path);
    await expect(page.locator('main section')).toHaveCount(6);
    expect(
      await page.locator('main section').evaluateAll((nodes) => nodes.map(({ id }) => id)),
    ).toEqual(sections.map(({ id }) => id));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(messages.Home.hero.title);
  }
});

test('la cabecera navega hacia cada ancla desde la home', async ({ page }) => {
  await page.goto('/');
  const primary = page.getByRole('navigation', { name: spanish.Navigation.primary });
  for (const section of sections) {
    await primary.getByRole('link', { name: spanish.Routes[section.id].label }).click();
    await expect(page).toHaveURL(new RegExp(`${section.hash}$`));
    await expect(page.locator(section.hash)).toBeInViewport();
  }
});

test('navega desde Privacidad hacia la home localizada y la sección solicitada', async ({
  page,
}) => {
  for (const [path, expected, messages] of [
    ['/privacidad', '/#contact', spanish],
    ['/en/privacidad', '/en#contact', english],
  ] as const) {
    await page.goto(path);
    await page
      .getByRole('navigation', { name: messages.Navigation.primary })
      .getByRole('link', { name: messages.Routes.contact.label })
      .click();
    await expect(page).toHaveURL(new RegExp(`${expected.replace('/', '\\/')}$`));
    await expect(page.locator('#contact')).toBeInViewport();
  }
});

test('actualiza sección activa por scroll sin saturar el historial', async ({ page }) => {
  await page.goto('/#home');
  const initialLength = await page.evaluate(() => history.length);
  const primary = page.getByRole('navigation', { name: spanish.Navigation.primary });

  for (const section of sections.slice(1)) {
    await page.locator(section.hash).scrollIntoViewIfNeeded();
    await expect(page).toHaveURL(new RegExp(`${section.hash}$`));
    await expect(
      primary.getByRole('link', { name: spanish.Routes[section.id].label }),
    ).toHaveAttribute('aria-current', 'location');
  }
  expect(await page.evaluate(() => history.length)).toBeLessThanOrEqual(initialLength + 1);
});

test('Atrás y Adelante conservan navegaciones explícitas entre secciones', async ({ page }) => {
  await page.goto('/#home');
  const primary = page.getByRole('navigation', { name: spanish.Navigation.primary });
  await primary.getByRole('link', { name: spanish.Routes.solutions.label }).click();
  await expect(page).toHaveURL(/#solutions$/);
  await primary.getByRole('link', { name: spanish.Routes.contact.label }).click();
  await expect(page).toHaveURL(/#contact$/);
  await page.goBack();
  await expect(page).toHaveURL(/#solutions$/);
  await page.goForward();
  await expect(page).toHaveURL(/#contact$/);
});

const legacyRoutes = [
  ['/soluciones', '/#solutions'],
  ['/experiencia', '/#experience'],
  ['/como-trabajo', '/#process'],
  ['/sobre-mi', '/#about'],
  ['/contacto', '/#contact'],
  ['/en/solutions', '/en#solutions'],
  ['/en/experience', '/en#experience'],
  ['/en/how-i-work', '/en#process'],
  ['/en/about', '/en#about'],
  ['/en/contact', '/en#contact'],
] as const;

for (const [legacy, destination] of legacyRoutes) {
  test(`redirige ${legacy} hacia ${destination}`, async ({ page }) => {
    const response = await page.goto(`${legacy}?origen=legacy`);
    expect(response?.status()).toBe(200);
    const expected = `${destination.split('#')[0]}?origen=legacy#${destination.split('#')[1]}`;
    await expect(page).toHaveURL(new RegExp(`${expected.replace(/[/?#]/g, '\\$&')}$`));
  });
}

test('entra al laboratorio y ofrece una salida al portfolio', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: spanish.Routes.laboratory.label }).first().click();
  await expect(page).toHaveURL(/\/lab$/);
  await page.getByRole('link', { name: spanish.Layouts.backPortfolio }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('el skip link mueve el foco al contenido principal', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: spanish.Layouts.skip });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
});

test('el menú reducido abre, navega y se cierra con teclado', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const details = page.locator('details.compact-navigation');
  const summary = details.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  const contact = page
    .getByRole('navigation', { name: spanish.Navigation.compact })
    .getByRole('link', { name: spanish.Routes.contact.label });
  await contact.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#contact$/);
  await expect(details).not.toHaveAttribute('open', '');
});

test('mantiene contenido y enlaces esenciales disponibles sin JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('main section')).toHaveCount(6);
  const primary = page.getByRole('navigation', { name: spanish.Navigation.primary });
  for (const section of sections) {
    await expect(
      primary.getByRole('link', { name: spanish.Routes[section.id].label }),
    ).toHaveAttribute('href', getSectionHref(section.id));
  }
  await expect(
    page.getByRole('link', { name: spanish.Routes.laboratory.label }).first(),
  ).toHaveAttribute('href', routes.laboratory.path);
  await context.close();
});

test('conserva documentos, 404 y catálogo interno aprobados', async ({ page }) => {
  for (const route of documents) {
    const response = await page.goto(route.path);
    expect(response?.ok(), route.path).toBe(true);
  }
  const response = await page.goto('/ruta-inexistente');
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { level: 1, name: spanish.States.notFoundTitle }),
  ).toBeVisible();
  await page.goto('/dev/ui');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Sistema visual compartido' }),
  ).toBeVisible();
});

test('mantiene /dev/ui libre de errores de consola e hidratación', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/dev/ui');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Sistema visual compartido' }),
  ).toBeVisible();
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

for (const path of ['/', '/en', '/lab', '/admin']) {
  test(`no presenta violaciones críticas de axe en ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(({ impact }) => impact === 'critical')).toEqual([]);
  });
}

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
  expect(ready.ok()).toBe(true);
});
