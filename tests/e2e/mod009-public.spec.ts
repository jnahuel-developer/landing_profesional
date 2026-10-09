import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import spanish from '../../apps/web/src/messages/es.json';
import english from '../../apps/web/src/messages/en.json';

const origin = 'https://www.nahuelmartinez.com.ar';
for (const [prefix, messages] of [
  ['', spanish],
  ['/en', english],
] as const) {
  test(`About, Contacto, errores y revisión local sin envío ${prefix || 'es'}`, async ({
    page,
  }) => {
    const submissions: string[] = [];
    page.on('request', (request) => {
      if (request.method() !== 'GET') submissions.push(request.url());
    });
    await page.goto(`${prefix || '/'}#about`);
    await expect(page.locator('#about')).toBeInViewport();
    await expect(page.getByText(messages.Home.about.approach)).toBeVisible();
    await page.goto(`${prefix || '/'}#contact`);
    await expect(page.locator('#contact')).toBeInViewport();
    const form = page.getByRole('form', { name: messages.Contact.title });
    await form.getByRole('button', { name: messages.Contact.submit }).click();
    await expect(form.getByRole('alert')).toBeVisible();
    await expect(form.getByLabel(messages.Contact.fields.name)).toBeFocused();
    for (const [field, value] of [
      ['name', 'Visitante'],
      ['email', 'invalid'],
      ['message', 'Una consulta de proyecto'],
    ] as const)
      await form.getByLabel(messages.Contact.fields[field]).fill(value);
    await form.getByRole('button', { name: messages.Contact.submit }).click();
    await expect(form.getByLabel(messages.Contact.fields.email)).toBeFocused();
    await expect(form.locator('#contact-email')).toHaveAttribute(
      'aria-describedby',
      'contact-email-error',
    );
    await form.getByLabel(messages.Contact.fields.email).fill('test@example.com');
    await form.getByRole('checkbox').check();
    await form.getByRole('button', { name: messages.Contact.submit }).click();
    await expect(form.getByRole('status')).toHaveText(messages.Contact.prepared);
    expect(submissions).toEqual([]);
    await expect(form.locator('[name="phone"]')).toHaveCount(0);
    await expect(form.getByRole('link', { name: messages.Contact.readPrivacy })).toHaveAttribute(
      'href',
      `${prefix}/privacidad`,
    );
  });

  for (const documentPath of ['/', '/privacidad', '/lab'] as const) {
    const path = `${prefix}${documentPath === '/' ? (prefix ? '' : '/') : documentPath}`;
    test(`smoke, SEO, consola y axe ${path}`, async ({ page }) => {
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
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', origin + path);
      for (const [language, url] of [
        ['es', documentPath],
        ['en', `/en${documentPath === '/' ? '' : documentPath}`],
        ['x-default', documentPath],
      ])
        await expect(page.locator(`link[hreflang="${language}"]`)).toHaveAttribute(
          'href',
          origin + url,
        );
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        'content',
        origin + path,
      );
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary');
      if (documentPath === '/')
        await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
      if (documentPath === '/privacidad')
        for (const topic of Object.values(messages.Privacy.topics))
          await expect(page.getByRole('heading', { name: topic.title })).toBeVisible();
      if (documentPath === '/lab') {
        await expect(page.getByRole('article')).toHaveCount(2);
        for (const card of await page.getByRole('article').all()) {
          await expect(card.getByText(messages.Laboratory.soon)).toBeVisible();
          await expect(card.locator('a, button, input, select')).toHaveCount(0);
          await expect(card.getByText(messages.Home.experience.disclosure)).toBeVisible();
        }
        await expect(page.locator('main a[href$="#contact"]')).toHaveCount(1);
      }
      await expect(page.locator('header a[href*="/admin"], footer a[href*="/admin"]')).toHaveCount(
        0,
      );
      const axe = await new AxeBuilder({ page }).analyze();
      expect(
        axe.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious'),
      ).toEqual([]);
      expect(errors).toEqual([]);
      expect(external).toEqual([]);
    });
    test(`documento y navegación sin JavaScript ${path}`, async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      if (documentPath === '/') {
        await expect(page.locator('#contact button[type="submit"]')).toBeDisabled();
        await expect(page.getByText(messages.Contact.withoutJs)).toBeVisible();
        await expect(page.locator('.acme-carousel__fallback')).toHaveCount(2);
        await expect(page.locator('.acme-carousel .acme-scene:not([hidden]) img')).toHaveCount(2);
        for (const carousel of await page.locator('.acme-carousel').all()) {
          await expect(carousel.getByRole('button')).toHaveCount(0);
          await expect(
            carousel.locator('.acme-scene:not([hidden]) .acme-scene__chips li'),
          ).toHaveCount(3);
          await expect(carousel.locator('.acme-scene:not([hidden]) img')).toHaveAttribute(
            'width',
            '1600',
          );
          await expect(carousel.locator('.acme-scene:not([hidden]) img')).toHaveAttribute(
            'height',
            '900',
          );
        }
        for (const fallback of await page.locator('.acme-carousel__fallback').all())
          await expect(fallback.getByRole('listitem')).toHaveCount(5);
        for (const [position, demo] of (['cafe', 'logistics'] as const).entries()) {
          const fallback = page.locator('.acme-carousel__fallback').nth(position);
          for (const scene of Object.values(messages.Home.experience.demos[demo].scenes)) {
            for (const chip of Object.values(scene.chips))
              await expect(fallback).toContainText(chip);
          }
        }
      }
      await page
        .getByRole('navigation', { name: messages.Navigation.secondary })
        .getByRole('link', { name: messages.Routes.contact.label })
        .click();
      await expect(page).toHaveURL(/#contact$/);
      await expect(page.locator('#contact')).toBeInViewport();
      await context.close();
    });
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 1280, height: 720 },
      { width: 390, height: 844 },
    ]) {
      test(`sin overflow ${path} ${viewport.width}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(documentPath === '/' ? `${path}#contact` : path);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
          ),
        ).toBe(true);
      });
    }
  }
  test(`404 localizado y recuperación ${prefix || 'es'}`, async ({ page }) => {
    const response = await page.goto(`${prefix}/ruta-no-existente`);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: messages.States.notFoundTitle })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await page.getByRole('link', { name: messages.States.contact }).click();
    await expect(page.locator('#contact')).toBeInViewport();
  });
}

test('sitemap y robots públicos contienen documentos, nunca anclas o superficies privadas', async ({
  request,
}) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  expect(urls).toHaveLength(6);
  expect(urls.every((url) => url?.startsWith(origin) && !/[#?]/.test(url))).toBe(true);
  expect(xml).not.toMatch(/admin|\/dev|session|\/api/);
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  const content = await robots.text();
  for (const path of ['/admin', '/en/admin', '/dev', '/api', '/lab/demo', '/en/lab/session'])
    expect(content).toContain(`Disallow: ${path}`);
  expect(content).toContain(`Sitemap: ${origin}/sitemap.xml`);
});
