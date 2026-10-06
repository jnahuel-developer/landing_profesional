# ADR-015 — Imágenes y Docker Compose

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

- Existirán dos imágenes propias: `web` y `api`.
- Los Dockerfiles serán multi-stage, ejecutarán como usuario no root y contendrán solo artefactos de producción.
- Next.js utilizará salida standalone.
- La imagen `api` ofrecerá comandos para servidor, migraciones, seeds, limpieza y backup.
- No existirá una imagen worker separada.
- PostgreSQL y Caddy utilizarán imágenes oficiales fijadas a una versión mayor y digest en producción.

## Compose productivo

Servicios:

- `caddy`;
- `web`;
- `api`;
- `postgres`.

Solo Caddy publicará puertos. Web, API y PostgreSQL estarán en una red interna. Los volúmenes persistentes serán PostgreSQL, datos de Caddy y backups locales.

## Justificación

La separación web/API permite ciclos y healthchecks independientes sin fragmentar los dominios internos. Los comandos puntuales evitan mantener procesos residentes innecesarios.
