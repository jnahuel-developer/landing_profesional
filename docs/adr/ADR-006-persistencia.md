# ADR-006 — Persistencia y ORM

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

- PostgreSQL 18 será la base de datos.
- Se utilizará una única instancia y una única base.
- Los esquemas serán `platform`, `demo_core`, `acme_cafe` y `acme_logistica`.
- Drizzle ORM gestionará acceso y esquema desde TypeScript.
- Las migraciones SQL se generarán, revisarán y versionarán.
- Los datos semilla serán independientes de las migraciones.

## Reglas

- `drizzle-kit push` solo podrá utilizarse contra bases locales descartables.
- Una migración aplicada no se reescribirá.
- La limpieza de demos nunca afectará `platform`.
- Las pruebas de integración utilizarán PostgreSQL real, no SQLite.
- Los datos de ACME serán reconstruibles desde semillas.

## Justificación

Los esquemas proporcionan aislamiento lógico sin duplicar servidores ni conexiones. Drizzle conserva visibilidad del SQL y evita una capa de persistencia innecesariamente opaca.
