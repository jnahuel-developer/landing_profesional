import {
  applyPreferences,
  legacyPreferenceStorageKey,
  migrateLegacyPreferences,
  parsePreferences,
  preferenceStorageKey,
  serializePreferences,
} from './model';

export function bootstrapAppearance() {
  const current = parsePreferences(window.localStorage.getItem(preferenceStorageKey));
  const migrated = current
    ? null
    : migrateLegacyPreferences(window.localStorage.getItem(legacyPreferenceStorageKey));
  const preferences = current ?? migrated;

  if (migrated) {
    window.localStorage.setItem(preferenceStorageKey, serializePreferences(migrated));
  }
  if (window.localStorage.getItem(legacyPreferenceStorageKey) !== null) {
    window.localStorage.removeItem(legacyPreferenceStorageKey);
  }

  applyPreferences(document.documentElement, preferences?.theme ?? null, {
    dark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  });
}
