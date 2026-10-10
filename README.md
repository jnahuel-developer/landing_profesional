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

Las pruebas unitarias no requieren servicios. Las pruebas de integración y E2E requieren PostgreSQL y Mailpit.

## Aplicaciones

```powershell
pnpm dev
```

El comando compila primero los paquetes compartidos requeridos y después inicia web, API y el watcher de `@portfolio/ui` en paralelo. De este modo funciona desde una instalación limpia y los cambios TypeScript del sistema visual se recompilan durante el desarrollo.

| Aplicación | Dirección                      |
| ---------- | ------------------------------ |
| Web        | `http://localhost:3000`        |
| API        | `http://localhost:4000/api/v1` |

También pueden iniciarse por separado con `pnpm dev:web` y `pnpm dev:api`; `dev:web` realiza el build inicial y mantiene el watcher de `@portfolio/ui`. Los controles locales principales son `pnpm format:check`, `pnpm lint`, `pnpm typecheck` y `pnpm build`.

## Pruebas

Las unitarias se ejecutan sin PostgreSQL; las de integración y E2E utilizan una instancia real:

```powershell
pnpm test
docker compose up -d postgres mailpit
pnpm test:integration
pnpm test:e2e:install
pnpm test:e2e
```

`test:e2e:install` instala únicamente Chromium. Playwright compila `@portfolio/ui` de forma determinista, ejecuta las migraciones, inicia la web y la API, y detiene los procesos al terminar. `DATABASE_URL` puede definir una base descartable alternativa; sin esa variable se usa la configuración local de desarrollo documentada en `.env.example`. Los reportes HTML se guardan en `playwright-report/` y no se versionan.

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

## Contacto persistente (MOD010)

Después de iniciar los servicios, ejecutar `pnpm db:migrate` y `pnpm dev`.
Actualizar el `.env` local con `MAIL_TRANSPORT=smtp`, `SMTP_HOST=localhost`,
`SMTP_PORT=1025`, `MAIL_FROM=portfolio@localhost` y `MAIL_TO=contact@localhost`.
Consultar las notificaciones en [Mailpit local](http://localhost:8025).
`CONTACT_RATE_LIMIT` permite ajustar el límite de solicitudes por minuto (5 por IP por defecto).

El formulario usa `/api/v1/contacts` y Next lo reenvía mediante `API_INTERNAL_ORIGIN`
(sólo servidor, por defecto `http://127.0.0.1:4000`). El consumidor técnico existente
conserva `NEXT_PUBLIC_API_BASE_URL`. El contacto y su evento de recepción se guardan
en una transacción; después se espera un intento de correo de hasta 5 segundos.
Un fallo del correo conserva el contacto y devuelve recepción confirmada. Si falla
el registro del resultado, permanece `PENDING` y se registra un código técnico seguro.
No hay reintentos automáticos ni autorespuestas.

Para una futura configuración explícita de Resend se requiere `MAIL_TRANSPORT=resend`,
`RESEND_API_KEY`, `MAIL_FROM` y `MAIL_TO`; no se exigen variables SMTP. Ninguna prueba
contacta Resend: el HTTP se simula. CI inicia PostgreSQL y Mailpit sólo en integración
y E2E; las unitarias y build no requieren servicios ni credenciales.

## Documentación

La puerta de entrada es [docs/README.md](docs/README.md). Las fuentes históricas permanecen intactas en `docs previos de ChatGPT/` y no forman parte de la documentación operativa del repositorio.

## Analítica propia (MOD011)

La analítica es opcional, requiere aceptación explícita y funciona mediante el proxy same-origin. Configurá `WEB_ORIGIN` y `ANALYTICS_COOKIE_SECRET` sólo en servidor según `.env.example` (clave ficticia local; reemplazar antes de producción). Aplicá `pnpm db:migrate`.

- `pnpm analytics:aggregate [YYYY-MM-DD]`: agrega un día UTC pasado; default ayer, también configurable con `ANALYTICS_DAY`.
- `pnpm analytics:retain`: elimina crudos >180 días, sesiones >24 meses calendario y recibos vencidos/revocados, conservando agregados y contactos.

Ejecutar agregación antes de retención. No hay scheduler ni panel en esta mod. Cookies, matriz v1, comportamiento ante fallos y límites: [documentación de MOD011](docs/architecture/ANALITICA_Y_CONSENTIMIENTO_MOD011.md).

## Administración local

MOD012 incorpora autenticación local y sesiones de ocho horas. Ver [operación, configuración y pruebas de administración](docs/architecture/MOD012_AUTENTICACION_ADMINISTRATIVA.md). Los comandos `pnpm admin:create`, `pnpm admin:password`, `pnpm admin:revoke-sessions` y `pnpm admin:retain` cargan el `.env` raíz; nunca configurar contraseñas en ese archivo.
