import { ERROR_CODES, ErrorResponseSchema } from '@portfolio/contracts';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify, { type FastifyError } from 'fastify';
import { Type } from 'typebox';
import { contactRoutes, type ContactOptions } from './modules/contacts/routes.js';

import type { NodeEnvironment } from './config/env.js';
import { healthRoutes } from './modules/health/routes.js';
import { databasePlugin, type DatabaseDependency } from './plugins/database.js';
import { analyticsRoutes, type AnalyticsOptions } from './modules/analytics/routes.js';

const serviceStatus = {
  service: 'portfolio-api',
  version: 'v1',
  status: 'operational',
} as const;

const ServiceStatusSchema = Type.Object(
  {
    service: Type.Literal(serviceStatus.service),
    version: Type.Literal(serviceStatus.version),
    status: Type.Literal(serviceStatus.status),
  },
  { additionalProperties: false },
);

const unavailableDatabase: DatabaseDependency = {
  check: async () => {
    throw new Error('Database dependency was not configured.');
  },
  close: async () => undefined,
};

export interface BuildAppOptions {
  nodeEnv?: NodeEnvironment;
  database?: DatabaseDependency;
  logger?: boolean;
  contacts?: ContactOptions;
  analytics?: AnalyticsOptions;
}

function validationDetails(error: FastifyError) {
  return error.validation?.map((issue) => ({
    field: issue.instancePath || 'request',
    message: issue.message ?? 'Valor inválido.',
  }));
}

export async function buildApp(options: BuildAppOptions = {}) {
  const nodeEnv = options.nodeEnv ?? 'test';
  const app = Fastify({
    logger: options.logger ?? false,
    ajv: { customOptions: { coerceTypes: false, removeAdditional: false } },
  }).withTypeProvider<TypeBoxTypeProvider>();

  if (nodeEnv === 'development') {
    await app.register(swagger, {
      openapi: {
        info: {
          title: 'Portfolio API',
          version: '1.0.0',
        },
      },
    });
    await app.register(swaggerUi, {
      routePrefix: '/documentation',
    });
  }

  await app.register(databasePlugin, {
    database: options.database ?? unavailableDatabase,
  });

  app.setErrorHandler((error, request, reply) => {
    const fastifyError = error as FastifyError;

    if (fastifyError.validation) {
      return reply.status(400).send({
        code: ERROR_CODES.validation,
        message: 'La solicitud no es válida.',
        requestId: request.id,
        details: validationDetails(fastifyError),
      });
    }

    if (fastifyError.statusCode === 413 || fastifyError.statusCode === 400) {
      return reply.status(fastifyError.statusCode).send({
        code:
          fastifyError.statusCode === 413 ? ERROR_CODES.payloadTooLarge : ERROR_CODES.validation,
        message: 'La solicitud no es válida.',
        requestId: request.id,
      });
    }
    request.log.error({ code: 'UNHANDLED_REQUEST_ERROR', requestId: request.id });
    return reply.status(500).send({
      code: ERROR_CODES.internal,
      message: 'Ocurrió un error interno.',
      requestId: request.id,
    });
  });

  app.get(
    '/api/v1',
    {
      schema: {
        response: {
          200: ServiceStatusSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    async () => serviceStatus,
  );

  await app.register(healthRoutes, { prefix: '/api/v1/health' });
  await app.register(contactRoutes, {
    repository: options.database?.contacts,
    ...options.contacts,
  });
  await app.register(analyticsRoutes, {
    repository: options.database?.analytics,
    ...options.analytics,
  });

  return app;
}
