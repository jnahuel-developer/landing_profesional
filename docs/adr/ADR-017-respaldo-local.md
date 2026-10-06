# ADR-017 — Respaldo local

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

- Se respaldará únicamente el esquema PostgreSQL `platform`.
- Se ejecutará `pg_dump` en formato custom una vez por día a las 03:30 de `America/Argentina/Buenos_Aires`.
- Los archivos se guardarán en `/srv/nahuelmartinez/backups/platform`.
- Se conservarán las catorce copias diarias más recientes.
- Cada backup tendrá timestamp, versión de esquema y checksum SHA-256.
- Los archivos pertenecerán a un usuario operativo y tendrán permisos restrictivos.
- La descarga será manual mediante SFTP.

## Exclusiones

No se respaldarán `demo_core`, `acme_cafe`, `acme_logistica`, PDFs temporales, fotografías estáticas ni logs. No habrá bucket, repositorio ni copia externa automática.

## Verificación

El comando comprobará que `pg_dump` finalizó correctamente y que el archivo no está vacío. Antes de producción se realizará una restauración de prueba del esquema `platform` en una base temporal.

## Justificación

Solo métricas, contactos y configuración tienen valor persistente. Esta política protege esos datos sin convertir las demos descartables en una carga operativa.
