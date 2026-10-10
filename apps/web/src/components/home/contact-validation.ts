// Validación de campos para mensajes localizados; el servidor valida el contrato compartido.
export const contactLimits = { name: 100, email: 254, company: 160, message: 2000 } as const;
export const projectTypes = ['web', 'product', 'automation', 'data', 'other'] as const;
export const contactFields = [
  'name',
  'email',
  'company',
  'projectType',
  'message',
  'privacyAccepted',
] as const;
export type ContactField = (typeof contactFields)[number];
export type ContactErrors = Partial<
  Record<ContactField, 'required' | 'length' | 'email' | 'category' | 'privacy'>
>;

export function validateContact(data: FormData): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of ['name', 'email', 'company', 'message'] as const) {
    const value = String(data.get(field) ?? '').trim();
    if (field !== 'company' && !value.trim()) errors[field] = 'required';
    else if (value.length > contactLimits[field]) errors[field] = 'length';
  }
  const email = String(data.get('email') ?? '').trim();
  if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'email';
  const category = String(data.get('projectType') ?? '');
  if (category && !projectTypes.some((value) => value === category))
    errors.projectType = 'category';
  if (data.get('privacyAccepted') !== 'on') errors.privacyAccepted = 'privacy';
  return errors;
}
