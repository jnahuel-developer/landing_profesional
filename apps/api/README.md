# @portfolio/api

API mínima basada en Fastify. Expone el punto de entrada técnico `GET /api/v1` y utiliza el logger nativo de Fastify.

## Configuración

- `NODE_ENV`: `development`, `test` o `production`; por defecto `development`.
- `API_PORT`: entero entre 1 y 65535; por defecto `4000`.

Ambas variables se validan antes de abrir el puerto. Los valores locales aprobados están documentados en `.env.example`.

## Comandos

Desde la raíz del repositorio:

```powershell
pnpm dev:api
pnpm --filter @portfolio/api build
pnpm --filter @portfolio/api start
pnpm --filter @portfolio/api lint
pnpm --filter @portfolio/api typecheck
```

En desarrollo se publica en `http://localhost:4000`; el endpoint técnico está en `http://localhost:4000/api/v1`.
