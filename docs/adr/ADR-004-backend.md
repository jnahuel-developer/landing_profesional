# ADR-004 — Stack backend

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

- Fastify 5 y TypeScript estricto.
- Backend desplegable como un único proceso y organizado como monolito modular.
- Módulos iniciales: sesiones, analítica, contactos, administración y mantenimiento.
- ACME Café y ACME Logística se incorporarán como dominios separados dentro del mismo backend.
- Pino será el logger estructurado.
- Las rutas se versionarán bajo `/api/v1`.

## Estructura

Cada módulo separará transporte HTTP, casos de uso, dominio y persistencia. Los handlers HTTP no contendrán reglas de negocio ni consultas SQL directas.

## Justificación

Fastify ofrece validación, serialización, plugins y logging con menor ceremonia que un framework empresarial completo. Un monolito modular es suficiente para un VPS y evita microservicios prematuros.

## Consecuencias

No se crearán contenedores por módulo. Las dependencias entre dominios deberán pasar por interfaces explícitas o servicios de aplicación.
