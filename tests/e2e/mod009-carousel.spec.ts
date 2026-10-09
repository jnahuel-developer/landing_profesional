import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import spanish from '../../apps/web/src/messages/es.json';
import english from '../../apps/web/src/messages/en.json';

test('correcciones DOM/CSS, foco y CTA sin separadores ni fondos de sección', async ({ page }) => {
  const cssSource = readFileSync('apps/web/src/styles/globals.css', 'utf8');
  expect(cssSource).not.toMatch(/22rem|24rem|@property --glow-angle/);
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
  await page.locator('#process .process-stage').nth(1).scrollIntoViewIfNeeded();
  const introduction = page.locator('.process-introduction');
  await expect(introduction).toHaveCSS('position', 'sticky');
  expect(
    await introduction.evaluate((node) => {
      const css = getComputedStyle(node);
      const header =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--shell-header-height'),
        ) * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const usefulHeight = window.innerHeight - header;
      // Relative centring of the sticky anchor; no exact screen coordinates.
      return (
        Math.abs((parseFloat(css.top) - header) / usefulHeight - 0.5) < 0.05 &&
        css.transform !== 'none'
      );
    }),
  ).toBe(true);
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
    await expect(link.locator('svg')).toHaveCount(0);
    await expect(link.locator('.luminous-action__perimeter[aria-hidden="true"]')).toHaveCount(1);
  }
});

const imageNames = {
  cafe: [
    '01-operations-overview',
    '02-connected-sale',
    '03-stock-replenishment',
    '04-reservations-tables',
    '05-assisted-service',
  ],
  logistics: [
    '01-control-center',
    '02-route-planning',
    '03-fleet-telemetry',
    '04-coordinated-incident',
    '05-driver-app',
  ],
};

