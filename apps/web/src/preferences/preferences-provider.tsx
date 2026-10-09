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
  defaultPreferences,
  parsePreferences,
  preferenceStorageKey,
  serializePreferences,
  type Preferences,
} from './model';

interface PreferencesContextValue {
  readonly preferences: Preferences;
  readonly updatePreferences: (patch: Partial<Omit<Preferences, 'version'>>) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function readPreferences() {
  if (typeof window === 'undefined') return defaultPreferences;
  return parsePreferences(window.localStorage.getItem(preferenceStorageKey));
}

export function PreferencesProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [preferences, setPreferences] = useState(readPreferences);

  const updatePreferences = useCallback((patch: Partial<Omit<Preferences, 'version'>>) => {
    setPreferences((current) => {
      const next = { ...current, ...patch };
      window.localStorage.setItem(preferenceStorageKey, serializePreferences(next));
      return next;
    });
  }, []);

  useEffect(() => {
    const dark = window.matchMedia('(prefers-color-scheme: dark)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () =>
      applyPreferences(document.documentElement, preferences, {
        dark: dark.matches,
        reducedMotion: reducedMotion.matches,
      });
    apply();

    if (preferences.theme === 'system') dark.addEventListener('change', apply);
    if (preferences.motion === 'system') reducedMotion.addEventListener('change', apply);
    return () => {
      dark.removeEventListener('change', apply);
      reducedMotion.removeEventListener('change', apply);
    };
  }, [preferences]);

  useEffect(() => {
    const synchronize = (event: StorageEvent) => {
      if (event.key === preferenceStorageKey) setPreferences(parsePreferences(event.newValue));
    };
    window.addEventListener('storage', synchronize);
    return () => window.removeEventListener('storage', synchronize);
  }, []);

  const value = useMemo(
    () => ({ preferences, updatePreferences }),
    [preferences, updatePreferences],
  );
  return <PreferencesContext value={value}>{children}</PreferencesContext>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences debe utilizarse dentro de PreferencesProvider.');
  return context;
}
