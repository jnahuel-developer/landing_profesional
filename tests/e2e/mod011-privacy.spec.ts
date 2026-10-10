import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { AnalyticsBatch } from '../../packages/contracts/src/analytics';
import es from '../../apps/web/src/messages/es.json';
import en from '../../apps/web/src/messages/en.json';

for (const [path, messages] of [
  ['/', es],
  ['/en', en],
] as const) {
  test(`sin consentimiento, panel por teclado, eventos semánticos y retiro ${path}`, async ({
    page,
    context,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const batches: AnalyticsBatch[] = [];
    await page.route('**/api/v1/analytics/events', async (route) => {
      batches.push(route.request().postDataJSON() as AnalyticsBatch);
      await route.continue();
    });
    await page.goto(path);
    const notice = page.getByRole('complementary', { name: messages.Consent.title });
    await expect(notice).toBeVisible();
    await page.waitForTimeout(1100);
    expect(batches).toHaveLength(0);
    expect(
      (await context.cookies()).filter((cookie) => cookie.name.startsWith('analytics_')),
    ).toHaveLength(0);
    await notice.getByRole('button', { name: messages.Consent.configure }).focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: messages.Consent.title });
    await expect(dialog.getByLabel(messages.Consent.analytics, { exact: true })).not.toBeChecked();
    await expect(dialog.getByLabel(messages.Consent.necessary)).toBeDisabled();
    expect(
      (await new AxeBuilder({ page }).include('[role="dialog"]').analyze()).violations,
    ).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(notice.getByRole('button', { name: messages.Consent.configure })).toBeFocused();
    await notice.getByRole('button', { name: messages.Consent.reject }).click();
    await expect(notice).toHaveCount(0);
    expect(batches).toHaveLength(0);
    expect(
      (await context.cookies()).filter((cookie) => cookie.name.startsWith('analytics_')),
    ).toHaveLength(0);
    await page.getByRole('button', { name: messages.Consent.preferences, exact: true }).click();
    await dialog.getByLabel(messages.Consent.analytics, { exact: true }).check();
    await dialog.getByRole('button', { name: messages.Consent.save }).click();
    await expect(dialog).toHaveCount(0);
    await expect
      .poll(async () =>
        (await context.cookies()).some(
          (cookie) => cookie.name === 'analytics_visitor' && cookie.httpOnly,
        ),
      )
      .toBe(true);
    const carousel = page.locator('.acme-carousel').first();
    await carousel.scrollIntoViewIfNeeded();
    await carousel.getByRole('button').nth(2).click();
    await carousel.getByRole('button').nth(2).click();
    await carousel.focus();
    await page.keyboard.press('ArrowRight');
    const form = page.getByRole('form', { name: messages.Contact.title });
    await form.getByLabel(messages.Contact.fields.name).fill('Visitor test');
    await form.getByLabel(messages.Contact.fields.email).fill('test@example.com');
    await form.getByLabel(messages.Contact.fields.message).fill('Private form contents');
    await form.getByRole('checkbox').check();
    await page.route('**/api/v1/contacts', (route) =>
      route.fulfill({ status: 201, contentType: 'application/json', body: '{"received":true}' }),
    );
    await form.getByRole('button').click();
    await expect(form.getByRole('status')).toHaveText(messages.Contact.success);
    await expect
      .poll(
        () =>
          batches
            .flatMap((batch) => batch.events)
            .some((event) => event.name === 'contact_submitted'),
        { timeout: 15000 },
      )
      .toBe(true);
    const events = batches.flatMap((batch) => batch.events);
    expect(events.filter((event) => event.name === 'page_view')).toHaveLength(1);
    expect(events.filter((event) => event.name === 'contact_started')).toHaveLength(1);
    expect(events.filter((event) => event.name === 'carousel_changed')).toHaveLength(2);
    expect(
      events.every((event) => event.dimensions.language === (path === '/' ? 'es' : 'en')),
    ).toBe(true);
    expect(JSON.stringify(batches)).not.toMatch(/Visitor test|test@example|Private form/);
    const other = await context.newPage();
    await other.goto(path);
    await other.getByRole('button', { name: messages.Consent.preferences, exact: true }).click();
    const otherDialog = other.getByRole('dialog');
    await otherDialog.getByLabel(messages.Consent.analytics, { exact: true }).uncheck();
    await otherDialog.getByRole('button', { name: messages.Consent.save }).click();
    await expect(otherDialog).toHaveCount(0);
    const count = batches.length;
    await carousel.getByRole('button').nth(0).click();
    await page.waitForTimeout(1100);
    expect(batches).toHaveLength(count);
    expect(
      (await context.cookies()).filter((cookie) => cookie.name.startsWith('analytics_')),
    ).toHaveLength(0);
    await other.close();
  });
}
test('retiro fallido sobrevive recarga sin restaurar aceptación', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: es.Consent.accept }).click();
  await expect
    .poll(async () =>
      (await context.cookies()).some((cookie) => cookie.name === 'analytics_visitor'),
    )
    .toBe(true);
  await page.route('**/api/v1/privacy/consent', (route) =>
    route.request().method() === 'DELETE' ? route.abort() : route.continue(),
  );
  let events = 0;
  page.on('request', (request) => {
    if (request.url().endsWith('/api/v1/analytics/events')) events++;
  });
  await page.getByRole('button', { name: es.Consent.preferences, exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel(es.Consent.analytics, { exact: true }).uncheck();
  await dialog.getByRole('button', { name: es.Consent.save }).click();
  await expect(dialog.getByRole('status')).toHaveText(es.Consent.failure);
  await page.reload();
  await expect(page.getByRole('status')).toHaveText(es.Consent.failure);
  await page.waitForTimeout(1100);
  expect(events).toBe(0);
  await page.unroute('**/api/v1/privacy/consent');
  await page.reload();
  await expect
    .poll(async () =>
      (await context.cookies()).some((cookie) => cookie.name === 'analytics_visitor'),
    )
    .toBe(false);
});

