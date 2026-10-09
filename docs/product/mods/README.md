# Plan de modificaciones de la web base

Este directorio contiene la definición implementable de las mods previstas en el [roadmap de la web base](../ROADMAP_WEB_BASE.md).

La ejecución de estas mods se rige por [`AGENTS.md`](../../../AGENTS.md) y el [procedimiento de operación y control](../../agents/OPERACION_Y_CONTROL.md).

## Convención

- Cada rama se denomina únicamente `modxxx`.
- Parte del último `develop` aprobado.
- Se integra mediante MR hacia `develop`.
- No se mezcla alcance de una mod posterior.
- Los criterios de aceptación del archivo correspondiente son obligatorios para aprobar el MR.

## Bloque 1 — Fundación ejecutable

- [MOD001 — Runtime, workspaces y aplicaciones mínimas](MOD001.md)
- [MOD002 — API, PostgreSQL y migración inicial](MOD002.md)
- [MOD003 — Infraestructura de pruebas y CI](MOD003.md)

## Bloque 2 — Sistema visual y shell global

- [MOD004 — Tokens, tipografía, temas y componentes base](MOD004.md)
- [MOD005 — Layout, navegación y pie global](MOD005.md)
- [MOD006 — Internacionalización, preferencias y accesibilidad](MOD006.md)

## Bloque 3 — Web comercial continua

- [MOD007 — Shell continuo, inicio y posicionamiento profesional](MOD007.md)
- [MOD008 — Secciones de soluciones, experiencia y metodología](MOD008.md)
- [MOD009 — Secciones finales, privacidad y laboratorio](MOD009.md)

## Bloque 4 — Datos permanentes y panel interno

- [MOD010 — Formulario, persistencia y correo](MOD010.md)
- [MOD011 — Consentimiento y analítica first-party](MOD011.md)
- [MOD012 — Autenticación y sesión administrativa](MOD012.md)
- [MOD013 — Panel administrativo](MOD013.md)

## Bloque 5 — Plataforma base del laboratorio

- [MOD014 — Sesiones demo](MOD014.md)
- [MOD015 — Catálogo, lanzador y shell del laboratorio](MOD015.md)
- [MOD016 — Roles, escenarios y recorridos guiados](MOD016.md)

## Bloque 6 — Consolidación

- [MOD017 — Observabilidad, logs y estado](MOD017.md)
- [MOD018 — Accesibilidad, SEO y rendimiento](MOD018.md)
- [MOD019 — Regresión final y preparación de v0.1.0](MOD019.md)

## Regla de cierre

La aprobación de una mod exige CI verde, criterios de aceptación completos, documentación actualizada y ausencia de defectos críticos conocidos dentro de su alcance.
