import { Type, type Static } from 'typebox';

// Preparación del contrato: MOD009 no publica un endpoint ni persiste contactos.
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
  },
  { additionalProperties: false },
);

export type ContactInput = Static<typeof ContactInputSchema>;
