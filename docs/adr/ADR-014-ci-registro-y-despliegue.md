# ADR-014 — CI, registro y despliegue

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

- GitHub alojará el repositorio.
- GitHub Actions ejecutará lint, tipos, pruebas, build, validación de migraciones y construcción de imágenes.
- `main` será una rama protegida y requerirá CI satisfactorio.
- GitHub Container Registry almacenará imágenes privadas de `web` y `api`.
- Cada imagen tendrá una etiqueta inmutable con SHA completo y etiquetas auxiliares de versión.
- Producción se desplegará mediante un workflow manual `workflow_dispatch`.
- No habrá despliegue automático por cada push a `main`.

## Flujo productivo

1. seleccionar un SHA ya validado;
2. generar backup local de `platform`;
3. descargar las imágenes exactas;
4. ejecutar migraciones;
5. recrear web y API;
6. ejecutar smoke tests;
7. conservar el SHA anterior para rollback.

## Justificación

Separar integración de promoción evita publicar accidentalmente trabajo incompleto. GHCR se integra con permisos de GitHub Actions y elimina la necesidad de otro registro.
