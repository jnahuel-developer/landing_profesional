import { act, fireEvent, screen } from '@testing-library/react';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AcmeCarousel } from '../src/components/home/acme-carousel';
import { renderWithIntl } from './test-utils';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('carrusel definitivo', () => {
  function setup(reduced = false) {
    let visibility: IntersectionObserverCallback = () => {};
    const disconnect = vi.fn();
    const observe = vi.fn();
    vi.spyOn(globalThis, 'IntersectionObserver').mockImplementation(function (callback) {
      visibility = callback;
      return {
        observe,
        disconnect,
        unobserve: vi.fn(),
        takeRecords: vi.fn(),
        root: null,
        rootMargin: '',
        scrollMargin: '',
        thresholds: [],
      };
    });
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: reduced,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    const scenes = ['A', 'B', 'C', 'D', 'E'].map((title) => ({
      id: title,
      title,
      description: `Description ${title}`,
      src: `/images/${title}.webp`,
    }));
    const result = renderWithIntl(
      <article>
        <AcmeCarousel demo="cafe" label="Vista previa" scenes={scenes} />
      </article>,
    );
    const root = screen.getByRole('region', { name: 'Vista previa' });
    function visible(value: boolean, ratio = value ? 1 : 0) {
      act(() =>
        visibility(
          [{ isIntersecting: value, intersectionRatio: ratio } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        ),
      );
    }
    return { ...result, visible, root, disconnect, observe };
  }

  it('sólo ofrece cinco puntos, con estado seleccionado, captions e imágenes decorativas', () => {
    const { root } = setup();
    expect(screen.getAllByRole('button')).toHaveLength(5);
    expect(screen.getAllByRole('group', { hidden: true })).toHaveLength(5);
    expect(screen.getByRole('button', { name: 'Ver A' })).toHaveAttribute('aria-pressed', 'true');
    expect(root.querySelectorAll('img')).toHaveLength(5);
    for (const image of root.querySelectorAll('img')) {
      expect(image).toHaveAttribute('alt', '');
      expect(image).toHaveAttribute('width', '1600');
      expect(image).toHaveAttribute('height', '900');
      expect(image).toHaveAttribute('sizes');
    }
    expect(root.textContent).not.toMatch(/\d \/ 5|←|→|Pausar|Reanudar/);
    fireEvent.click(screen.getByRole('button', { name: 'Ver B' }));
    expect(screen.getByRole('group')).toHaveAccessibleName('B');
    expect(root.querySelector('[aria-live]')).toHaveTextContent('B');
    fireEvent.keyDown(root, { key: 'ArrowLeft' });
    expect(screen.getByRole('group')).toHaveAccessibleName('A');
    fireEvent.keyDown(root, { key: 'ArrowLeft' });
    expect(screen.getByRole('group')).toHaveAccessibleName('E');
    fireEvent.keyDown(screen.getByRole('button', { name: 'Ver E' }), { key: 'ArrowRight' });
    expect(screen.getByRole('group')).toHaveAccessibleName('A');
  });

  it('acepta swipe horizontal sin cancelar el gesto vertical', () => {
    const { root } = setup();
    fireEvent.touchStart(root, { touches: [{ clientX: 180, clientY: 100 }] });
    expect(fireEvent.touchEnd(root, { changedTouches: [{ clientX: 175, clientY: 240 }] })).toBe(
      true,
    );
    expect(screen.getByRole('group')).toHaveAccessibleName('A');
    fireEvent.touchStart(root, { touches: [{ clientX: 180, clientY: 100 }] });
    fireEvent.touchEnd(root, { changedTouches: [{ clientX: 60, clientY: 110 }] });
    expect(screen.getByRole('group')).toHaveAccessibleName('B');
  });

  it('observa la card, pausa temporalmente por hover/foco/visibilidad y limpia al desmontar', () => {
    vi.useFakeTimers();
    const { visible, root, unmount, disconnect, observe, container } = setup();
    expect(observe).toHaveBeenCalledWith(container.querySelector('article'));
    expect(vi.getTimerCount()).toBe(0);
    visible(true, 0.1);
    expect(vi.getTimerCount()).toBe(0);
    visible(true);
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.runOnlyPendingTimers());
    expect(screen.getByRole('group')).toHaveAccessibleName('B');
    expect(root.querySelector('[aria-live]')).toBeEmptyDOMElement();
    fireEvent.mouseEnter(root);
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.mouseLeave(root);
    expect(vi.getTimerCount()).toBe(1);
    const point = screen.getByRole('button', { name: 'Ver B' });
    fireEvent.focus(point);
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.blur(point, { relatedTarget: null });
    expect(vi.getTimerCount()).toBe(1);
    visible(false);
    expect(vi.getTimerCount()).toBe(0);
    visible(true);
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    fireEvent(document, new Event('visibilitychange'));
    expect(vi.getTimerCount()).toBe(0);
    hidden.mockReturnValue(false);
    fireEvent(document, new Event('visibilitychange'));
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(['point', 'keyboard', 'swipe', 'pointer'] as const)(
    'detiene definitivamente tras interacción %s',
    (interaction) => {
      vi.useFakeTimers();
      const { visible, root } = setup();
      visible(true);
      expect(vi.getTimerCount()).toBe(1);
      if (interaction === 'point') fireEvent.click(screen.getByRole('button', { name: 'Ver C' }));
      if (interaction === 'keyboard') fireEvent.keyDown(root, { key: 'ArrowRight' });
      if (interaction === 'pointer') fireEvent.pointerDown(root);
      if (interaction === 'swipe') {
        fireEvent.touchStart(root, { touches: [{ clientX: 180, clientY: 100 }] });
        fireEvent.touchEnd(root, { changedTouches: [{ clientX: 60, clientY: 110 }] });
      }
      expect(vi.getTimerCount()).toBe(0);
      visible(false);
      visible(true);
      fireEvent.mouseEnter(root);
      fireEvent.mouseLeave(root);
      fireEvent.focus(root);
      fireEvent.blur(root, { relatedTarget: null });
      expect(vi.getTimerCount()).toBe(0);
      expect(screen.queryByRole('button', { name: /Pausar|Reanudar/ })).toBeNull();
    },
  );

  it('no inicia autoplay con movimiento reducido y conserva los puntos', () => {
    vi.useFakeTimers();
    const { visible } = setup(true);
    visible(true);
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.click(screen.getByRole('button', { name: 'Ver B' }));
    expect(screen.getByRole('group')).toHaveAccessibleName('B');
  });
});

const imageNames = {
  'acme-cafe': [
    '01-operations-overview',
    '02-connected-sale',
    '03-stock-replenishment',
    '04-reservations-tables',
    '05-assisted-service',
  ],
  'acme-logistica': [
    '01-control-center',
    '02-route-planning',
    '03-fleet-telemetry',
    '04-coordinated-incident',
    '05-driver-app',
  ],
};

describe('activos productivos aprobados', () => {
  for (const [demo, names] of Object.entries(imageNames)) {
    it(`${demo}: cinco WebP 1600×900 con ICC RGB, opacos y hasta 400 KB`, () => {
      const directory = resolve('public/images/experience', demo);
      expect(readdirSync(directory).sort()).toEqual(names.map((name) => `${name}.webp`).sort());
      for (const name of names) {
        const png = readFileSync(
          resolve('../../docs/design/mockups', `${demo}-carousel-${name}-v2.png`),
        );
        expect(png.subarray(1, 4).toString()).toBe('PNG');
        expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1600, 900]);
        const file = readFileSync(resolve(directory, `${name}.webp`));
        expect(file.length).toBeLessThanOrEqual(400000);
        expect(file.subarray(0, 4).toString()).toBe('RIFF');
        expect(file.subarray(8, 12).toString()).toBe('WEBP');
        const chunks = new Map<string, Buffer>();
        for (let offset = 12; offset < file.length;) {
          const size = file.readUInt32LE(offset + 4);
          chunks.set(
            file.subarray(offset, offset + 4).toString(),
            file.subarray(offset + 8, offset + 8 + size),
          );
          offset += 8 + size + (size % 2);
        }
        const dimensions = chunks.get('VP8X');
        expect(dimensions).toBeDefined();
        if (!dimensions) throw new Error('Missing WebP extended header');
        expect([dimensions.readUIntLE(4, 3) + 1, dimensions.readUIntLE(7, 3) + 1]).toEqual([
          1600, 900,
        ]);
        expect(dimensions[0]! & 0x10).toBe(0);
        expect(chunks.get('ICCP')?.subarray(16, 20).toString()).toBe('RGB ');
      }
    });
  }
});
