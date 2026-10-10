import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';
import es from '../../apps/web/src/messages/es.json';
import en from '../../apps/web/src/messages/en.json';

for (const [locale, messages] of [
  ['es', es],
  ['en', en],
] as const) {
  test(`contacto conserva campos, anuncia errores y evita doble envío ${locale}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(locale === 'es' ? '/#contact' : '/en#contact');
    const form = page.getByRole('form', { name: messages.Contact.title });
    await form.getByLabel(messages.Contact.fields.name).fill('Visitante');
    await form.getByLabel(messages.Contact.fields.email).fill('test@example.com');
    await form.getByLabel(messages.Contact.fields.message).fill('Consulta de prueba');
    await form.getByRole('checkbox').check();
    for (const [status, code, text] of [
      [400, 'CONTACT_TOO_FAST', messages.Contact.deliveryErrors.tooFast],
      [400, 'VALIDATION_ERROR', messages.Contact.deliveryErrors.validation],
      [413, 'PAYLOAD_TOO_LARGE', messages.Contact.deliveryErrors.payload],
      [429, 'RATE_LIMITED', messages.Contact.deliveryErrors.rateLimit],
      [503, 'SERVICE_UNAVAILABLE', messages.Contact.deliveryErrors.unavailable],
    ] as const) {
      await page.route('**/api/v1/contacts', (route) =>
        route.fulfill({
          status,
          contentType: 'application/json',
          body: JSON.stringify({ code, requestId: 'test', message: 'safe' }),
        }),
      );
      await form.getByRole('button').click();
      await expect(form.getByRole('alert')).toHaveText(text);
      await expect(form.getByLabel(messages.Contact.fields.message)).toHaveValue(
        'Consulta de prueba',
      );
      await page.unroute('**/api/v1/contacts');
    }
    let calls = 0;
    let release: (() => void) | undefined;
    await page.route('**/api/v1/contacts', async (route) => {
      calls++;
      await new Promise<void>((resolve) => {
        release = resolve;
      });
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: '{"received":true}',
      });
    });
    await form.getByRole('button').focus();
    await page.keyboard.press('Enter');
    await expect(form.getByRole('button')).toBeDisabled();
    await expect(form.getByRole('status')).toHaveText(messages.Contact.pending);
    await form.evaluate((element: HTMLFormElement) => {
      element.requestSubmit();
      element.requestSubmit();
    });
    await expect.poll(() => calls).toBe(1);
    release!();
    await expect(form.getByRole('status')).toHaveText(messages.Contact.success);
    await expect(form.getByLabel(messages.Contact.fields.name)).toHaveValue('');
    await expect(form.getByRole('checkbox')).not.toBeChecked();
    await expect(form.getByRole('button')).toBeEnabled();
    expect((await new AxeBuilder({ page }).include('#contact').analyze()).violations).toEqual([]);
    expect(calls).toBe(1);
  });
}
