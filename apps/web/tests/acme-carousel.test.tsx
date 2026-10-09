import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AcmeCarousel } from '../src/components/home/acme-carousel';
import { renderWithIntl } from './test-utils';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('carrusel local', () => {
  function setup(reduced = false) {
    let visibility: IntersectionObserverCallback = () => {};
    const disconnect = vi.fn();
    vi.spyOn(globalThis, 'IntersectionObserver').mockImplementation(function (callback) {
      visibility = callback;
      return {
        observe: vi.fn(),
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
    const titles = ['A', 'B', 'C', 'D', 'E'];
    const result = renderWithIntl(
      <AcmeCarousel demo="cafe" label="Vista previa" titles={titles}>
        {titles.map((title) => (
          <p key={title}>{title}</p>
        ))}
      </AcmeCarousel>,
    );
    const root = screen.getByRole('region', { name: 'Vista previa' });
    function visible(value: boolean) {
      act(() =>
        visibility(
          [{ isIntersecting: value } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        ),
      );
    }
    return { ...result, visible, root, disconnect };
  }

  it('expone cinco escenas, controles, teclado, puntos y anuncios acotados', () => {
    const { root } = setup();
    expect(screen.getAllByRole('group', { hidden: true })).toHaveLength(5);
    fireEvent.click(screen.getByRole('button', { name: 'Escena siguiente' }));
    expect(screen.getByRole('group')).toHaveAccessibleName('2 / 5: B');
    expect(root.querySelector('[aria-live]')).toHaveTextContent('2 / 5: B');
    fireEvent.keyDown(root, { key: 'ArrowLeft' });
    expect(screen.getByRole('group')).toHaveAccessibleName('1 / 5: A');
    fireEvent.click(screen.getByRole('button', { name: 'Ver E' }));
    fireEvent.click(screen.getByRole('button', { name: 'Escena siguiente' }));
    expect(screen.getByRole('group')).toHaveAccessibleName('1 / 5: A');
    fireEvent.click(screen.getByRole('button', { name: 'Escena anterior' }));
    expect(screen.getByRole('group')).toHaveAccessibleName('5 / 5: E');
  });

  it('acepta swipe horizontal y deja el gesto vertical sin cambio ni preventDefault', () => {
    const { root } = setup();
    fireEvent.touchStart(root, { touches: [{ clientX: 180, clientY: 100 }] });
    expect(fireEvent.touchEnd(root, { changedTouches: [{ clientX: 175, clientY: 240 }] })).toBe(
      true,
    );
    expect(screen.getByRole('group')).toHaveAccessibleName('1 / 5: A');
    fireEvent.touchStart(root, { touches: [{ clientX: 180, clientY: 100 }] });
    fireEvent.touchEnd(root, { changedTouches: [{ clientX: 60, clientY: 110 }] });
    expect(screen.getByRole('group')).toHaveAccessibleName('2 / 5: B');
  });

  it('activa timers sólo visible y limpia al salir, ocultar pestaña, pausar o desmontar', () => {
    vi.useFakeTimers();
    const { visible, root, unmount, disconnect } = setup();
    expect(vi.getTimerCount()).toBe(0);
    visible(true);
    act(() => vi.advanceTimersByTime(9000));
    expect(screen.getByRole('group')).toHaveAccessibleName('2 / 5: B');
    fireEvent.mouseEnter(root);
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.mouseLeave(root);
    expect(vi.getTimerCount()).toBe(1);
    fireEvent.focus(screen.getByRole('button', { name: 'Escena siguiente' }));
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.blur(screen.getByRole('button', { name: 'Escena siguiente' }), {
      relatedTarget: null,
    });
    visible(false);
    expect(vi.getTimerCount()).toBe(0);
    visible(true);
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    fireEvent(document, new Event('visibilitychange'));
    expect(vi.getTimerCount()).toBe(0);
    hidden.mockReturnValue(false);
    fireEvent(document, new Event('visibilitychange'));
    fireEvent.click(screen.getByRole('button', { name: 'Pausar avance' }));
    visible(false);
    visible(true);
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.click(screen.getByRole('button', { name: 'Reanudar avance' }));
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(disconnect).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('no inicia autoplay con movimiento reducido', () => {
    vi.useFakeTimers();
    const { visible } = setup(true);
    visible(true);
    expect(vi.getTimerCount()).toBe(0);
    expect(screen.getByRole('button', { name: 'Pausar avance' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Escena siguiente' }));
    expect(screen.getByRole('group')).toHaveAccessibleName('2 / 5: B');
  });
});
