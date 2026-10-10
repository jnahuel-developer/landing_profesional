import { Type, type Static } from 'typebox';
export const AdminLoginSchema = Type.Object(
  {
    identifier: Type.String({ minLength: 1, maxLength: 100 }),
    password: Type.String({ minLength: 12, maxLength: 128 }),
  },
  { additionalProperties: false },
);
export const AdminSessionSchema = Type.Object(
  {
    identifier: Type.String({ maxLength: 100 }),
    expiresAt: Type.Integer(),
    csrf: Type.String({ minLength: 64, maxLength: 64 }),
  },
  { additionalProperties: false },
);
export const AdminLogoutSchema = Type.Object(
  { ok: Type.Literal(true) },
  { additionalProperties: false },
);
export type AdminLogin = Static<typeof AdminLoginSchema>;
export type AdminSessionResponse = Static<typeof AdminSessionSchema>;
