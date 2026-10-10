import {
  ContactInputSchema,
  ContactReceiptSchema,
  ErrorResponseSchema,
  ERROR_CODES,
  normalizeContact,
  type ContactInput,
} from '@portfolio/contracts';
import type { ContactRepository } from '@portfolio/database';
import type { FastifyInstance } from 'fastify';
import type { ContactNotifier } from './mail.js';

export interface ContactOptions {
  repository?: ContactRepository | undefined;
  notifier?: ContactNotifier;
  rateLimit?: number;
  now?: () => number;
}
export async function contactRoutes(app: FastifyInstance, options: ContactOptions) {
  const entries = new Map<string, { count: number; expires: number }>();
  const now = options.now ?? Date.now;
  app.post<{ Body: ContactInput }>(
    '/api/v1/contacts',
    {
      bodyLimit: 16 * 1024,
      schema: {
        body: ContactInputSchema,
        response: {
          201: ContactReceiptSchema,
          400: ErrorResponseSchema,
          413: ErrorResponseSchema,
          429: ErrorResponseSchema,
          503: ErrorResponseSchema,
        },
      },
      onRequest: async (request, reply) => {
        const time = now();
        for (const [ip, entry] of entries) if (entry.expires <= time) entries.delete(ip);
        const entry = entries.get(request.ip);
        if (
          (entry && entry.count >= (options.rateLimit ?? 5)) ||
          (!entry && entries.size >= 10000)
        ) {
          reply.header('Retry-After', '60');
          return reply.status(429).send({
            code: ERROR_CODES.rateLimit,
            message: 'Demasiadas solicitudes.',
            requestId: request.id,
          });
        }
        if (entry) entry.count++;
        else entries.set(request.ip, { count: 1, expires: time + 60000 });
      },
      preValidation: async (request) => {
        request.body = normalizeContact(request.body) as typeof request.body;
      },
    },
    async (request, reply) => {
      const input = request.body;
      if (input.website) return reply.status(201).send({ received: true });
      if (now() - input.formStartedAt < 2000)
        return reply.status(400).send({
          code: ERROR_CODES.tooFast,
          message: 'Espere y vuelva a enviar.',
          requestId: request.id,
        });
      let id: string;
      try {
        if (!options.repository) throw new Error('CONTACT_REPOSITORY_UNAVAILABLE');
        const { name, email, company, projectType, message, locale } = input;
        id = await options.repository.receive({
          name,
          email,
          company,
          projectType,
          message,
          locale,
        });
      } catch {
        request.log.error({ code: 'CONTACT_PERSISTENCE_FAILED', requestId: request.id });
        return reply.status(503).send({
          code: ERROR_CODES.serviceUnavailable,
          message: 'Servicio no disponible.',
          requestId: request.id,
        });
      }
      const status = options.notifier ? await options.notifier.notify(input) : 'FAILED';
      request.log.info({ code: `CONTACT_NOTIFICATION_${status}`, requestId: request.id });
      try {
        await options.repository!.recordNotification(id, status);
      } catch {
        request.log.error({ code: 'CONTACT_NOTIFICATION_RECORD_FAILED', requestId: request.id });
      }
      return reply.status(201).send({ received: true });
    },
  );
}
