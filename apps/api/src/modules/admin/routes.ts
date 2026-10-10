import { timingSafeEqual } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import {
  AdminLoginSchema,
  AdminLogoutSchema,
  AdminSessionSchema,
  ErrorResponseSchema,
  type AdminLogin,
} from '@portfolio/contracts';
import type { AdminRepository } from '@portfolio/database';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { AdminConfig } from './config.js';
import { digestToken, normalizeIdentifier, randomToken, verifyPassword } from './password.js';
import { AdminRateLimit } from './rate-limit.js';

export const SESSION_MS = 8 * 3600000;
type Session = NonNullable<Awaited<ReturnType<AdminRepository['session']>>>;
export interface AdminOptions {
  repository?: AdminRepository | undefined;
  config?: AdminConfig;
  now?: () => number;
  wait?: (ms: number) => Promise<unknown>;
  // Encapsulated test/future routes inherit precisely the same guard.
  registerRoutes?: (app: FastifyInstance) => void;
}
export function readAdminToken(cookie: string | undefined) {
  const values = (cookie ?? '')
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.startsWith('admin_session='));
  if (values.length !== 1) return undefined;
  const token = values[0]!.slice('admin_session='.length);
  return /^[a-f0-9]{64}$/.test(token) ? token : undefined;
}
export function adminCookie(token: string, secure: boolean, age = 28800) {
  return `admin_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${secure ? '; Secure' : ''}`;
}
function sameToken(supplied: unknown, expected: string) {
  return (
    typeof supplied === 'string' &&
    /^[a-f0-9]{64}$/.test(supplied) &&
    timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))
  );
}
export async function adminRoutes(app: FastifyInstance, options: AdminOptions) {
  const config = options.config ?? {
    webOrigin: 'http://localhost:3000',
    secure: false,
    attempts: 5,
    globalAttempts: 100,
  };
  const now = options.now ?? Date.now;
  const limiter = new AdminRateLimit(config.attempts, config.globalAttempts);
  const sessions = new WeakMap<FastifyRequest, Session>();
  const fail = (request: FastifyRequest, reply: FastifyReply, status: number) =>
    reply.status(status).send({
      code: (
        {
          400: 'VALIDATION_ERROR',
          401: 'ADMIN_UNAUTHORIZED',
          403: 'ADMIN_FORBIDDEN',
          429: 'RATE_LIMITED',
          503: 'SERVICE_UNAVAILABLE',
        } as Record<number, string>
      )[status],
      message:
        status === 401
          ? 'Acceso no autorizado.'
          : status === 503
            ? 'Servicio no disponible.'
            : 'La solicitud no puede completarse.',
      requestId: request.id,
    });
  const repository = () => {
    if (!options.repository) throw new Error('ADMIN_DB_UNAVAILABLE');
    return options.repository;
  };
  app.addHook('onRequest', async (request, reply) => {
    reply.header('Cache-Control', 'no-store, private');
    const path = request.url.split('?')[0];
    const login = path === '/api/v1/admin/auth/login' && request.method === 'POST';
    const logout = path === '/api/v1/admin/auth/logout' && request.method === 'POST';
    const mutation = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);
    if (mutation && request.headers.origin !== config.webOrigin) return fail(request, reply, 403);
    if (login) {
      if (request.headers['content-type']?.split(';')[0]?.trim() !== 'application/json')
        return fail(request, reply, 400);
      const limit = limiter.take(request.ip, now()); // trustProxy remains false; arbitrary forwarded headers are ignored.
      if (!limit.allowed) {
        reply.header('Retry-After', limit.retry);
        try {
          if (limit.report) await repository().audit('RATE_LIMIT');
        } catch {
          return fail(request, reply, 503);
        }
        return fail(request, reply, 429);
      }
      await (options.wait ?? delay)(limit.delay);
      return;
    }
    try {
      const token = readAdminToken(request.headers.cookie);
      // Check persistence even with absent/invalid cookie: outages never authorize.
      const found = await repository().session(digestToken(token ?? ''), new Date(now()));
      if (!found) {
        if (logout) return; // Idempotent no-session logout, still origin checked.
        return fail(request, reply, 401);
      }
      sessions.set(request, found);
      if (mutation && !sameToken(request.headers['x-admin-csrf'], found.csrf))
        return fail(request, reply, 403);
    } catch {
      request.log.error({ code: 'ADMIN_PERSISTENCE_FAILED' });
      return fail(request, reply, 503);
    }
  });
  const errors = {
    400: ErrorResponseSchema,
    401: ErrorResponseSchema,
    403: ErrorResponseSchema,
    413: ErrorResponseSchema,
    429: ErrorResponseSchema,
    503: ErrorResponseSchema,
  };
  const response = (session: Session) => ({
    identifier: session.identifier,
    expiresAt: session.expiresAt.getTime(),
    csrf: session.csrf,
  });
  app.post<{ Body: AdminLogin }>(
    '/auth/login',
    {
      bodyLimit: 2048,
      schema: { body: AdminLoginSchema, response: { 200: AdminSessionSchema, ...errors } },
    },
    async (request, reply) => {
      try {
        let identifier = '';
        try {
          identifier = normalizeIdentifier(request.body.identifier);
        } catch {
          /* same invalid-login path */
        }
        const user = await repository().user();
        const matches = user?.identifier === identifier;
        const valid = await verifyPassword(
          matches ? user.passwordHash : undefined,
          request.body.password,
        );
        if (!valid || !user) {
          await repository().audit('LOGIN_FAILED');
          return fail(request, reply, 401);
        }
        const token = randomToken();
        const time = now();
        const session = {
          digest: digestToken(token),
          userId: user.id,
          createdAt: new Date(time),
          expiresAt: new Date(time + SESSION_MS),
          csrf: randomToken(),
        };
        const previous = readAdminToken(request.headers.cookie);
        if (
          !(await repository().rotate(user, session, previous ? digestToken(previous) : undefined))
        )
          return fail(request, reply, 401);
        reply.header('Set-Cookie', adminCookie(token, config.secure));
        return response({ ...session, identifier: user.identifier });
      } catch {
        request.log.error({ code: 'ADMIN_LOGIN_UNAVAILABLE' });
        return fail(request, reply, 503);
      }
    },
  );
  app.get(
    '/auth/session',
    { schema: { response: { 200: AdminSessionSchema, ...errors } } },
    async (request) => response(sessions.get(request)!),
  );
  app.post(
    '/auth/logout',
    { schema: { response: { 200: AdminLogoutSchema, ...errors } } },
    async (request, reply) => {
      try {
        const token = readAdminToken(request.headers.cookie);
        await repository().logout(token ? digestToken(token) : undefined);
        reply.header('Set-Cookie', adminCookie('', config.secure, 0));
        return { ok: true as const };
      } catch {
        return fail(request, reply, 503);
      }
    },
  );
  options.registerRoutes?.(app);
}
