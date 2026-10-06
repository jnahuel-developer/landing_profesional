# ADR-005 — Contratos de API

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

- TypeBox definirá los esquemas HTTP.
- Fastify validará parámetros, query, body y respuestas.
- La especificación OpenAPI se generará desde las rutas.
- El frontend utilizará un cliente tipado generado desde OpenAPI.
- Los errores tendrán código estable, mensaje seguro, detalles de validación y request ID.
- No se utilizará tRPC.

## Justificación

OpenAPI mantiene una frontera explícita entre frontend y backend, facilita pruebas y permite reutilizar la API desde futuras aplicaciones sin depender de React o Next.js.

## Consecuencias

Solo los contratos públicos se compartirán. Las entidades y tipos internos del dominio permanecerán encapsulados.
