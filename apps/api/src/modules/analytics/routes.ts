import { randomUUID } from 'node:crypto';
import { Type } from 'typebox';
import {
  AnalyticsBatchSchema,
  ConsentChoiceSchema,
  ConsentStateSchema,
  campaignCatalog,
  type AnalyticsBatch,
  type CampaignCatalog,
} from '@portfolio/contracts';
import type { AnalyticsRepository } from '@portfolio/database';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { AnalyticsConfig } from './config.js';
import {
  cookieHeader,
  preferenceAge,
  preferenceCookie,
  readCookie,
  sessionCookie,
  signCookie,
  visitorAge,
  visitorCookie,
  type SignedValue,
} from './cookies.js';

export interface AnalyticsOptions {
  config?: AnalyticsConfig | undefined;
  repository?: AnalyticsRepository | undefined;
  now?: () => number;
  campaigns?: CampaignCatalog;
  rateLimit?: number;
}
export async function analyticsRoutes(app: FastifyInstance, options: AnalyticsOptions) {
  const now = options.now ?? Date.now;
  let windowStart = now();
  let requests = 0;
  const config = options.config;
  const repository = options.repository;
  function fail(reply: FastifyReply, status: number) {
    return reply.code(status).send({ available: false });
  }
  function clearAnalytics() {
    return [visitorCookie, sessionCookie].map((name) => cookieHeader(name, '', 0, config!.secure));
  }
  function issue(name: string, value: SignedValue, age: number) {
    return cookieHeader(name, signCookie(value, config!.secret), age, config!.secure);
  }
  function preference(request: FastifyRequest) {
    return readCookie(request.headers.cookie, preferenceCookie, config!.secret, now());
  }
  async function validPreference(request: FastifyRequest) {
    const value = preference(request);
    if (value?.kind === 'rejected') return value;
    if (value?.kind === 'accepted' && (await repository!.valid(value.id!, new Date(now()))))
      return value;
    return null;
  }
  async function available(request: FastifyRequest, reply: FastifyReply) {
    reply.header('Cache-Control', 'no-store, private');
    if (!config || !repository) return fail(reply, 503);
    if (request.method !== 'GET' && request.headers.origin !== config.webOrigin)
      return fail(reply, 403);
    if (now() - windowStart >= 60_000) {
      windowStart = now();
      requests = 0;
    }
    if (++requests > (options.rateLimit ?? 3000)) return fail(reply, 429);
  }
  function identity(request: FastifyRequest, receipt: string) {
    const old = readCookie(request.headers.cookie, visitorCookie, config!.secret, now());
    return old?.kind === 'visitor' && old.receipt === receipt
      ? old
      : { kind: 'visitor' as const, id: randomUUID(), receipt, expires: now() + visitorAge * 1000 };
  }
  app.get(
    '/api/v1/privacy/consent',
    { onRequest: available, schema: { response: { 200: ConsentStateSchema } } },
    async (request, reply) => {
      try {
        const value = await validPreference(request);
        if (!value) {
          reply.header('Set-Cookie', [
            ...clearAnalytics(),
            cookieHeader(preferenceCookie, '', 0, config!.secure),
          ]);
          return { state: 'undecided', expiresAt: null };
        }
        if (value.kind === 'accepted') {
          const visitor = identity(request, value.id!);
          reply.header(
            'Set-Cookie',
            issue(visitorCookie, visitor, Math.ceil((visitor.expires - now()) / 1000)),
          );
        } else reply.header('Set-Cookie', clearAnalytics());
        return { state: value.kind, expiresAt: value.expires };
      } catch {
        return fail(reply, 503);
      }
    },
  );
  async function choose(request: FastifyRequest, reply: FastifyReply, accept: boolean) {
    try {
      const old = preference(request);
      if (old?.kind === 'accepted') await repository!.revoke(old.id!, new Date(now()));
      const expires = now() + preferenceAge * 1000;
      const value: SignedValue = accept
        ? { kind: 'accepted', expires, id: randomUUID() }
        : { kind: 'rejected', expires };
      if (accept) await repository!.accept(value.id!, new Date(now()), new Date(expires));
      const cookies = [issue(preferenceCookie, value, preferenceAge), ...clearAnalytics()];
      if (accept)
        cookies[1] = issue(
          visitorCookie,
          {
            kind: 'visitor',
            id: randomUUID(),
            receipt: value.id!,
            expires: now() + visitorAge * 1000,
          },
          visitorAge,
        );
      reply.header('Set-Cookie', cookies);
      return { state: value.kind, expiresAt: expires };
    } catch {
      return fail(reply, 503);
    }
  }
  app.post<{ Body: { analytics: boolean } }>(
    '/api/v1/privacy/consent',
    {
      bodyLimit: 1024,
      onRequest: available,
      schema: { body: ConsentChoiceSchema, response: { 200: ConsentStateSchema } },
    },
    async (request, reply) => choose(request, reply, request.body.analytics),
  );
  app.delete(
    '/api/v1/privacy/consent',
    { onRequest: available, schema: { response: { 200: ConsentStateSchema } } },
    async (request, reply) => choose(request, reply, false),
  );
  app.post<{ Body: AnalyticsBatch }>(
    '/api/v1/analytics/events',
    {
      bodyLimit: 32 * 1024,
      onRequest: available,
      schema: {
        body: AnalyticsBatchSchema,
        response: {
          200: Type.Object({ received: Type.Literal(true) }, { additionalProperties: false }),
        },
      },
    },
    async (request, reply) => {
      try {
        const value = await validPreference(request);
        if (value?.kind !== 'accepted') return fail(reply, 403);
        const catalog = options.campaigns ?? campaignCatalog;
        for (const event of request.body.events) {
          if (Math.abs(event.at - now()) > 5 * 60_000) return fail(reply, 400);
          for (const key of ['utm_source', 'utm_medium', 'utm_campaign'] as const) {
            if (
              event.dimensions[key] !== undefined &&
              !catalog[key].includes(event.dimensions[key])
            )
              return fail(reply, 400);
          }
        }
        const visitor = identity(request, value.id!);
        const previous = readCookie(request.headers.cookie, sessionCookie, config!.secret, now());
        const session = await repository!.ingest(
          value.id!,
          visitor.id!,
          previous?.kind === 'session' && previous.receipt === value.id ? previous.id : undefined,
          request.body.events,
          new Date(now()),
        );
        if (!session) return fail(reply, 403);
        reply.header('Set-Cookie', [
          issue(visitorCookie, visitor, Math.ceil((visitor.expires - now()) / 1000)),
          issue(
            sessionCookie,
            { kind: 'session', id: session, receipt: value.id!, expires: now() + 30 * 60_000 },
            1800,
          ),
        ]);
        return { received: true };
      } catch {
        return fail(reply, 503);
      }
    },
  );
}