for (const [path, messages] of [
  ['/', spanish],
  ['/en', english],
] as const) {
  test(`diez imágenes ordenadas, puntos y teclado con movimiento reducido ${path}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await expect(page.locator('.acme-scene img')).toHaveCount(10);
    await expect(
      page.locator(
        '.demo-bars, .demo-route, .acme-flow, .acme-resources, .acme-coordination, .acme-device, .acme-carousel__controls',
      ),
    ).toHaveCount(0);
    for (const [position, demo] of (['cafe', 'logistics'] as const).entries()) {
      const carousel = page.locator('.acme-carousel').nth(position);
      const scenes = Object.values(messages.Home.experience.demos[demo].scenes);
      expect(await carousel.locator('.acme-scene__caption strong').allTextContents()).toEqual(
        scenes.map((scene) => scene.title),
      );
      expect(await carousel.locator('.acme-scene__caption p').allTextContents()).toEqual(
        scenes.map((scene) => scene.description),
      );
      await expect(carousel).toHaveAttribute('data-playing', 'false');
      await expect(carousel.getByRole('button')).toHaveCount(5);
      expect(await carousel.innerText()).not.toMatch(
        /\d \/ 5|←|→|\b(Pausar|Reanudar|Pause|Resume)\b/,
      );
      for (const [index, name] of imageNames[demo].entries()) {
        const scene = scenes[index]!;
        const point = carousel.getByRole('button', {
          name: messages.Home.carousel.goTo.replace('{title}', scene.title),
        });
        const image = carousel.locator('img').nth(index);
        const directory = demo === 'cafe' ? 'acme-cafe' : 'acme-logistica';
        expect(decodeURIComponent((await image.getAttribute('src')) ?? '')).toContain(
          `/images/experience/${directory}/${name}.webp`,
        );
        await expect(image).toHaveAttribute('width', '1600');
        await expect(image).toHaveAttribute('height', '900');
        await expect(image).toHaveAttribute('alt', '');
        await expect(image).toHaveAttribute('sizes', /vw/);
        await expect(point).toHaveCSS('border-top-width', '0px');
        expect(
          await point.evaluate(
            (node) =>
              parseFloat(getComputedStyle(node).minWidth) >= 44 &&
              parseFloat(getComputedStyle(node).minHeight) >= 44,
          ),
        ).toBe(true);
        await point.click();
        await expect(point).toHaveAttribute('aria-pressed', 'true');
        await expect(carousel.getByRole('group', { name: scene.title })).toBeVisible();
        await expect(carousel.locator('[aria-live]')).toHaveText(scene.title);
        await expect(image).toHaveCSS('aspect-ratio', '16 / 9');
        await expect(image.locator('..')).toHaveCSS('aspect-ratio', '16 / 9');
        await expect(image).toHaveCSS('object-fit', 'contain');
        await expect
          .poll(() =>
            image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0),
          )
          .toBe(true);
      }
      const last = carousel.getByRole('button').last();
      await page.keyboard.press('Tab');
      await last.focus();
      await expect(last).toHaveCSS('outline-style', 'solid');
      await page.keyboard.press('ArrowRight');
      await expect(carousel.getByRole('group', { name: scenes[0]!.title })).toBeVisible();
      await page.keyboard.press('ArrowLeft');
      await expect(carousel.getByRole('group', { name: scenes[4]!.title })).toBeVisible();
    }
    for (const link of await page.locator('.luminous-action').all()) {
      expect(await link.evaluate((node) => getComputedStyle(node, '::before').animationName)).toBe(
        'none',
      );
      expect(
        await link
          .locator('.luminous-action__perimeter')
          .evaluate((node) => getComputedStyle(node, '::before').animationName),
      ).toBe('none');
      await expect(link).toHaveAttribute('href', /\/lab$/);
    }
  });

  test(`swipe, autoplay condicionado y CTA compatibles sin errores ${path}`, async ({ page }) => {
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
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(path);
    const carousel = page.locator('.acme-carousel').first();
    await expect(carousel).toHaveAttribute('data-playing', 'false');
    await carousel.locator('..').evaluate((node) => node.scrollIntoView({ block: 'center' }));
    await page.locator('header').hover();
    await expect(carousel).toHaveAttribute('data-playing', 'true');
    await carousel.hover();
    await expect(carousel).toHaveAttribute('data-playing', 'false');
    await page.locator('header').hover();
    await carousel.locator('..').evaluate((node) => node.scrollIntoView({ block: 'center' }));
    await expect(carousel).toHaveAttribute('data-playing', 'true');
    await carousel.evaluate((node: HTMLElement) => node.focus({ preventScroll: true }));
    await expect(carousel).toHaveAttribute('data-playing', 'false');
    await page
      .locator('header button')
      .first()
      .evaluate((node: HTMLElement) => node.focus({ preventScroll: true }));
    await expect(carousel).toHaveAttribute('data-playing', 'true');
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(carousel).toHaveAttribute('data-playing', 'false');
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: false });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(carousel).toHaveAttribute('data-playing', 'true');
    const titles = Object.values(messages.Home.experience.demos.cafe.scenes).map(
      (scene) => scene.title,
    );
    async function gesture(x: number, y: number) {
      await carousel.evaluate(
        (node, end) => {
          const initial = new Touch({ identifier: 1, target: node, clientX: 180, clientY: 100 });
          const final = new Touch({ identifier: 1, target: node, clientX: end.x, clientY: end.y });
          node.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [initial] }));
          node.dispatchEvent(
            new TouchEvent('touchend', { bubbles: true, changedTouches: [final] }),
          );
        },
        { x, y },
      );
    }
    await gesture(175, 240);
    await expect(carousel.getByRole('group', { name: titles[0]! })).toBeVisible();
    await gesture(60, 110);
    await expect(carousel.getByRole('group', { name: titles[1]! })).toBeVisible();
    await expect(carousel).toHaveAttribute('data-playing', 'false');
    await page.locator('#home').scrollIntoViewIfNeeded();
    await carousel.scrollIntoViewIfNeeded();
    await page.locator('header').hover();
    await expect(carousel).toHaveAttribute('data-playing', 'false');
    for (const link of await page.locator('.luminous-action').all()) {
      await expect(link).toHaveAttribute('href', /\/lab$/);
      expect(await link.evaluate((node) => getComputedStyle(node, '::before').animationName)).toBe(
        'halo-pulse',
      );
      const perimeter = link.locator('.luminous-action__perimeter');
      expect(
        await perimeter.evaluate((node) => getComputedStyle(node, '::before').animationName),
      ).toBe('perimeter-glow');
      const keyframeProperties = await perimeter.evaluate((node) =>
        node
          .getAnimations({ subtree: true })
          .flatMap((animation) =>
            animation.effect instanceof KeyframeEffect
              ? animation.effect.getKeyframes().map((frame) => frame.transform)
              : [],
          ),
      );
      expect(
        keyframeProperties.some((value) => typeof value === 'string' && value.includes('rotate')),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
    expect(external).toEqual([]);
  });
}
