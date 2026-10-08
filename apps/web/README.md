# @portfolio/web

Aplicación Next.js del portfolio. Utiliza App Router, Server Components por defecto y una base técnica de Tailwind CSS.

## Shell global

Las páginas comerciales viven en el route group `(public)` y comparten `PublicLayout`, con cabecera sticky, navegación primaria, acceso a `/lab`, skip link y pie. `/lab` y `/admin` usan layouts preliminares separados; administración no se enlaza desde superficies públicas.

Las rutas y sus labels provisionales están centralizados en `src/config/routes.ts`. El estado activo contempla la ruta exacta y descendientes, excepto Inicio, que sólo se activa en `/`.

La contingencia para pantallas menores usa un menú nativo `details/summary`, por lo que los enlaces esenciales siguen disponibles sin JavaScript. Todas las páginas mantienen un único `main` enfocable y un único `h1`.

No se incorporaron breadcrumbs: las rutas provisionales actuales son destinos superiores y no existe todavía un nivel descendiente que requiera orientación adicional.

`not-found.tsx` ofrece recuperación navegable y `error.tsx` presenta un mensaje técnico seguro con reintento, sin exponer detalles internos.

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
