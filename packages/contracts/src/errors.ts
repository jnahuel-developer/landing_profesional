import { Type, type Static } from 'typebox';

export const ERROR_CODES = {
  validation: 'VALIDATION_ERROR',
  serviceUnavailable: 'SERVICE_UNAVAILABLE',
  internal: 'INTERNAL_ERROR',
} as const;

export const ValidationDetailSchema = Type.Object(
  {
    field: Type.String(),
    message: Type.String(),
  },
  { additionalProperties: false },
);

export const ErrorResponseSchema = Type.Object(
  {
    code: Type.String(),
    message: Type.String(),
    requestId: Type.String(),
    details: Type.Optional(Type.Array(ValidationDetailSchema)),
  },
  { additionalProperties: false },
);

export type ValidationDetail = Static<typeof ValidationDetailSchema>;
export type ErrorResponse = Static<typeof ErrorResponseSchema>;
