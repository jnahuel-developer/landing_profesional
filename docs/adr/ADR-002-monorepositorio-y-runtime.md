# ADR-002 — Monorepositorio y runtime

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

- Node.js 24 LTS será el runtime.
- pnpm 11 administrará dependencias y workspaces.
- Se utilizará un monorepositorio con `apps/`, `packages/`, `domains/`, `infrastructure/` y `docs/`.
- TypeScript funcionará en modo estricto.
- La versión de pnpm se fijará en `packageManager`; Node se fijará mediante `.node-version` y `engines`.
- No se utilizarán Turborepo, Nx, Lerna ni otro orquestador inicialmente.

## Justificación

Web, API, contratos, diseño y dominios evolucionarán juntos. pnpm workspaces aporta resolución y scripts coordinados sin una capa adicional de infraestructura.

## Consecuencias

Los paquetes internos utilizarán `workspace:*`. Los dominios ACME no podrán importarse entre sí. Un orquestador solo se incorporará si existen problemas medidos de build o caché.
