# ADR-003 — Stack frontend

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

- Next.js 16 Active LTS con App Router.
- React 19 y TypeScript estricto.
- Server Components para contenido público por defecto; Client Components solo donde exista interacción.
- Tailwind CSS para composición.
- Variables CSS para tokens de color, espacio, tipografía, elevación y movimiento.
- Radix UI para primitivas accesibles.
- TanStack Query para estado remoto.
- Solución de i18n compatible con App Router, con diccionarios versionados.
- Estado local mediante React; no se utilizarán Redux ni Zustand inicialmente.

## Justificación

El proyecto combina contenido público indexable y aplicaciones interactivas complejas. Next.js cubre ambos sin separar el sitio del laboratorio.

## Consecuencias

El frontend no contendrá reglas de negocio críticas ni secretos. La incorporación de un store global requerirá una necesidad concreta documentada.
