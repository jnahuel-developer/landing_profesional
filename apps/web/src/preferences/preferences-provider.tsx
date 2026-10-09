'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  applyPreferences,
  parsePreferences,
  preferenceStorageKey,
  serializePreferences,
  type ThemePreference,
} from './model';

interface PreferencesContextValue {
  readonly theme: ThemePreference | null;
  readonly setTheme: (theme: ThemePreference) => void;
  readonly resolvedTheme: ThemePreference;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function readTheme() {
  if (typeof window === 'undefined') return null;
  return parsePreferences(window.localStorage.getItem(preferenceStorageKey))?.theme ?? null;
}

function currentSystem() {
  return {
    dark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
}

export function PreferencesProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [theme, setThemeState] = useState<ThemePreference | null>(readTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ThemePreference>('light');

  const apply = useCallback((preference: ThemePreference | null) => {
    applyPreferences(document.documentElement, preference, currentSystem());
    setResolvedTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  const setTheme = useCallback(
    (nextTheme: ThemePreference) => {
      window.localStorage.setItem(
        preferenceStorageKey,
        serializePreferences({ version: 2, theme: nextTheme }),
      );
      setThemeState(nextTheme);
      apply(nextTheme);
    },
    [apply],
  );

  useEffect(() => {
    const dark = window.matchMedia('(prefers-color-scheme: dark)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const synchronizeSystem = () => apply(theme);
    synchronizeSystem();
    if (theme === null) dark.addEventListener('change', synchronizeSystem);
    reducedMotion.addEventListener('change', synchronizeSystem);
    return () => {
      dark.removeEventListener('change', synchronizeSystem);
      reducedMotion.removeEventListener('change', synchronizeSystem);
    };
  }, [apply, theme]);

  useEffect(() => {
    const synchronizeStorage = (event: StorageEvent) => {
      if (event.key !== preferenceStorageKey) return;
      const nextTheme = parsePreferences(event.newValue)?.theme ?? null;
      setThemeState(nextTheme);
      apply(nextTheme);
    };
    window.addEventListener('storage', synchronizeStorage);
    return () => window.removeEventListener('storage', synchronizeStorage);
  }, [apply]);

  const value = useMemo(
    () => ({ resolvedTheme, setTheme, theme }),
    [resolvedTheme, setTheme, theme],
  );
  return <PreferencesContext value={value}>{children}</PreferencesContext>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences debe utilizarse dentro de PreferencesProvider.');
  return context;
}
