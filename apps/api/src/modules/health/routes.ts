import {
  ERROR_CODES,
  ErrorResponseSchema,
  HEALTH_STATUS,
  LiveResponseSchema,
  ReadyResponseSchema,
} from '@portfolio/contracts';
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from 'typebox';

const EmptyQuerySchema = Type.Object({}, { additionalProperties: false });

export const healthRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    '/live',
    {
      schema: {
        tags: ['health'],
        summary: 'Comprueba que el proceso de API responde',
        querystring: EmptyQuerySchema,
        response: {
          200: LiveResponseSchema,
          400: ErrorResponseSchema,
        },
      },
    },
    async () =>
      ({
        status: HEALTH_STATUS.ok,
        service: 'portfolio-api',
      }) as const,
  );

  app.get(
    '/ready',
    {
      schema: {
        tags: ['health'],
        summary: 'Comprueba la disponibilidad de PostgreSQL',
        querystring: EmptyQuerySchema,
        response: {
          200: ReadyResponseSchema,
          400: ErrorResponseSchema,
          503: ErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        await app.database.check();
      } catch {
        return reply.status(503).send({
          code: ERROR_CODES.serviceUnavailable,
          message: 'La base de datos no está disponible.',
          requestId: request.id,
        });
      }

      return {
        status: HEALTH_STATUS.ok,
        checks: { database: HEALTH_STATUS.databaseUp },
      };
    },
  );
};
