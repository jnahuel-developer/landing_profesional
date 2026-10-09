export const preferenceStorageKey = 'nahuelmartinez.preferences.v2';
export const legacyPreferenceStorageKey = 'nahuelmartinez.preferences.v1';
export const preferenceVersion = 2;

export type ThemePreference = 'light' | 'dark';
export type ResolvedMotion = 'full' | 'reduced';

export interface Preferences {
  readonly version: typeof preferenceVersion;
  readonly theme: ThemePreference;
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark';
}

export function parsePreferences(value: string | null): Preferences | null {
  if (!value) return null;
  try {
    const candidate = JSON.parse(value) as Partial<Preferences>;
    return candidate.version === preferenceVersion && isThemePreference(candidate.theme)
      ? { version: preferenceVersion, theme: candidate.theme }
      : null;
  } catch {
    return null;
  }
}

export function migrateLegacyPreferences(value: string | null): Preferences | null {
  if (!value) return null;
  try {
    const candidate = JSON.parse(value) as { theme?: unknown; version?: unknown };
    if (candidate.version !== 1) return null;
    if (isThemePreference(candidate.theme)) {
      return { version: preferenceVersion, theme: candidate.theme };
    }
    if (candidate.theme === 'high-contrast') {
      return { version: preferenceVersion, theme: 'dark' };
    }
    return null;
  } catch {
    return null;
  }
}

export function serializePreferences(preferences: Preferences) {
  return JSON.stringify(preferences);
}

export function resolveTheme(preference: ThemePreference | null, systemDark: boolean) {
  return preference ?? (systemDark ? 'dark' : 'light');
}

export function resolveMotion(systemReduced: boolean): ResolvedMotion {
  return systemReduced ? 'reduced' : 'full';
}

export function applyPreferences(
  element: HTMLElement,
  preference: ThemePreference | null,
  system: Readonly<{ dark: boolean; reducedMotion: boolean }>,
) {
  element.dataset.theme = resolveTheme(preference, system.dark);
  element.dataset.themePreference = preference ?? 'system';
  element.dataset.density = 'comfortable';
  element.dataset.motionPreference = 'system';
  element.dataset.motion = resolveMotion(system.reducedMotion);
}
