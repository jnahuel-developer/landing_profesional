import { applyAppearance, isDensity, isTheme, type Density, type Theme } from '@portfolio/ui';

export const preferenceStorageKey = 'nahuelmartinez.preferences.v1';
export const preferenceVersion = 1;
export const themePreferences = ['system', 'light', 'dark', 'high-contrast'] as const;
export const motionPreferences = ['system', 'reduced'] as const;

export type ThemePreference = (typeof themePreferences)[number];
export type MotionPreference = (typeof motionPreferences)[number];
export type ResolvedMotion = 'full' | 'reduced';

export interface Preferences {
  readonly version: typeof preferenceVersion;
  readonly theme: ThemePreference;
  readonly density: Density;
  readonly motion: MotionPreference;
}

export const defaultPreferences: Preferences = {
  version: preferenceVersion,
  theme: 'system',
  density: 'comfortable',
  motion: 'system',
};

export function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && (value === 'system' || isTheme(value));
}

export function isMotionPreference(value: unknown): value is MotionPreference {
  return value === 'system' || value === 'reduced';
}

export function parsePreferences(value: string | null): Preferences {
  if (!value) return defaultPreferences;
  try {
    const candidate = JSON.parse(value) as Partial<Preferences>;
    if (
      candidate.version !== preferenceVersion ||
      !isThemePreference(candidate.theme) ||
      typeof candidate.density !== 'string' ||
      !isDensity(candidate.density) ||
      !isMotionPreference(candidate.motion)
    ) {
      return defaultPreferences;
    }
    return candidate as Preferences;
  } catch {
    return defaultPreferences;
  }
}

export function serializePreferences(preferences: Preferences) {
  return JSON.stringify(preferences);
}

export function resolveTheme(preference: ThemePreference, systemDark: boolean): Theme {
  return preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
}

export function resolveMotion(
  preference: MotionPreference,
  systemReduced: boolean,
): ResolvedMotion {
  return preference === 'reduced' || systemReduced ? 'reduced' : 'full';
}

export function applyPreferences(
  element: HTMLElement,
  preferences: Preferences,
  system: Readonly<{ dark: boolean; reducedMotion: boolean }>,
) {
  applyAppearance(element, {
    theme: resolveTheme(preferences.theme, system.dark),
    density: preferences.density,
  });
  element.dataset.themePreference = preferences.theme;
  element.dataset.motionPreference = preferences.motion;
  element.dataset.motion = resolveMotion(preferences.motion, system.reducedMotion);
}
