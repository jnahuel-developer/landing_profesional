# ADR-008 — Estrategia y herramientas de prueba

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

- Vitest para pruebas unitarias y de servicios.
- Testing Library para comportamiento de componentes React.
- `fastify.inject()` para rutas HTTP sin socket.
- PostgreSQL real y aislado para repositorios y transacciones.
- Playwright para recorridos end-to-end en navegadores reales.
- axe para verificaciones automáticas de accesibilidad.

## Prioridades

1. reglas de negocio;
2. aislamiento entre sesiones;
3. migraciones y persistencia;
4. navegación pública;
5. contacto y panel administrativo;
6. recorridos críticos de las demos.

## Justificación

La combinación separa feedback rápido de validación integral y evita falsos positivos causados por sustituir PostgreSQL o el navegador real.

## Consecuencias

No se establecerá un porcentaje global de cobertura como objetivo. La cobertura se exigirá según riesgo funcional.
