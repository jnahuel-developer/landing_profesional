# nahuelmartinez-web

Monorepositorio de la web profesional y portfolio interactivo de Nahuel Martínez.

El producto comunica el posicionamiento **«Ingeniería de software para negocios»** mediante un sitio comercial y un laboratorio de demostraciones con datos ficticios. La línea base funcional, técnica y visual ya está documentada; la implementación de producto todavía no comenzó.

## Estado actual

El monorepositorio cuenta con una base ejecutable:

- aplicación Next.js mínima en `apps/web`;
- API Fastify mínima en `apps/api`;
- configuraciones públicas de TypeScript y ESLint en `packages/config`;
- servicios locales PostgreSQL 18 y Mailpit reservados para etapas posteriores;
- especificaciones, ADR y documentos de arquitectura aprobados.

Todavía no se implementaron migraciones, conexión con servicios, demos ACME, sistema visual, Caddy, imágenes Docker productivas ni despliegue.

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

## Requisitos

- Node.js 24 LTS
- pnpm 11
- Docker Engine con Docker Compose, solo para servicios con estado en desarrollo local

## Instalación

```powershell
Copy-Item .env.example .env
pnpm install --frozen-lockfile
```

Los scripts de desarrollo y base de datos cargan automáticamente el `.env` de la raíz con la API nativa de Node.js 24. No es necesario exportar variables manualmente y las variables ya presentes en el proceso tienen precedencia. La ausencia de `.env` también es válida en CI cuando el entorno inyecta la configuración necesaria.

Las pruebas unitarias no requieren servicios. Las pruebas de integración y E2E requieren PostgreSQL.

## Aplicaciones

```powershell
pnpm dev
```

El comando inicia ambos procesos en paralelo:

| Aplicación | Dirección                      |
| ---------- | ------------------------------ |
| Web        | `http://localhost:3000`        |
| API        | `http://localhost:4000/api/v1` |

También pueden iniciarse por separado con `pnpm dev:web` y `pnpm dev:api`. Los controles locales principales son `pnpm format:check`, `pnpm lint`, `pnpm typecheck` y `pnpm build`.

## Pruebas

Las unitarias se ejecutan sin PostgreSQL; las de integración y E2E utilizan una instancia real:

```powershell
pnpm test
docker compose up -d postgres
pnpm test:integration
pnpm test:e2e:install
pnpm test:e2e
```

`test:e2e:install` instala únicamente Chromium. Playwright ejecuta las migraciones, inicia la web y la API, y detiene ambos procesos al terminar. `DATABASE_URL` puede definir una base descartable alternativa; sin esa variable se usa la configuración local de desarrollo documentada en `.env.example`. Los reportes HTML se guardan en `playwright-report/` y no se versionan.

## Servicios locales

```powershell
pnpm services:up
pnpm services:down
```

`compose.yaml` reserva los siguientes puertos:

| Servicio     | Dirección                      |
| ------------ | ------------------------------ |
| Web          | `http://localhost:3000`        |
| API          | `http://localhost:4000/api/v1` |
| PostgreSQL   | `localhost:5432`               |
| Mailpit SMTP | `localhost:1025`               |
| Mailpit UI   | `http://localhost:8025`        |

No versionar `.env` ni secretos.

## Documentación

La puerta de entrada es [docs/README.md](docs/README.md). Las fuentes históricas permanecen intactas en `docs previos de ChatGPT/` y no forman parte de la documentación operativa del repositorio.
