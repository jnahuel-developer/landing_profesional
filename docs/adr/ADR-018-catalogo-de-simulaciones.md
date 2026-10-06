# ADR-018 — Catálogo versionado y adaptadores simulados

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

Las integraciones demostrativas utilizarán exclusivamente adaptadores internos respaldados por escenarios versionados. No se realizarán conexiones hacia ARCA, procesadores de pago, Google Maps, Waze, servicios de telemetría, mensajería ni proveedores externos de IA.

Cada escenario tendrá identificador estable, versión, prioridad, estado inicial, pasos, respuestas, consecuencias y datos esperados. Los recorridos guiados fijarán el caso; la exploración libre permitirá elegirlo o resolverlo de forma determinista desde la sesión.

El catálogo inicial se define en `docs/architecture/CATALOGO_ESCENARIOS_SIMULADOS.md`.

## Implementación

- Los contratos se validarán con TypeBox.
- Los fixtures serán JSON o módulos TypeScript versionados junto al código.
- Los adaptadores devolverán los mismos tipos que utilizaría una integración real, sin copiar innecesariamente formatos propietarios.
- Las demoras serán breves, configuradas y omitibles en pruebas automatizadas.
- Las respuestas no dependerán de azar no controlado.
- Los proveedores externos mencionados se identificarán siempre como simulaciones.

## Justificación

La plataforma debe demostrar decisiones, estados, errores y consecuencias, no la disponibilidad de terceros. Este enfoque produce una experiencia estable y creíble con menor mantenimiento, sin credenciales, cuotas ni fallas externas.

## Consecuencias

La sustitución futura por una integración real requerirá otro adaptador, controles operativos y un ADR específico. No se incorporarán esas complejidades anticipadamente.
