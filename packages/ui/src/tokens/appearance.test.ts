import { describe, expect, it } from 'vitest';

import { applyAppearance, densities, themes } from './appearance';

describe('apariencia', () => {
  it.each(themes)('aplica el tema %s sin reemplazar el elemento', (theme) => {
    const element = document.createElement('section');
    const identity = element;

    applyAppearance(element, { theme, density: 'comfortable' });

    expect(element).toBe(identity);
    expect(element.dataset.theme).toBe(theme);
  });

  it.each(densities)('aplica la densidad %s sin reemplazar el elemento', (density) => {
    const element = document.createElement('section');

    applyAppearance(element, { theme: 'light', density });

    expect(element.dataset.density).toBe(density);
  });

  it('rechaza valores no soportados con mensajes claros', () => {
    const element = document.createElement('section');

    expect(() =>
      applyAppearance(element, { theme: 'sepia' as never, density: 'comfortable' }),
    ).toThrow('Tema no soportado: sepia.');
    expect(() => applyAppearance(element, { theme: 'light', density: 'tiny' as never })).toThrow(
      'Densidad no soportada: tiny.',
    );
  });
});
