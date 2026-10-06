import { Type, type Static } from 'typebox';

export const HEALTH_STATUS = {
  ok: 'ok',
  databaseUp: 'up',
} as const;

export const LiveResponseSchema = Type.Object(
  {
    status: Type.Literal(HEALTH_STATUS.ok),
    service: Type.Literal('portfolio-api'),
  },
  { additionalProperties: false },
);

export const ReadyResponseSchema = Type.Object(
  {
    status: Type.Literal(HEALTH_STATUS.ok),
    checks: Type.Object(
      {
        database: Type.Literal(HEALTH_STATUS.databaseUp),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export type LiveResponse = Static<typeof LiveResponseSchema>;
export type ReadyResponse = Static<typeof ReadyResponseSchema>;
