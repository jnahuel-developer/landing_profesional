import { expect, test } from '@playwright/test';

test('correcciones DOM/CSS, foco y CTA sin separadores ni fondos de sección', async ({ page }) => {
  await page.goto('/');
  const main = page.locator('main');
  await page.locator('#solutions-title').click();
  await expect(main).not.toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Tab');
  await main.focus();
  await expect(main).toHaveCSS('outline-style', 'solid');
  for (const id of ['solutions', 'experience', 'process']) {
    const section = page.locator(`#${id}`);
    await expect(section).toHaveCSS('border-top-width', '0px');
    await expect(section).toHaveCSS('background-image', 'none');
    expect(await section.evaluate((node) => getComputedStyle(node, '::before').content)).toBe(
      'none',
    );
  }
  for (const selector of ['#solutions .inline-action', '#process .inline-action']) {
    await expect(page.locator(selector)).toHaveCSS('justify-self', 'center');
    await expect(page.locator(selector)).toHaveAttribute('href', '/#contact');
  }
  const deliverable = page.locator('.stage-deliverable').first();
  const background = await deliverable.evaluate((node) => getComputedStyle(node).backgroundColor);
  await deliverable.hover();
  await expect(deliverable).toHaveCSS('background-color', background);
  expect(
    await page
      .locator('.process-stage dl')
      .first()
      .evaluate((node) => parseFloat(getComputedStyle(node).marginTop)),
  ).toBeGreaterThan(0);
  await expect(page.locator('.experience-next')).toHaveCSS('justify-content', 'center');
  await expect(page.locator('.experience-next p')).toHaveCount(0);
  await expect(page.locator('.experience-next a')).toHaveClass(/luminous-action--primary/);
  for (const link of await page.locator('.demo-link').all()) {
    await expect(link).toHaveAttribute('href', '/lab');
    await expect(link).toHaveCSS('align-self', 'center');
    await expect(link.locator('svg, span')).toHaveCount(0);
  }
});

for (const path of ['/', '/en']) {
  test(`diez escenas y controles sin autoplay con movimiento reducido ${path}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await expect(page.locator('.acme-scene')).toHaveCount(10);
    for (const carousel of await page.locator('.acme-carousel').all()) {
      await expect(carousel).toHaveAttribute('data-playing', 'false');
      const buttons = carousel.locator('.acme-carousel__controls button');
      await buttons.nth(1).click();
      await expect(carousel.locator('[role="group"]:visible')).toHaveAttribute(
        'aria-label',
        /^2 \/ 5/,
      );
      await page.keyboard.press('ArrowLeft');
      await expect(carousel.locator('[role="group"]:visible')).toHaveAttribute(
        'aria-label',
        /^1 \/ 5/,
      );
      await carousel.locator('.acme-carousel__dots button').last().click();
      await expect(carousel.locator('[role="group"]:visible')).toHaveAttribute(
        'aria-label',
        /^5 \/ 5/,
      );
      await expect(buttons.last()).toBeDisabled();
    }
    await expect(page.locator('.luminous-action').first()).toHaveCSS('animation-name', 'none');
  });
}
