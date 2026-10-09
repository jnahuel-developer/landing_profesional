import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

import english from '../../apps/web/src/messages/en.json';
import spanish from '../../apps/web/src/messages/es.json';

const locales = [
  ['/', spanish],
  ['/en', english],
] as const;
const sectionIds = ['solutions', 'experience', 'process'] as const;

async function assertContent(page: Page, messages: typeof spanish) {
  const solutions = page.locator('#solutions');
  const process = page.locator('#process');
  const experience = page.locator('#experience');
  await expect(solutions.getByRole('article')).toHaveCount(5);
  for (const area of Object.values(messages.Home.solutions.areas)) {
    const article = solutions.getByRole('article', { name: area.title });
    for (const value of Object.values(area))
      await expect(article.getByText(value, { exact: false })).toBeVisible();
  }
  await expect(process.getByRole('article')).toHaveCount(4);
  for (const stage of Object.values(messages.Home.process.stages)) {
    const article = process.getByRole('article', { name: stage.title });
    for (const value of Object.values(stage))
      await expect(article.getByText(value, { exact: true })).toBeVisible();
  }
  await expect(process.getByText(messages.Home.process.collaboration)).toBeVisible();
  await expect(experience.getByRole('article')).toHaveCount(2);
  for (const demo of Object.values(messages.Home.experience.demos)) {
    const card = experience.getByRole('article', { name: demo.name });
    await expect(card.getByText(messages.Home.experience.disclosure)).toBeVisible();
    await expect(card.getByText(demo.description)).toBeVisible();
    for (const capability of Object.values(demo.capabilities))
      await expect(card.getByRole('listitem').filter({ hasText: capability })).toBeVisible();
    await expect(card.getByRole('region', { name: demo.previewLabel })).toBeVisible();
    await expect(card.getByRole('link', { name: demo.link })).toHaveAttribute('href', /\/lab$/);
  }
  await expect(experience.getByText(messages.Home.experience.availability)).toHaveCount(0);
  for (const [id, name, target, href] of [
    ['solutions', messages.Home.solutions.cta, 'contact', /#contact$/],
    ['experience', messages.Home.experience.cta, 'laboratory', /\/lab$/],
    ['process', messages.Home.process.cta, 'contact', /#contact$/],
  ] as const) {
    const primary = page.locator(`#${id} .inline-action`);
    await expect(primary).toHaveCount(1);
    await expect(primary).toHaveText(name);
    await expect(primary).toHaveAttribute('href', href);
    await expect(primary).toHaveAttribute('data-track-target', target);
  }
}

for (const [path, messages] of locales) {
  test(`contenido completo y enlaces profundos ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    expect(
      await page.locator('main section').evaluateAll((nodes) => nodes.map(({ id }) => id)),
    ).toEqual(['home', ...sectionIds, 'about', 'contact']);
    await assertContent(page, messages);
    for (const id of sectionIds) {
      await page.goto(`${path}#${id}`);
      await expect(page.locator(`#${id}`)).toBeInViewport();
      await expect(
        page
          .getByRole('navigation', { name: messages.Navigation.primary })
          .getByRole('link', { name: messages.Routes[id].label }),
      ).toHaveAttribute('aria-current', 'location');
    }
  });

  test(`contenido y navegación sin JavaScript ${path}`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(path);
    await assertContent(page, messages);
    await page.locator('#solutions .inline-action').click();
    await expect(page).toHaveURL(/#contact$/);
    await page.locator('#experience .inline-action').click();
    await expect(page).toHaveURL(/\/lab$/);
    await context.close();
  });
}

test('teclado resalta capacidades y entregables, y activa enlaces explícitos', async ({ page }) => {
  await page.goto('/#solutions');
  for (const area of Object.keys(spanish.Home.solutions.areas)) {
    const entry = page.locator(`[data-journey-step="${area}"]`);
    await entry.focus();
    await expect(entry).toBeFocused();
    await expect(entry).toHaveCSS('outline-style', 'solid');
    await expect(page.locator(`[data-scene-step="${area}"]`)).toHaveAttribute(
      'data-current',
      'true',
    );
    await page.keyboard.press('Tab');
    await expect(entry).not.toBeFocused();
  }
  for (const stage of Object.keys(spanish.Home.process.stages)) {
    const entry = page.locator(`[data-journey-step="${stage}"] article`);
    await entry.focus();
    await expect(entry).toHaveCSS('outline-style', 'solid');
    await expect(entry.locator('..').locator('..')).toHaveAttribute('data-current', 'true');
  }
  for (const demo of Object.values(spanish.Home.experience.demos)) {
    const link = page.getByRole('link', { name: demo.link });
    await link.focus();
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/lab$/);
    await page.goBack();
  }
  await page.locator('#process .inline-action').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('#contact')).toBeInViewport();
});

test('scroll y hover activan conexiones y nodos sin ocultar información', async ({ page }) => {
  await page.goto('/');
  for (const area of Object.keys(spanish.Home.solutions.areas)) {
    const entry = page.locator(`[data-journey-step="${area}"]`);
    await entry.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    await expect(entry).toHaveAttribute('data-current', 'true');
    await entry.hover();
    await expect(page.locator(`[data-scene-step="${area}"]`)).toHaveAttribute(
      'data-current',
      'true',
    );
  }
  for (const stage of Object.keys(spanish.Home.process.stages)) {
    const entry = page.locator(`[data-journey-step="${stage}"]`);
    await entry.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    await expect(entry).toHaveAttribute('data-current', 'true');
    await expect(entry).toHaveAttribute('data-reached', 'true');
  }
});

for (const mode of ['touch', 'reduced'] as const) {
  test(`variante estática completa ${mode}`, async ({ browser }) => {
    const context = await browser.newContext({
      hasTouch: mode === 'touch',
      reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference',
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto('/');
    await assertContent(page, spanish);
    for (const card of await page.locator('.experience-card').all()) {
      await card.getByRole('link').focus();
      await expect(card).toHaveCSS('transform', 'none');
    }
    await expect(page.locator('.process-introduction')).toHaveCSS('position', 'static');
    await expect(page.locator('.capability-scene')).toBeHidden();
    await context.close();
  });
}

for (const [path, messages] of locales) {
  for (const theme of ['light', 'dark'] as const) {
    test(`axe sobre las tres secciones completas ${path}/${theme}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
      await page.goto(path);
      if (theme === 'dark')
        await page.getByRole('button', { name: messages.Preferences.toggleTheme }).click();
      const results = await new AxeBuilder({ page })
        .include('#solutions')
        .include('#experience')
        .include('#process')
        .analyze();
      expect(
        results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious'),
      ).toEqual([]);
    });
  }
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1280, height: 720 },
    { width: 390, height: 844 },
  ]) {
    test(`sin overflow durante el recorrido ${path}/${viewport.width}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(path);
      for (const id of sectionIds) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
          ),
        ).toBe(true);
      }
    });
  }
}

test('recorrido e interacción sin errores ni solicitudes externas', async ({ page }) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (!['localhost', '127.0.0.1'].includes(new URL(request.url()).hostname))
      external.push(request.url());
  });
  await page.goto('/');
  for (const entry of await page.locator('[data-journey-step], .experience-card').all()) {
    await entry.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    await entry.hover();
    const focusTarget = entry.locator('article, a').first();
    if (await focusTarget.count()) await focusTarget.focus();
    else await entry.focus();
  }
  await page.getByRole('button', { name: spanish.Preferences.toggleTheme }).click();
  await page.getByRole('combobox', { name: spanish.Navigation.language }).selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
