# ADR-007 — Desarrollo local

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

- Next.js y Fastify se ejecutarán directamente en el host durante el desarrollo.
- Docker Compose ejecutará PostgreSQL y Mailpit.
- Puertos predeterminados: web `3000`, API `4000`, PostgreSQL `5432`, SMTP `1025` y Mailpit UI `8025`.
- Se crearán Dockerfiles de producción desde el inicio, pero no serán el ciclo normal de edición.
- La configuración se documentará en `.env.example` y se validará al iniciar.

## Comandos mínimos

```text
pnpm dev
pnpm db:migrate
pnpm db:seed
pnpm db:reset-demo
pnpm test
pnpm test:e2e
pnpm build
```

## Justificación

Este esquema conserva hot reload rápido en Windows y mantiene reproducibles las dependencias con estado.

## Consecuencias

El build completo en contenedores será una verificación obligatoria de CI, no un requisito para cada cambio local.
