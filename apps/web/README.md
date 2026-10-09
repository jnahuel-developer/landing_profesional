# @portfolio/web

Aplicación Next.js del portfolio. Utiliza App Router, Server Components por defecto y una base técnica de Tailwind CSS.

## Shell global

Las páginas comerciales viven en `[locale]/(public)` y comparten `PublicLayout`, con cabecera sticky, navegación primaria, acceso a `/lab`, skip link y pie. `/lab` y `/admin` usan layouts preliminares separados; administración no se enlaza desde superficies públicas.

La identidad, clasificación y pathname de las rutas están centralizados en `src/config/routes.ts`; sus textos provienen de los diccionarios. El estado activo opera sobre pathnames internos y contempla la ruta exacta y descendientes, excepto Inicio, que sólo se activa en `/`.

La contingencia para pantallas menores usa un menú nativo `details/summary`, por lo que los enlaces esenciales siguen disponibles sin JavaScript. Todas las páginas mantienen un único `main` enfocable y un único `h1`.

No se incorporaron breadcrumbs: las rutas provisionales actuales son destinos superiores y no existe todavía un nivel descendiente que requiera orientación adicional.

`not-found.tsx` ofrece recuperación navegable y `error.tsx` presenta un mensaje técnico seguro con reintento, sin exponer detalles internos.

## Internacionalización, preferencias y formatos

Español (`es`) es el diccionario canónico y se publica sin prefijo; inglés (`en`) usa `/en`. Los diccionarios viven en `src/messages`, conservan exactamente la misma forma y se validan con `pnpm i18n:check`. Para agregar un mensaje, incorporalo primero en `es.json`, agregá su equivalente en `en.json` y consumí la clave tipada mediante `next-intl`. Los slugs no se traducen.

La cookie funcional `NEXT_LOCALE` conserva el idioma explícito durante un año con `SameSite=Lax` y `Secure` en producción. Las preferencias visuales se guardan localmente bajo `nahuelmartinez.preferences.v1`; no contienen datos sensibles y un bootstrap previo a hidratación aplica sus atributos al documento.

Los formatos compartidos están en `src/i18n/formats.ts`: `es` usa `es-AR`, `en` usa `en-US` y la zona predeterminada es `America/Argentina/Buenos_Aires`. La moneda siempre se pasa explícitamente como código ISO; un dominio que necesite otra zona debe usar el override del helper.

## Comandos

Desde la raíz del repositorio:

```powershell
pnpm dev:web
pnpm --filter @portfolio/web build
pnpm --filter @portfolio/web start
pnpm --filter @portfolio/web lint
pnpm --filter @portfolio/web typecheck
pnpm i18n:check
```

El typecheck ejecuta `next typegen` antes de TypeScript. `next-env.d.ts` es generado por Next.js y no se versiona.

El comando de pruebas de web compila primero `@portfolio/ui`, de modo que valida su contrato público basado en `dist` y funciona directamente después de una instalación limpia.

En desarrollo se publica en `http://localhost:3000`.

## Catálogo de UI

`/dev/ui` expone en desarrollo el catálogo técnico de tokens, temas, densidades y componentes públicos de `@portfolio/ui`. La ruta declara `noindex` y devuelve 404 cuando `NODE_ENV=production`; no debe utilizarse como página de producto.

La revisión manual final de ambos idiomas, los temas claro, oscuro y alto contraste, y las densidades cómoda y compacta corresponde al propietario del proyecto; las pruebas automatizadas no constituyen aprobación estética.
