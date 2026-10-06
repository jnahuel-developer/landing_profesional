import { Value } from 'typebox/value';
import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  ERROR_CODES,
  ErrorResponseSchema,
  HEALTH_STATUS,
  LiveResponseSchema,
  ReadyResponseSchema,
  type ErrorResponse,
} from '@portfolio/contracts';

describe('contratos públicos', () => {
  it('valida y serializa el contrato de error sin alterar su forma', () => {
    const error: ErrorResponse = {
      code: ERROR_CODES.validation,
      message: 'La solicitud no es válida.',
      requestId: 'request-123',
      details: [{ field: 'query.limit', message: 'Debe ser un entero.' }],
    };

    expect(Value.Check(ErrorResponseSchema, error)).toBe(true);
    expect(JSON.parse(JSON.stringify(error))).toEqual(error);
    expectTypeOf(error).toMatchTypeOf<ErrorResponse>();
  });

  it('expone los contratos de healthcheck desde la entrada pública', () => {
    expect(
      Value.Check(LiveResponseSchema, {
        status: HEALTH_STATUS.ok,
        service: 'portfolio-api',
      }),
    ).toBe(true);
    expect(
      Value.Check(ReadyResponseSchema, {
        status: HEALTH_STATUS.ok,
        checks: { database: HEALTH_STATUS.databaseUp },
      }),
    ).toBe(true);
  });
});
