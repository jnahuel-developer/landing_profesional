export const themes = ['light', 'dark', 'high-contrast'] as const;
export const densities = ['comfortable', 'compact'] as const;

export type Theme = (typeof themes)[number];
export type Density = (typeof densities)[number];

export interface Appearance {
  theme: Theme;
  density: Density;
}

export function isTheme(value: string): value is Theme {
  return themes.some((theme) => theme === value);
}

export function isDensity(value: string): value is Density {
  return densities.some((density) => density === value);
}

export function applyAppearance(element: HTMLElement, appearance: Appearance): void {
  if (!isTheme(appearance.theme)) {
    throw new Error(`Tema no soportado: ${String(appearance.theme)}.`);
  }

  if (!isDensity(appearance.density)) {
    throw new Error(`Densidad no soportada: ${String(appearance.density)}.`);
  }

  element.dataset.theme = appearance.theme;
  element.dataset.density = appearance.density;
}
