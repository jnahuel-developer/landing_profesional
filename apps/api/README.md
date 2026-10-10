# @portfolio/api

API modular basada en Fastify. Expone el punto de entrada técnico `GET /api/v1`, healthchecks y utiliza el logger Pino integrado en Fastify.

## Configuración

- `NODE_ENV`: `development`, `test` o `production`; por defecto `development`.
- `API_PORT`: entero entre 1 y 65535; por defecto `4000`.
- `DATABASE_URL`: URL PostgreSQL obligatoria.

Las variables se validan antes de abrir el puerto. Los valores locales aprobados están documentados en `.env.example`.

## Comandos

Desde la raíz del repositorio:

```powershell
pnpm dev:api
pnpm --filter @portfolio/api build
pnpm --filter @portfolio/api start
pnpm --filter @portfolio/api lint
pnpm --filter @portfolio/api typecheck
pnpm --filter @portfolio/api test
pnpm --filter @portfolio/api test:integration
```

En desarrollo se publica en `http://localhost:4000`; el endpoint técnico está en `http://localhost:4000/api/v1`, los healthchecks en `/api/v1/health/live` y `/api/v1/health/ready`, y la UI OpenAPI en `/documentation`. La documentación no se registra en `test` ni `production`.

## Contacto MOD010

`POST /api/v1/contacts` recibe el contrato TypeBox compartido y responde `201 { received: true }`.
El cuerpo admite hasta 16 KiB. Incluye `locale` (`es`/`en`), `website` (honeypot vacío)
y `formStartedAt` (epoch en milisegundos, al menos 2 segundos antes del envío).
Los campos técnicos no se guardan. Los espacios exteriores se normalizan y los
opcionales vacíos se omiten. Los errores públicos usan `VALIDATION_ERROR` (400),
`CONTACT_TOO_FAST` (400), `PAYLOAD_TOO_LARGE` (413), `RATE_LIMITED` (429) y
`SERVICE_UNAVAILABLE` (503), con requestId y sin estado del proveedor.
OpenAPI se publica sólo en desarrollo. No se confía en X-Forwarded-For arbitrario.
