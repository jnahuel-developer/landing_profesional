import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import english from '../../apps/web/src/messages/en.json';
import spanish from '../../apps/web/src/messages/es.json';

test('presenta el hero localizado, sus capacidades y el sistema conectado', async ({ page }) => {
  for (const [path, messages] of [
    ['/', spanish],
    ['/en', english],
  ] as const) {
    await page.goto(path);
    await expect(page.getByText(messages.Home.hero.eyebrow, { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(messages.Home.hero.title);
    await expect(page.getByText(messages.Home.hero.description)).toBeVisible();
    for (const capability of Object.values(messages.Home.hero.capabilities)) {
      await expect(page.getByRole('listitem').filter({ hasText: capability })).toBeVisible();
    }
    const visual = page.getByRole('img', { name: messages.Home.visual.label });
    for (const module of Object.values(messages.Home.visual.modules)) {
      await expect(visual.getByText(module, { exact: true })).toBeVisible();
    }
    await expect(page.getByRole('link', { name: messages.Home.hero.primaryCta })).toHaveAttribute(
      'data-track-target',
      'laboratory',
    );
    await expect(page.getByRole('link', { name: messages.Home.hero.secondaryCta })).toHaveAttribute(
      'data-track-target',
      'contact',
    );
  }
});

test('publica metadata localizada y datos estructurados válidos', async ({ page }) => {
  for (const [path, locale, messages] of [
    ['/', 'es', spanish],
    ['/en', 'en', english],
  ] as const) {
    await page.goto(path);
    await expect(page).toHaveTitle(messages.Routes.home.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      messages.Routes.home.description,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      messages.Routes.home.title,
    );
    const raw = await page.locator('#home-structured-data').textContent();
    const data = JSON.parse(raw ?? '{}') as { '@graph'?: Array<Record<string, unknown>> };
    expect(data['@graph']).toHaveLength(2);
    expect(data['@graph']?.[1]).toMatchObject({
      '@type': 'ProfessionalService',
      inLanguage: locale,
    });
  }
});

test('movimiento reducido conserva todo el contenido y elimina efectos continuos', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('main section')).toHaveCount(6);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.scroll-progress')).toHaveCount(0);
  await expect(page.locator('.system-visual__layer')).toHaveCSS('transform', 'none');
});

test('la escena del hero es operable con teclado y estable en touch', async ({ browser }) => {
  const desktopContext = await browser.newContext();
  const desktop = await desktopContext.newPage();
  await desktop.goto('/');
  const visual = desktop.getByRole('img', { name: spanish.Home.visual.label });
  await visual.focus();
  await expect(visual).toBeFocused();
  await expect(visual).toHaveCSS('outline-style', 'solid');
  await desktopContext.close();

  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  const touch = await context.newPage();
  await touch.goto('/');
  await expect(touch.getByRole('img', { name: spanish.Home.visual.label })).toBeVisible();
  await expect(touch.locator('.system-visual__layer')).toHaveCSS('transform', 'none');
  await context.close();
});

test('recorrido comercial no emite errores ni solicita recursos externos', async ({ page }) => {
  const errors: string[] = [];
  const externalRequests: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (!['localhost', '127.0.0.1'].includes(url.hostname)) externalRequests.push(request.url());
  });

  await page.goto('/');
  for (const id of ['solutions', 'experience', 'process', 'about', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  }
  await page.getByRole('button', { name: spanish.Preferences.toggleTheme }).click();
  await page.getByRole('combobox', { name: spanish.Navigation.language }).selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

for (const [locale, path, messages] of [
  ['es', '/', spanish],
  ['en', '/en', english],
] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`axe sin violaciones críticas en home ${locale}/${theme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto(path);
      if (theme === 'dark') {
        await page.getByRole('button', { name: messages.Preferences.toggleTheme }).click();
      }
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations.filter(({ impact }) => impact === 'critical')).toEqual([]);
    });
  }
}
