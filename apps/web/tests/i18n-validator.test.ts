import { describe, expect, it } from 'vitest';

import { compareDictionaries } from '../scripts/i18n-validator';

describe('validador de diccionarios', () => {
  const canonical = { Common: { action: 'Acción' }, Routes: { home: { label: 'Inicio' } } };

  it('acepta la misma forma con otros valores', () => {
    expect(
      compareDictionaries(canonical, {
        Common: { action: 'Action' },
        Routes: { home: { label: 'Home' } },
      }),
    ).toEqual([]);
  });

  it('rechaza claves faltantes', () => {
    expect(
      compareDictionaries(canonical, { Common: {}, Routes: { home: { label: 'Home' } } }),
    ).toContain('Common.action: clave faltante');
  });

  it('rechaza claves extra y namespaces incompatibles', () => {
    const errors = compareDictionaries(canonical, {
      Common: 'Action',
      Routes: { home: { label: 'Home' } },
      Orphan: {},
    });
    expect(errors).toContain('Common: namespace incompatible');
    expect(errors).toContain('Orphan: clave extra');
  });
});
