import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('abre la página técnica y presenta su contenido principal', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'Nahuel Martínez' })).toBeVisible();
  await expect(page.getByText('La plataforma base está operativa.')).toBeVisible();
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

test('no presenta violaciones críticas de accesibilidad', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();
  const criticalViolations = results.violations.filter(({ impact }) => impact === 'critical');

  expect(criticalViolations).toEqual([]);
});
