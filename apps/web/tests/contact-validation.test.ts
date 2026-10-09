import { describe, expect, it } from 'vitest';
import { contactLimits, validateContact } from '../src/components/home/contact-validation';

function data(values: Record<string, string> = {}) {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    name: 'Visitante',
    email: 'test@example.com',
    message: 'Consulta de proyecto',
    privacyAccepted: 'on',
    ...values,
  }))
    form.set(key, value);
  return form;
}
describe('validación cliente sin transporte', () => {
  it('acepta obligatorios y todos los opcionales categóricos', () => {
    expect(validateContact(data())).toEqual({});
    for (const projectType of ['web', 'product', 'automation', 'data', 'other'])
      expect(validateContact(data({ projectType, company: 'ACME' }))).toEqual({});
  });
  it.each(['name', 'email', 'message'])('rechaza %s vacío o sólo espacios', (field) => {
    expect(validateContact(data({ [field]: '' }))[field as 'name']).toBe('required');
    expect(validateContact(data({ [field]: '  ' }))[field as 'name']).toBe('required');
  });
  it('rechaza correo, categoría y privacidad incorrectos', () => {
    expect(
      validateContact(data({ email: 'incorrecto', projectType: 'injected', privacyAccepted: '' })),
    ).toEqual({ email: 'email', projectType: 'category', privacyAccepted: 'privacy' });
  });
  it.each(['name', 'company', 'message'] as const)('comprueba límites de %s', (field) => {
    expect(validateContact(data({ [field]: 'a'.repeat(contactLimits[field]) }))).toEqual({});
    expect(validateContact(data({ [field]: 'a'.repeat(contactLimits[field] + 1) }))[field]).toBe(
      'length',
    );
  });
  it('comprueba el límite de correo', () => {
    expect(validateContact(data({ email: `${'a'.repeat(248)}@b.com` }))).toEqual({});
    expect(validateContact(data({ email: `${'a'.repeat(249)}@b.com` })).email).toBe('length');
  });
});
