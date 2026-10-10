# Autenticación administrativa — MOD012

Una única cuenta local accede a `/admin/login` o `/en/admin/login`. La portada privada sólo confirma acceso y permite salir. No hay registro, recuperación por correo ni panel de contactos.

## Operación local

Con PostgreSQL migrado (`pnpm db:migrate`) y `DATABASE_URL` en el `.env` raíz:

- `pnpm admin:create`: solicita identificador y contraseña dos veces. Rechaza cuenta existente. El identificador se normaliza a minúsculas sin espacios exteriores; admite letras ASCII, números, punto, guion, guion bajo y arroba, hasta 100 caracteres.
- `pnpm admin:password`: solicita y confirma nueva contraseña; cambia el hash e invalida todas las sesiones en una transacción.
- `pnpm admin:revoke-sessions`: invalida todas las sesiones sin cambiar contraseña.
- `pnpm admin:retain`: elimina sesiones vencidas y auditoría estrictamente anterior a 180 días. Idempotente; ejecutar manualmente, sin scheduler.

Las contraseñas admiten 12–128 caracteres Unicode sin reglas de composición ni normalización. Los comandos de contraseña requieren TTY (PowerShell o Git Bash), usan Node sin shell externo y desactivan el eco, también al pegar. Ctrl+C cancela y restaura la terminal. No pasar contraseñas por argumentos, variables, `.env` o archivos. La implementación no crea la cuenta del propietario y `db:seed` no crea cuentas.

Comprobación manual del propietario: ejecutar create desde PowerShell y Git Bash, comprobar ausencia de eco, entrar en el navegador y cambiar contraseña/revocar sesiones; confirmar que las pestañas previas requieren nuevo acceso. Esta aceptación manual no se sustituye por los tests con terminal inyectada.

## Persistencia y criptografía

Migración incremental Drizzle: `platform.admin_users`, `platform.admin_sessions`, `platform.admin_audit`. `singleton` es único, obligatorio y tiene CHECK de valor verdadero: dos creaciones concurrentes no producen dos cuentas. La auditoría sólo contiene UUID, código categórico y timestamp. No guarda identificador intentado, IP, cabeceras, credenciales ni cookies. Ninguna tabla depende de analítica o consentimiento.

La biblioteca nativa `argon2`, instalada exclusivamente en API, usa Argon2id, memoria 65536 KiB, tres iteraciones, paralelismo uno y salt aleatorio propio de la biblioteca. El hash persiste sólo en PostgreSQL. Un usuario desconocido verifica contra un hash dummy válido efímero con los mismos parámetros; no se garantiza igualdad del tiempo de pared.

Cada login genera 32 bytes aleatorios de token opaco y revoca el token previo presentado, en transacción. Sólo su SHA-256 se almacena como clave primaria; la expiración tiene índice. Ocho horas absolutas según reloj servidor, sin renovación. La versión de credenciales y el bloqueo de cuenta compartido entre login e invalidación impiden restaurar credenciales revocadas mediante un login concurrente.

## Contrato y protección

- `POST /api/v1/admin/auth/login`: JSON cerrado, máximo 2 KiB, identificador y contraseña acotados. Cuenta ausente y contraseña incorrecta devuelven el mismo 401.
- `GET /api/v1/admin/auth/session`: identidad mínima, expiración en milisegundos y CSRF de sesión; sin sesión válida, 401.
- `POST /api/v1/admin/auth/logout`: invalida persistencia antes de confirmar y borra cookie. Idempotente para una sesión ausente; si la DB falla, 503 sin confirmar invalidación.

Todos los endpoints del plugin administrativo heredan el guard, incluidas futuras rutas registradas dentro del plugin `/api/v1/admin`. Sólo login es excepción de autenticación; logout sin sesión permite finalizar idempotentemente. No registrar nuevas rutas administrativas fuera de esa encapsulación. Contacto y consentimiento quedan fuera del guard. Los contratos TypeBox compartidos se incluyen en OpenAPI de desarrollo.

Toda mutación exige `Origin` exactamente igual a `WEB_ORIGIN`, sin aceptar ausente/null. Login exige JSON. Las demás mutaciones con sesión válida exigen `X-Admin-CSRF`: token aleatorio independiente de 32 bytes ligado a la sesión, comparado con `timingSafeEqual`. La consulta GET no muta. No se reutiliza el secreto analítico.

Cookie `admin_session`: HttpOnly, SameSite=Strict, Path=/, sin Domain, Max-Age=28800; Secure en producción. Borrado con idénticos atributos y Max-Age=0. No se guarda token en almacenamiento web ni se expone en JSON. Respuestas administrativas `Cache-Control: no-store, private`; errores seguros conservan status. Persistencia caída implica 503, nunca autorización por presencia de cookie.

El proxy same-origin Next existente incorpora únicamente `admin/:path*`, preservando Origin, CSRF y Set-Cookie. SSR reenvía sólo `admin_session` al backend con fetch no-store y timeout recuperable. El layout protegido es dinámico; login queda separado. No se usa returnTo: el destino es siempre `/admin` localizado. `proxy.ts` compone next-intl y agrega cabeceras privadas/noindex. Login y portada no se incluyen en sitemap; la analítica y el aviso público no se activan en administración.

## Límites y configuración

Reutiliza `WEB_ORIGIN` (HTTPS obligatorio en producción). Sin credenciales/hash/secreto administrativo en configuración o NEXT_PUBLIC.

- `ADMIN_LOGIN_ATTEMPTS`: cinco intentos por IP técnica cada 15 minutos, configurable de 1 a 100000.
- `ADMIN_LOGIN_GLOBAL_ATTEMPTS`: cien intentos globales cada 15 minutos, mismo rango.
- Memoria máxima: 10000 orígenes, con expiración; saturación rechaza nuevos orígenes. Demora progresiva 0–800 ms antes del trabajo criptográfico.

Fastify no confía en X-Forwarded-For. En una instalación detrás del proxy Next el límite por IP puede agrupar visitantes por origen técnico del proxy; es aceptable para una única cuenta y no implica bloqueo permanente. El techo global acota Argon2 aun con orígenes múltiples. Los límites son por proceso; esta mod no incorpora infraestructura distribuida. Se audita una vez cada ventana bloqueada por origen/global, sin registrar cada request anónimo al panel.

## Verificación y CI

Unitarias cubren criptografía real/dummy, comandos inyectados, terminal sin eco, rate limit y cookies. Integración usa PostgreSQL temporal y cubre migraciones/reaplicación, carrera de creación, expiración exacta, rotación, revocación/logout contra servidor, CSRF, errores, indisponibilidad y retención. E2E prepara una base temporal para toda la ejecución, genera una cuenta efímera propia, conserva servicios existentes y elimina sólo esa base al terminar; no reutiliza servidores del propietario. Incluye ES/EN, teclado, axe, cookie falsa y vencimiento controlado. CI usa los scripts existentes con PostgreSQL/Mailpit y la misma preparación aislada.

Las pruebas no realizan comparación visual ni aprobación estética. La aceptación visual y la validación remota después del push corresponden al propietario.
