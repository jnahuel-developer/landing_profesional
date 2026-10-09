import { Value } from 'typebox/value';
import { describe, expect, it } from 'vitest';
import { ContactInputSchema } from './contact.js';

const contact = {
  name: 'Visitante',
  email: 'test@example.com',
  message: 'Consulta de proyecto',
  privacyAccepted: true,
};
describe('contrato reutilizable de contacto', () => {
  it('acepta obligatorios y opcionales categóricos', () => {
    expect(Value.Check(ContactInputSchema, contact)).toBe(true);
    for (const projectType of ['web', 'product', 'automation', 'data', 'other'])
      expect(Value.Check(ContactInputSchema, { ...contact, projectType, company: 'ACME' })).toBe(
        true,
      );
  });
  it('rechaza ausencias, espacios, correo inválido, consentimiento falso y campos desconocidos', () => {
    for (const field of ['name', 'email', 'message', 'privacyAccepted']) {
      const incomplete = { ...contact } as Record<string, unknown>;
      delete incomplete[field];
      expect(Value.Check(ContactInputSchema, incomplete)).toBe(false);
    }
    for (const invalid of [
      { name: ' ' },
      { message: ' ' },
      { email: 'incorrecto' },
      { privacyAccepted: false },
      { projectType: 'injected' },
      { phone: '123' },
    ])
      expect(Value.Check(ContactInputSchema, { ...contact, ...invalid })).toBe(false);
  });
  it('verifica todos los límites de longitud', () => {
    for (const [field, limit] of [
      ['name', 100],
      ['company', 160],
      ['message', 2000],
    ] as const) {
      expect(Value.Check(ContactInputSchema, { ...contact, [field]: 'a'.repeat(limit) })).toBe(
        true,
      );
      expect(Value.Check(ContactInputSchema, { ...contact, [field]: 'a'.repeat(limit + 1) })).toBe(
        false,
      );
    }
    expect(Value.Check(ContactInputSchema, { ...contact, email: `${'a'.repeat(248)}@b.com` })).toBe(
      true,
    );
    expect(Value.Check(ContactInputSchema, { ...contact, email: `${'a'.repeat(249)}@b.com` })).toBe(
      false,
    );
  });
});
