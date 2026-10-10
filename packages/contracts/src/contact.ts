import { Type, type Static } from 'typebox';

export function normalizeContact(value: unknown): unknown {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const result = { ...value } as Record<string, unknown>;
  for (const field of ['name', 'email', 'company', 'projectType', 'message']) {
    if (typeof result[field] === 'string') result[field] = result[field].trim();
  }
  for (const field of ['company', 'projectType']) {
    if (result[field] === '') delete result[field];
  }
  return result;
}

export const ContactReceiptSchema = Type.Object(
  { received: Type.Literal(true) },
  { additionalProperties: false },
);
export const ContactInputSchema = Type.Object(
  {
    name: Type.String({ minLength: 1, maxLength: 100, pattern: '\\S' }),
    email: Type.String({ minLength: 3, maxLength: 254, pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' }),
    company: Type.Optional(Type.String({ maxLength: 160 })),
    projectType: Type.Optional(
      Type.Union([
        Type.Literal('web'),
        Type.Literal('product'),
        Type.Literal('automation'),
        Type.Literal('data'),
        Type.Literal('other'),
      ]),
    ),
    message: Type.String({ minLength: 1, maxLength: 2000, pattern: '\\S' }),
    privacyAccepted: Type.Literal(true),
    locale: Type.Union([Type.Literal('es'), Type.Literal('en')]),
    website: Type.String({ maxLength: 200 }),
    formStartedAt: Type.Integer({ minimum: 0, maximum: Number.MAX_SAFE_INTEGER }),
  },
  { additionalProperties: false },
);

export type ContactInput = Static<typeof ContactInputSchema>;
