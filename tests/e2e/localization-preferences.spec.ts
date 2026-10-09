import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { appRoutes, primaryRoutes } from '../../apps/web/src/config/routes';
import english from '../../apps/web/src/messages/en.json';
import spanish from '../../apps/web/src/messages/es.json';
const preferenceStorageKey = 'nahuelmartinez.preferences.v1';

test('expone las nueve rutas equivalentes con lang, metadata y sección activa', async ({
  page,
}) => {
  test.slow();

  for (const route of appRoutes) {
    for (const locale of ['es', 'en'] as const) {
      await page.context().clearCookies();
      const prefix = locale === 'en' ? '/en' : '';
      const path = route.path === '/' ? prefix || '/' : `${prefix}${route.path}`;
      const messages = locale === 'es' ? spanish : english;
      const response = await page.goto(path);
      expect(response?.ok(), path).toBe(true);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page).toHaveTitle(new RegExp(messages.Routes[route.id].title));
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        messages.Routes[route.id].description,
      );
    }
  }

  for (const route of primaryRoutes) {
    await page.context().clearCookies();
    await page.goto(route.path);
    await expect(
      page
        .getByRole('navigation', { name: spanish.Navigation.primary })
        .getByRole('link', { name: spanish.Routes[route.id].label }),
    ).toHaveAttribute('aria-current', 'page');
  }
});

test('normaliza /es y maneja locales no soportados sin loops', async ({ page }) => {
  await page.goto('/es/soluciones');
  await expect(page).toHaveURL(/\/soluciones$/);
  expect(new URL(page.url()).pathname).not.toContain('/es');

  const response = await page.goto('/fr/soluciones');
  expect(response?.status()).toBe(404);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('detecta Accept-Language sin cookie y prioriza la preferencia explícita', async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: 'en-US' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.getByRole('combobox', { name: english.Navigation.language }).selectOption('es');
  await expect(page).toHaveURL(/\/$/);
  const cookie = (await context.cookies()).find(({ name }) => name === 'NEXT_LOCALE');
  expect(cookie).toMatchObject({ value: 'es', sameSite: 'Lax' });
  await page.goto('/en/contacto');
  await expect(page).toHaveURL(/\/contacto$/);
  await context.close();
});

test('cambia idioma conservando pathname, query, hash y preferencias visuales', async ({
  page,
}) => {
  await page.goto('/soluciones?origen=e2e#detalle');
  await page.getByRole('combobox', { name: spanish.Preferences.theme }).selectOption('dark');
  await page.getByRole('combobox', { name: spanish.Preferences.density }).selectOption('compact');
  await page.getByRole('combobox', { name: spanish.Preferences.motion }).selectOption('reduced');
  await page.getByRole('combobox', { name: spanish.Navigation.language }).selectOption('en');
  await expect(page).toHaveURL(/\/en\/soluciones\?origen=e2e#detalle$/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-density', 'compact');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
});

test('persiste tema y densidad después de recargar y recupera storage corrupto', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('combobox', { name: spanish.Preferences.theme })
    .selectOption('high-contrast');
  await page.getByRole('combobox', { name: spanish.Preferences.density }).selectOption('compact');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'high-contrast');
  await expect(page.locator('html')).toHaveAttribute('data-density', 'compact');

  await page.evaluate((key) => localStorage.setItem(key, '{valor-corrupto'), preferenceStorageKey);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme-preference', 'system');
  await expect(page.locator('html')).toHaveAttribute('data-density', 'comfortable');
});

test('sigue color de sistema sólo con tema system', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('combobox', { name: spanish.Preferences.theme }).selectOption('light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('reduce movimiento por sistema y por elección explícita', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
  await page.getByRole('combobox', { name: spanish.Preferences.motion }).selectOption('reduced');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
});

test('aplica apariencia antes de hidratación y no emite errores de hidratación', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  await page.addInitScript(
    ({ key }) =>
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          theme: 'high-contrast',
          density: 'compact',
          motion: 'reduced',
        }),
      ),
    { key: preferenceStorageKey },
  );
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('head script#appearance-bootstrap')).toHaveCount(1);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'high-contrast');
  await expect(page.locator('html')).toHaveAttribute('data-density', 'compact');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await page.waitForLoadState('networkidle');
  expect(consoleErrors.filter((message) => /hydration|did not match/i.test(message))).toEqual([]);
});

test('opera idioma, tema, densidad y movimiento con teclado', async ({ page }) => {
  await page.goto('/');
  for (const name of [
    spanish.Navigation.language,
    spanish.Preferences.theme,
    spanish.Preferences.density,
    spanish.Preferences.motion,
  ]) {
    const control = page.getByRole('combobox', { name });
    await control.focus();
    await page.keyboard.press('ArrowDown');
    await expect(control).toBeFocused();
  }
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

for (const locale of ['es', 'en'] as const) {
  for (const theme of ['light', 'dark', 'high-contrast'] as const) {
    test(`axe sin violaciones críticas en ${locale}/${theme}`, async ({ page }) => {
      await page.goto(locale === 'en' ? '/en' : '/');
      await page
        .getByRole('combobox', {
          name: locale === 'en' ? english.Preferences.theme : spanish.Preferences.theme,
        })
        .selectOption(theme);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations.filter(({ impact }) => impact === 'critical')).toEqual([]);
    });
  }
}

for (const locale of ['es', 'en'] as const) {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1280, height: 720 },
    { width: 390, height: 844 },
  ]) {
    test(`sin overflow ${locale} ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(locale === 'en' ? '/en' : '/');
      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
    });
  }
}

test('mantiene admin fuera de navegación pública y conserva slug e historial', async ({ page }) => {
  await page.goto('/contacto');
  await expect(page.getByRole('link', { name: spanish.Routes.admin.label })).toHaveCount(0);
  await page.getByRole('combobox', { name: spanish.Navigation.language }).selectOption('en');
  await expect(page).toHaveURL(/\/en\/contacto$/);
  await page.getByRole('combobox', { name: english.Preferences.theme }).selectOption('dark');
  await page.getByRole('link', { name: english.Routes.home.label }).click();
  await expect(page).toHaveURL(/\/en$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/en\/contacto$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.goto('/en/admin');
  await expect(page).toHaveURL(/\/en\/admin$/);
});
