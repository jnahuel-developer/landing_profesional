import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeToggle } from '../src/components/preferences/theme-toggle';
import {
  applyPreferences,
  legacyPreferenceStorageKey,
  migrateLegacyPreferences,
  parsePreferences,
  preferenceStorageKey,
  resolveMotion,
  resolveTheme,
  serializePreferences,
} from '../src/preferences/model';
import { renderWithIntl as render } from './test-utils';

const media = new Map<
  string,
  { matches: boolean; listeners: Set<EventListenerOrEventListenerObject> }
>();

beforeEach(() => {
  media.clear();
  vi.mocked(window.matchMedia).mockImplementation((query) => {
    const state = media.get(query) ?? {
      matches: false,
      listeners: new Set<EventListenerOrEventListenerObject>(),
    };
    if (!media.has(query)) media.set(query, state);
    return {
      matches: state.matches,
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: EventListenerOrEventListenerObject) =>
        state.listeners.add(listener),
      removeEventListener: (_type: string, listener: EventListenerOrEventListenerObject) =>
        state.listeners.delete(listener),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  });
});

describe('preferencias visuales públicas', () => {
  it('valida el modelo v2 y migra valores compatibles de v1', () => {
    const preferences = { version: 2 as const, theme: 'dark' as const };
    expect(parsePreferences(serializePreferences(preferences))).toEqual(preferences);
    expect(parsePreferences('{mal')).toBeNull();
    expect(migrateLegacyPreferences('{"version":1,"theme":"light"}')).toEqual({
      version: 2,
      theme: 'light',
    });
    expect(migrateLegacyPreferences('{"version":1,"theme":"dark"}')).toEqual({
      version: 2,
      theme: 'dark',
    });
    expect(migrateLegacyPreferences('{"version":1,"theme":"high-contrast"}')).toEqual({
      version: 2,
      theme: 'dark',
    });
    expect(migrateLegacyPreferences('{"version":1,"theme":"system"}')).toBeNull();
  });

  it('resuelve tema y movimiento exclusivamente desde elección y sistema', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveMotion(true)).toBe('reduced');
    expect(resolveMotion(false)).toBe('full');
  });

  it('aplica densidad fija y movimiento del sistema', () => {
    const element = document.createElement('html');
    applyPreferences(element, null, { dark: true, reducedMotion: true });
    expect(element.dataset).toMatchObject({
      theme: 'dark',
      themePreference: 'system',
      density: 'comfortable',
      motion: 'reduced',
      motionPreference: 'system',
    });
  });

  it('alterna y persiste únicamente claro u oscuro con un botón accesible', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const toggle = screen.getByRole('button', { name: 'Alternar tema claro u oscuro' });
    await user.click(toggle);
    expect(parsePreferences(localStorage.getItem(preferenceStorageKey))).toEqual({
      version: 2,
      theme: 'dark',
    });
    expect(localStorage.getItem(legacyPreferenceStorageKey)).toBeNull();
    expect(document.documentElement.dataset).toMatchObject({
      theme: 'dark',
      density: 'comfortable',
      motion: 'full',
    });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('escucha cambios de sistema necesarios y limpia listeners', () => {
    const { unmount } = render(<ThemeToggle />);
    expect(media.get('(prefers-color-scheme: dark)')?.listeners.size).toBe(1);
    expect(media.get('(prefers-reduced-motion: reduce)')?.listeners.size).toBe(1);
    act(() => unmount());
    expect(media.get('(prefers-color-scheme: dark)')?.listeners.size).toBe(0);
    expect(media.get('(prefers-reduced-motion: reduce)')?.listeners.size).toBe(0);
  });
});
