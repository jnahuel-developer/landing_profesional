import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PreferencesControls } from '../src/components/preferences/preferences-controls';
import {
  applyPreferences,
  defaultPreferences,
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
    const state = { matches: false, listeners: new Set<EventListenerOrEventListenerObject>() };
    media.set(query, state);
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

describe('preferencias visuales', () => {
  it('valida y serializa el modelo versionado', () => {
    expect(parsePreferences(serializePreferences(defaultPreferences))).toEqual(defaultPreferences);
    expect(parsePreferences('{mal')).toEqual(defaultPreferences);
    expect(parsePreferences('{"version":1,"theme":"sepia"}')).toEqual(defaultPreferences);
  });

  it('resuelve tema y movimiento respetando el sistema', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveMotion('system', true)).toBe('reduced');
    expect(resolveMotion('reduced', false)).toBe('reduced');
  });

  it('aplica atributos explícitos al documento sin reemplazarlo', () => {
    const element = document.createElement('html');
    applyPreferences(
      element,
      { ...defaultPreferences, density: 'compact' },
      { dark: true, reducedMotion: false },
    );
    expect(element.dataset).toMatchObject({
      theme: 'dark',
      themePreference: 'system',
      density: 'compact',
      motion: 'full',
      motionPreference: 'system',
    });
  });

  it('persiste controles operables por teclado y conserva preferencias compatibles', async () => {
    const user = userEvent.setup();
    render(<PreferencesControls />);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Tema' }), 'dark');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Densidad' }), 'compact');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Movimiento' }), 'reduced');
    expect(parsePreferences(localStorage.getItem(preferenceStorageKey))).toMatchObject({
      theme: 'dark',
      density: 'compact',
      motion: 'reduced',
    });
    expect(document.documentElement.dataset).toMatchObject({
      theme: 'dark',
      density: 'compact',
      motion: 'reduced',
    });
  });

  it('escucha media queries sólo en modo system y limpia listeners', () => {
    const { unmount } = render(<PreferencesControls />);
    expect(media.get('(prefers-color-scheme: dark)')?.listeners.size).toBe(1);
    expect(media.get('(prefers-reduced-motion: reduce)')?.listeners.size).toBe(1);
    act(() => unmount());
    expect(media.get('(prefers-color-scheme: dark)')?.listeners.size).toBe(0);
    expect(media.get('(prefers-reduced-motion: reduce)')?.listeners.size).toBe(0);
  });
});
