# nahuelmartinez-web

Monorepositorio de la web profesional y portfolio interactivo de Nahuel Martínez.

El producto comunica el posicionamiento **«Ingeniería de software para negocios»** mediante un sitio comercial y un laboratorio de demostraciones con datos ficticios. La línea base funcional, técnica y visual ya está documentada; la implementación de producto todavía no comenzó.

## Estado actual

Este repositorio contiene el bootstrap documental y estructural aprobado:

- workspace pnpm preparado para `apps/` y `packages/`;
- estructura prevista para la aplicación Next.js y la API Fastify;
- servicios locales PostgreSQL 18 y Mailpit;
- configuración base de Node.js, TypeScript, ESLint y Prettier;
- especificaciones, ADR, documentos de arquitectura y mockups aprobados;
- espacios reservados para pruebas, infraestructura y dominios.

No se implementaron todavía las aplicaciones, las migraciones, las demos ACME, Caddy, imágenes Docker productivas, publicación en GHCR ni scripts de despliegue.

## Arquitectura prevista

- `apps/web`: única aplicación Next.js; alojará el sitio público, `/lab` y `/admin`.
- `apps/api`: monolito modular Fastify bajo `/api/v1`.
- `packages/contracts`: contratos TypeBox, tipos públicos y errores compartidos.
- `packages/database`: Drizzle, esquemas, migraciones y semillas.
- `packages/ui`: sistema visual y vistas imprimibles.
- `packages/demo-kit`: sesiones, roles y recorridos comunes a las demos.
- `packages/simulation-catalog`: escenarios deterministas versionados.
- `domains/`: documentación funcional propia de ACME Café y ACME Logística.

Las reglas de dependencia y el alcance completo se encuentran en [docs/README.md](docs/README.md).

## Requisitos previstos

- Node.js 24 LTS
- pnpm 11
- Docker Engine con Docker Compose, solo para servicios con estado en desarrollo local

La máquina actual deberá actualizarse de Node.js 22 a Node.js 24 antes de comenzar la implementación.

## Servicios locales

```powershell
pnpm services:up
pnpm services:down
```

`compose.yaml` reserva los siguientes puertos:

| Servicio                  | Dirección                      |
| ------------------------- | ------------------------------ |
| Web, cuando se implemente | `http://localhost:3000`        |
| API, cuando se implemente | `http://localhost:4000/api/v1` |
| PostgreSQL                | `localhost:5432`               |
| Mailpit SMTP              | `localhost:1025`               |
| Mailpit UI                | `http://localhost:8025`        |

Copiar `.env.example` a `.env` antes de levantar los servicios locales. No versionar `.env` ni secretos.

## Documentación

La puerta de entrada es [docs/README.md](docs/README.md). Las fuentes históricas permanecen intactas en `docs previos de ChatGPT/` y no forman parte de la documentación operativa del repositorio.
