La inicialización debe ser un monorepositorio pnpm, con dos aplicaciones ejecutables y pocos paquetes compartidos. No incorporaría todavía Caddy, imágenes Docker productivas, GHCR ni scripts de despliegue: solo desarrollo local reproducible.
Estructura inicial definitiva
nahuelmartinez-web/
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── apps/
│   ├── web/
│   │   ├── public/
│   │   │   ├── fonts/
│   │   │   ├── images/
│   │   │   └── demo/
│   │   │       └── acme-logistica/
│   │   │           └── proof/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   └── [locale]/
│   │   │   │       ├── (public)/
│   │   │   │       │   ├── page.tsx
│   │   │   │       │   ├── soluciones/
│   │   │   │       │   ├── experiencia/
│   │   │   │       │   ├── como-trabajo/
│   │   │   │       │   ├── sobre-mi/
│   │   │   │       │   ├── contacto/
│   │   │   │       │   └── privacidad/
│   │   │   │       ├── lab/
│   │   │   │       └── admin/
│   │   │   ├── features/
│   │   │   │   ├── marketing/
│   │   │   │   ├── contact/
│   │   │   │   ├── analytics/
│   │   │   │   ├── admin/
│   │   │   │   └── laboratory/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── styles/
│   │   │   └── middleware.ts
│   │   ├── tests/
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── api/
│       ├── src/
│       │   ├── app.ts
│       │   ├── server.ts
│       │   ├── config/
│       │   ├── plugins/
│       │   │   ├── database.ts
│       │   │   ├── authentication.ts
│       │   │   ├── rate-limit.ts
│       │   │   └── openapi.ts
│       │   ├── modules/
│       │   │   ├── health/
│       │   │   ├── demo-sessions/
│       │   │   ├── analytics/
│       │   │   ├── contacts/
│       │   │   ├── admin/
│       │   │   └── maintenance/
│       │   └── shared/
│       │       ├── errors/
│       │       ├── logging/
│       │       └── validation/
│       ├── tests/
│       │   ├── integration/
│       │   └── unit/
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── config/
│   │   ├── eslint/
│   │   └── typescript/
│   ├── contracts/
│   │   └── src/
│   │       ├── platform/
│   │       ├── analytics/
│   │       ├── contacts/
│   │       ├── demo-sessions/
│   │       └── common/
│   ├── database/
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── schema/
│   │   │   │   ├── platform/
│   │   │   │   ├── demo-core/
│   │   │   │   ├── acme-cafe/
│   │   │   │   └── acme-logistica/
│   │   │   └── seed/
│   │   ├── migrations/
│   │   └── drizzle.config.ts
│   ├── ui/
│   │   └── src/
│   │       ├── components/
│   │       ├── tokens/
│   │       ├── icons/
│   │       └── print/
│   ├── demo-kit/
│   │   └── src/
│   │       ├── shell/
│   │       ├── session/
│   │       ├── roles/
│   │       ├── scenarios/
│   │       └── guided-tour/
│   └── simulation-catalog/
│       ├── src/
│       │   ├── contracts/
│       │   ├── acme-cafe/
│       │   └── acme-logistica/
│       └── tests/
│
├── domains/
│   ├── acme-cafe/
│   │   └── README.md
│   └── acme-logistica/
│       └── README.md
│
├── tests/
│   └── e2e/
│       ├── public-site/
│       ├── contact/
│       ├── admin/
│       └── laboratory/
│
├── infrastructure/
│   ├── local/
│   │   └── README.md
│   └── production/
│       └── README.md
│
├── docs/
│   ├── adr/
│   ├── architecture/
│   ├── operations/
│   ├── api/
│   └── product/
│
├── .editorconfig
├── .env.example
├── .gitignore
├── .node-version
├── compose.yaml
├── eslint.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── prettier.config.mjs
├── README.md
└── tsconfig.base.json
Responsabilidades
- apps/web: única aplicación Next.js. Aloja portfolio, /lab y /admin.
- apps/api: monolito modular Fastify. No se crean microservicios.
- packages/contracts: TypeBox, tipos de API y códigos de error compartidos.
- packages/database: Drizzle, esquemas, migraciones y semillas.
- packages/ui: componentes visuales, tokens, temas y vistas imprimibles.
- packages/demo-kit: infraestructura común para sesiones, roles y recorridos.
- packages/simulation-catalog: escenarios deterministas aprobados.
- domains/: reservado para la lógica propia de las empresas. Inicialmente contendrá únicamente documentación; no implementaremos todavía las demos.
Reglas de dependencia
apps/web ──► ui, contracts, demo-kit
apps/api ──► contracts, database, simulation-catalog
demo-kit ──► contracts, ui
domains/* ──► contracts, simulation-catalog
database ──► contracts
Los paquetes nunca deberán importar código desde apps/. El frontend tampoco importará directamente database.
Servicios locales
El compose.yaml inicial levantará únicamente:
postgres    PostgreSQL 18
mailpit     SMTP y bandeja de correo local
Next.js y Fastify se ejecutarán directamente en Windows mediante pnpm para conservar recarga rápida y depuración sencilla.
Scripts raíz
{
  "scripts": {
    "dev": "pnpm --parallel --filter @portfolio/web --filter @portfolio/api dev",
    "dev:web": "pnpm --filter @portfolio/web dev",
    "dev:api": "pnpm --filter @portfolio/api dev",
    "services:up": "docker compose up -d",
    "services:down": "docker compose down",
    "db:generate": "pnpm --filter @portfolio/database db:generate",
    "db:migrate": "pnpm --filter @portfolio/database db:migrate",
    "db:seed": "pnpm --filter @portfolio/database db:seed",
    "db:studio": "pnpm --filter @portfolio/database db:studio",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck",
    "test": "pnpm -r test",
    "test:integration": "pnpm --filter @portfolio/api test:integration",
    "test:e2e": "playwright test",
    "format": "prettier --write .",
    "check": "pnpm lint && pnpm typecheck && pnpm test"
  }
}
Configuración base
- Node.js 24 LTS fijado en .node-version y engines.
- pnpm 11 fijado mediante packageManager.
- TypeScript estricto.
- ESLint y Prettier compartidos.
- PostgreSQL con esquemas platform, demo_core, acme_cafe y acme_logistica.
- Español sin prefijo; inglés bajo /en, utilizando routing internacionalizado con prefijo opcional.
- API local bajo http://localhost:4000/api/v1.
- Web local bajo http://localhost:3000.
- Mailpit bajo http://localhost:8025.
Primera implementación
El primer incremento debe dejar funcionando:
1. monorepositorio y herramientas;
2. PostgreSQL y Mailpit;
3. Next.js con página inicial mínima;
4. Fastify con /api/v1/health/live y /api/v1/health/ready;
5. conexión Drizzle;
6. primera migración con los cuatro esquemas;
7. contratos compartidos;
8. CI con lint, typecheck, pruebas y build;
9. una prueba Playwright que abra la página y valide el healthcheck.
No crearía todavía contenedores de producción, Caddy, autenticación administrativa completa ni módulos internos de ACME. Esa es la estructura suficiente para empezar sin hipotecar las siguientes fases.