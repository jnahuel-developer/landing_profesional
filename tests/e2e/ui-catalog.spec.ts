import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/dev/ui');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Sistema visual compartido' }),
  ).toBeVisible();
});

test('cambia tema y densidad sin perder estado', async ({ page }) => {
  const field = page.getByTestId('persistent-input');
  await field.fill('valor conservado');
  await page.getByRole('button', { exact: true, name: 'dark' }).click();
  await page.getByRole('button', { exact: true, name: 'compact' }).click();
  await expect(page.locator('main.catalog')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('main.catalog')).toHaveAttribute('data-density', 'compact');
  await expect(field).toHaveValue('valor conservado');
});

test('opera componentes complejos con teclado', async ({ page }) => {
  const dialogTrigger = page.getByRole('button', { name: 'Abrir diálogo' });
  await dialogTrigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Diálogo accesible' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Nombre interno' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialogTrigger).toBeFocused();

  await page.getByRole('tab', { name: 'Resumen' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Actividad' })).toHaveAttribute(
    'aria-selected',
    'true',
  );

  await page.getByRole('button', { name: 'Abrir menú' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menuitem', { name: 'Editar' })).toBeFocused();
  await page.keyboard.press('Escape');

  await page.getByRole('combobox', { name: 'Selección' }).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('combobox', { name: 'Selección' })).toContainText('Primera opción');
});

for (const theme of ['light', 'dark', 'high-contrast'] as const) {
  test(`no presenta violaciones críticas en tema ${theme}`, async ({ page }) => {
    await page.getByRole('button', { exact: true, name: theme }).click();
    const results = await new AxeBuilder({ page }).include('main').analyze();
    expect(results.violations.filter(({ impact }) => impact === 'critical')).toEqual([]);
  });
}