test('idioma, tema, CTA y catálogo siguen operativos con ingestión indisponible', async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const batches: AnalyticsBatch[] = [];
  await page.route('**/api/v1/analytics/events', async (route) => {
    batches.push(route.request().postDataJSON() as AnalyticsBatch);
    await route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
  });
  await page.goto('/');
  await page.getByRole('button', { name: es.Consent.accept }).click();
  await expect(page.getByRole('complementary', { name: es.Consent.title })).toHaveCount(0);
  await page.getByRole('button', { name: es.Preferences.toggleTheme }).first().click();
  await page.getByLabel(es.Navigation.language).first().selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('.demo-link').first().click();
  await expect(page).toHaveURL(/\/en\/lab$/);
  await page.locator('main a[href$="#contact"]').click();
  const form = page.getByRole('form', { name: en.Contact.title });
  await form.getByLabel(en.Contact.fields.name).fill('Visitor test');
  await form.getByLabel(en.Contact.fields.email).fill('test@example.com');
  await form.getByLabel(en.Contact.fields.message).fill('Private query');
  await form.getByRole('checkbox').check();
  await page.route('**/api/v1/contacts', (route) =>
    route.fulfill({ status: 201, contentType: 'application/json', body: '{"received":true}' }),
  );
  await form.getByRole('button').click();
  await expect(form.getByRole('status')).toHaveText(en.Contact.success);
  await expect
    .poll(
      () =>
        batches
          .flatMap((batch) => batch.events)
          .some((event) => event.name === 'contact_submitted'),
      { timeout: 15000 },
    )
    .toBe(true);
  const names = new Set(batches.flatMap((batch) => batch.events.map((event) => event.name)));
  for (const name of [
    'language_changed',
    'theme_changed',
    'cta_clicked',
    'demo_card_selected',
    'lab_viewed',
    'contact_started',
    'contact_submitted',
  ])
    expect([...names]).toContain(name);
});
