import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { documents } from '../../apps/web/src/config/routes';
import english from '../../apps/web/src/messages/en.json';
import spanish from '../../apps/web/src/messages/es.json';
const preferenceStorageKey = 'nahuelmartinez.preferences.v2';
const legacyPreferenceStorageKey = 'nahuelmartinez.preferences.v1';

test('expone la home y los documentos independientes con lang y metadata localizados', async ({
  page,
}) => {
  test.slow();

  for (const route of [{ id: 'home' as const, path: '/' }, ...documents]) {
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
});

test('normaliza /es y maneja locales no soportados sin loops', async ({ page }) => {
  await page.goto('/es/privacidad');
  await expect(page).toHaveURL(/\/privacidad$/);
  expect(new URL(page.url()).pathname).not.toContain('/es');

  const response = await page.goto('/fr/soluciones');
  expect(response?.status()).toBe(404);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('prioriza una ruta inglesa explícita frente a la preferencia previa en español', async ({
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
  await expect(page).toHaveURL(/\/en#contact$/);
  await context.close();
});

test('cambia idioma conservando pathname, query, hash y preferencias visuales', async ({
  page,
}) => {
  await page.goto('/soluciones?origen=e2e#detalle');
  await expect(page).toHaveURL(/\?origen=e2e#solutions$/);
  await page.getByRole('button', { name: spanish.Preferences.toggleTheme }).click();
  await page.getByRole('combobox', { name: spanish.Navigation.language }).selectOption('en');
  await expect(page).toHaveURL(/\/en\?origen=e2e#solutions$/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-density', 'comfortable');
});

test('persiste tema y migra de forma segura las preferencias v1', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: spanish.Preferences.toggleTheme }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-density', 'comfortable');

  await page.evaluate(
    ({ current, legacy }) => {
      localStorage.removeItem(current);
      localStorage.setItem(
        legacy,
        JSON.stringify({
          version: 1,
          theme: 'high-contrast',
          density: 'compact',
          motion: 'reduced',
        }),
      );
    },
    { current: preferenceStorageKey, legacy: legacyPreferenceStorageKey },
  );
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-density', 'comfortable');
  await expect(page.locator('html')).toHaveAttribute('data-motion-preference', 'system');
  await expect(
    page.evaluate((key) => localStorage.getItem(key), legacyPreferenceStorageKey),
  ).resolves.toBeNull();
});

test('sigue color de sistema sólo con tema system', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: spanish.Preferences.toggleTheme }).click();
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('reduce movimiento exclusivamente por el sistema', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
  await expect(page.getByText(/Movimiento|Motion/)).toHaveCount(0);
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
          version: 2,
          theme: 'dark',
        }),
      ),
    { key: preferenceStorageKey },
  );
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('head script#appearance-bootstrap')).toHaveCount(0);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-density', 'comfortable');
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: spanish.Routes.solutions.label }).first().click();
  await page.getByRole('button', { name: spanish.Preferences.toggleTheme }).click();
  await page.getByRole('combobox', { name: spanish.Navigation.language }).selectOption('en');
  await page.reload();
  expect(consoleErrors).toEqual([]);
});

test('opera idioma y tema con teclado sin exponer densidad ni movimiento', async ({ page }) => {
  await page.goto('/');
  const language = page.getByRole('combobox', { name: spanish.Navigation.language });
  await language.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const theme = page.getByRole('button', { name: english.Preferences.toggleTheme });
  await theme.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByText(/Densidad|Density|Movimiento|Motion/)).toHaveCount(0);
});

for (const locale of ['es', 'en'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`axe sin violaciones críticas en ${locale}/${theme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto(locale === 'en' ? '/en' : '/');
      if (theme === 'dark') {
        const messages = locale === 'en' ? english : spanish;
        await page.getByRole('button', { name: messages.Preferences.toggleTheme }).click();
      }
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
  await expect(page).toHaveURL(/\/en#contact$/);
  await page.getByRole('button', { name: english.Preferences.toggleTheme }).click();
  await page.getByRole('link', { name: english.Routes.home.label }).click();
  await expect(page).toHaveURL(/\/en#home$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/en#contact$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/en#home$/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.goto('/en/admin');
  await expect(page).toHaveURL(/\/en\/admin$/);
});
