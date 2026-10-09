# @portfolio/web

Aplicación Next.js del portfolio. Utiliza App Router, Server Components por defecto y una base técnica de Tailwind CSS.

## Shell global

La home localizada es el único documento comercial y reúne `#home`, `#solutions`, `#experience`, `#process`, `#about` y `#contact`. Comparte `PublicLayout`, con cabecera sticky, navegación por anclas, acceso a `/lab`, skip link y pie compacto. `/privacidad`, `/lab` y `/admin` siguen siendo documentos separados; administración no se enlaza desde superficies públicas.

La distinción entre secciones, documentos y rutas heredadas está centralizada en `src/config/routes.ts`. `SectionNavigationProvider` usa `IntersectionObserver` para marcar la sección activa y reemplaza el fragmento durante scroll; los clics explícitos agregan historial. Las rutas comerciales anteriores redirigen a la sección localizada correspondiente.

La contingencia para pantallas menores usa un menú nativo `details/summary`, por lo que los enlaces esenciales siguen disponibles sin JavaScript. Todas las páginas mantienen un único `main` enfocable y un único `h1`.

`not-found.tsx` ofrece recuperación navegable y `error.tsx` presenta un mensaje técnico seguro con reintento, sin exponer detalles internos.

## Internacionalización, preferencias y formatos

Español (`es`) es el diccionario canónico y se publica sin prefijo; inglés (`en`) usa `/en`. Los diccionarios viven en `src/messages`, conservan exactamente la misma forma y se validan con `pnpm i18n:check`. Para agregar un mensaje, incorporalo primero en `es.json`, agregá su equivalente en `en.json` y consumí la clave tipada mediante `next-intl`. Los slugs no se traducen.

La cookie funcional `NEXT_LOCALE` conserva el idioma explícito durante un año con `SameSite=Lax` y `Secure` en producción. La elección explícita de tema se guarda localmente bajo `nahuelmartinez.preferences.v2` y contiene solamente `light` o `dark`. El bootstrap de `instrumentation-client.ts` migra v1, aplica tema, densidad fija y movimiento del sistema antes de hidratar, sin insertar scripts ejecutables en el árbol React.

El contenido esencial es Server Component. `motion` 14 se limita a las islas de revelado, progreso de scroll y escena del hero; sin JavaScript el contenido queda visible, y con `prefers-reduced-motion` se muestra directamente el estado final.

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

La revisión manual final de ambos idiomas, los temas claro y oscuro y el movimiento corresponde al propietario del proyecto; las pruebas automatizadas no constituyen aprobación estética.
