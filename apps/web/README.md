# @portfolio/web

Aplicación Next.js mínima del portfolio. Utiliza App Router, Server Components por defecto y una base técnica de Tailwind CSS.

## Comandos

Desde la raíz del repositorio:

```powershell
pnpm dev:web
pnpm --filter @portfolio/web build
pnpm --filter @portfolio/web start
pnpm --filter @portfolio/web lint
pnpm --filter @portfolio/web typecheck
```

El typecheck ejecuta `next typegen` antes de TypeScript. `next-env.d.ts` es generado por Next.js y no se versiona.

En desarrollo se publica en `http://localhost:3000`.

## Catálogo de UI

`/dev/ui` expone en desarrollo el catálogo técnico de tokens, temas, densidades y componentes públicos de `@portfolio/ui`. La ruta declara `noindex` y devuelve 404 cuando `NODE_ENV=production`; no debe utilizarse como página de producto.
