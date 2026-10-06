# Documentación del proyecto

Esta carpeta es la fuente formal de documentación del repositorio.

## Mapa

- [`product/`](product/README.md): especificación general, brief de inicialización y roadmap de la web base.
- [`architecture/`](architecture/): datos permanentes, privacidad y catálogo de simulaciones.
- [`adr/`](adr/README.md): decisiones arquitectónicas aceptadas.
- [`operations/`](operations/OPERACION_Y_DESPLIEGUE.md): operación y despliegue futuro.
- [`agents/`](agents/README.md): reglas para encargar, controlar, validar y corregir trabajos realizados con Codex.
- [`design/`](design/README.md): referencias visuales aprobadas.
- [`api/`](api/README.md): espacio reservado para OpenAPI y convenciones de API.
- [`../domains/acme-cafe/`](../domains/acme-cafe/README.md): especificación de ACME Café.
- [`../domains/acme-logistica/`](../domains/acme-logistica/README.md): especificación de ACME Logística.

## Jerarquía de decisiones

Cuando dos documentos parezcan diferir, se aplica este orden:

1. ADR aceptado más reciente para decisiones arquitectónicas de largo plazo.
2. Documentos especializados de arquitectura, operación o dominio.
3. Especificación general de plataforma.
4. Brief de inicialización para el alcance del bootstrap actual.

El brief actual difiere deliberadamente la infraestructura productiva. Aunque los ADR describen Dockerfiles, Caddy, GHCR y despliegue como decisiones futuras aprobadas, esos elementos no se crean durante este bootstrap.

## Convenciones documentales

- Los documentos aprobados conservan su versión, estado y fecha originales.
- Los cambios que modifiquen arquitectura, alcance o contratos deben registrarse en un ADR o en el control de cambios del documento correspondiente.
- Los mockups son referencias visuales aprobadas, no capturas de una implementación existente.
- `docs previos de ChatGPT/` es un espejo de las fuentes originales y debe permanecer sin modificaciones.
