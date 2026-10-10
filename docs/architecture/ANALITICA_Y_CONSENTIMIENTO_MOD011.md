# Consentimiento y analítica propia — MOD011

Taxonomía **v1**. Sólo documentos públicos `home`, `privacy`, `laboratory` en ES/EN. `/admin`, `/dev`, API y rutas desconocidas quedan excluidos. No existen eventos de inicio, módulo o recorrido de demo.

## Matriz de eventos

| Evento | Disparador | Propiedades cerradas | Finalidad |
| --- | --- | --- | --- |
| `page_view` | Activación del documento público; también documento actual al aceptar | `page`: home/privacy/laboratory | Visitas consentidas |
| `navigation_used` | Activación explícita de enlace de navegación | `origin`: ubicación; `destination`: sección/documento público | Navegación |
| `cta_clicked` | Activación de CTA declarado | `location`: ubicación; `destination`: contact/laboratory | Intención comercial |
| `language_changed` | Cambio efectivo de idioma observado en documento activado | `previous`, `next`: es/en | Preferencia de idioma |
| `theme_changed` | Cambio explícito de tema | `previous`, `next`: light/dark | Preferencia de tema |
| `contact_started` | Primer cambio real de campo público del formulario por sesión | `page` | Inicio de consulta |
| `contact_submitted` | Respuesta 201 y recibo confirmado, excluyendo honeypot | `page` | Consultas recibidas con consentimiento |
| `contact_failed` | Fallo confirmado por la mutation de envío | `category`: validation/rate_limit/unavailable/too_fast/payload | Fiabilidad del envío |
| `lab_viewed` | Activación del catálogo público | `page`: laboratory | Entrada al laboratorio |
| `demo_card_selected` | Enlace individual de empresa en experiencia | `company`: cafe/logistics; `location` | Interés por empresa |
| `section_viewed` | IntersectionObserver: al menos 35% de la menor altura entre sección y viewport durante un segundo visible | `section`: home/solutions/experience/process/about/contact | Lectura comercial aproximada |
| `carousel_changed` | Cambio real manual por puntos, teclado o swipe | `company`: cafe/logistics; `scene`: entero 1–5; `method`: dots/keyboard/swipe | Exploración manual de escenas |

Ubicaciones: header/footer, las seis secciones, privacy/laboratory. Destinos de navegación: las seis secciones, privacy/laboratory. No se lee texto visible del DOM. El enlace individual produce un CTA y una selección de empresa como métricas distintas, una vez cada una por activación. Autoplay, hover y foco no producen eventos de carrusel. La validación local no produce recepción de contacto.

Dimensiones comunes cerradas: `page`, `language` (es/en), `theme` (light/dark), `device` (mobile/tablet/desktop), `browser` (chromium/firefox/safari/other), dominio opcional `referrer`, y `utm_source`, `utm_medium`, `utm_campaign` opcionales. No se conserva User-Agent; sólo se clasifica localmente. Referrer HTTP(S) sólo conserva dominio DNS validado, máximo 253 caracteres; excluye IP/localhost. Nunca URL completa, path, query o hash arbitrarios. Los valores de UTM deben pertenecer a `campaignCatalog` compartido, inicialmente vacío: el cliente descarta valores desconocidos y la API los rechaza si llegan. Ampliar el catálogo requiere una campaña explícitamente declarada, no strings arbitrarios.

Cada evento usa UUID v4 aleatorio y fecha cliente acotada a ±5 minutos del servidor. El servidor asigna `received_at` para actividad, agregación y retención. Lote, evento, dimensiones y propiedades usan TypeBox con `additionalProperties: false`; se rechazan claves/eventos/valores desconocidos. No se vinculan contactos a sesiones.

## Consentimiento y cookies

GET `/api/v1/privacy/consent` devuelve sólo estado y vencimiento, con `Cache-Control: no-store, private`. POST elige con `{ analytics: boolean }`; DELETE retira y guarda necesarias. Las mutaciones y la ingestión exigen `Origin` exacto igual a `WEB_ORIGIN`, sin confiar en X-Forwarded-* ni abrir CORS. Se utiliza el proxy same-origin de MOD010.

| Cookie | Categoría | Duración | Contenido |
| --- | --- | --- | --- |
| `privacy_preference` | Necesaria | 180 días | Estado, vencimiento; recibo único sólo al aceptar |
| `analytics_visitor` | Opcional | 30 días | UUID aleatorio de visitante, vencimiento y recibo |
| `analytics_session` | Opcional | 30 minutos renovables con actividad confirmada | UUID de sesión y recibo |
| `privacy-withdrawal-pending-v1` | Necesaria, sólo retiro pendiente | Hasta sincronizar, máximo 180 días | Marca constante `1`, sin identificador |

Las tres primeras cookies están firmadas con HMAC-SHA256, HttpOnly, SameSite=Lax, Path=/, Secure en producción y sin Domain. La marca pendiente tiene espejo en localStorage y fallback en cookie legible para recordar el retiro si falla la red; no conserva eventos ni identidad. La preferencia de rechazo no crea filas ni identificadores únicos. El cliente consulta la API; nunca lee cookies HttpOnly.

`ANALYTICS_COOKIE_SECRET` sólo servidor, mínimo 32 caracteres; `WEB_ORIGIN` debe ser origen sin ruta/query/credenciales y HTTPS en producción. El arranque valida ambos sin revelar valores. Tests/CI usan claves ficticias declaradas; build y unitarios no requieren secretos reales.

Sólo la aceptación crea un recibo persistido revocable, versión 1 y expiración 180 días. Cada ingestión valida firma, vigencia y recibo activo en PostgreSQL. Un booleano en el lote no tiene autoridad. Identificadores de visitante y sesión son distintos, emitidos por servidor; el visitante rota cada 30 días sin correspondencias entre rotaciones. Al persistir actividad de una identidad rotada se desligan del recibo las sesiones de identidades anteriores; el recibo de 180 días no actúa como puente entre rotaciones. Una sesión nueva comienza tras 30 minutos de inactividad servidor. Reaceptar revoca el recibo anterior y genera identidad nueva.

Retirar desactiva inmediatamente cliente, cancela fetch/reintento pendientes y vacía cola. BroadcastChannel y storage detienen otras pestañas. Ante fallo queda pendiente el DELETE, se reintenta al recargar, recuperar conectividad o cada 10 segundos; nunca se restaura la aceptación antigua por encima de la marca pendiente. El aviso informa el fallo sin bloquear contenido/contacto. La revocación y la ingestión se serializan sobre el recibo: después del DELETE confirmado se rechazan lotes tardíos; una petición ya confirmada no se cancela ni elimina retroactivamente. Las cookies analíticas se borran al sincronizar con servidor; durante un fallo permanecen HttpOnly hasta sincronizar o vencer, pero no autorizan recolección local mientras existe el retiro pendiente.

## Transporte, cardinalidad y persistencia

Proveedor pequeño sin SDK. No se montan listeners analíticos, generan UUID de evento, encolan o envían interacciones antes de aceptar. Al aceptar sólo se considera el documento y las secciones actualmente visibles; no se reproduce historia previa. Cola en memoria de hasta 100 incluyendo lote pendiente, lotes de 20, flush cada 10 segundos o al alcanzar 20; eventos en cola mayores de cuatro minutos se descartan. Un reintento a un segundo ante fallo de red, 429 o 5xx, con los mismos UUID. 400/403/413 no se reintentan. Fetch con credenciales same-origin y límite de ocho segundos por intento; retirar aborta ambos intentos. Beacon al ocultarse sólo toma eventos aún no entregados a fetch; si el navegador no lo admite, se descarta ese lote. No hay beforeunload bloqueante ni persistencia de cola.

API: máximo 32 KiB y 20 eventos. Límite global técnico de 3000 peticiones/minuto por proceso para rutas de privacidad/analítica, sin mapa de IP ni promesa antifraude. No se registran payload, cookies ni headers sensibles.

Migración `0002_early_magdalene.sql`, esquema `platform`:

- `analytics_consents`: recibo, versión, aceptación, vencimiento y revocación, sin perfil del rechazante.
- `analytics_sessions`: IDs aleatorios, referencia revocable, página de entrada, primera/última actividad servidor, duración aproximada en segundos y contadores por evento. Sin contenido de contacto/demo.
- `analytics_events`: UUID único, sesión, versión, nombre, fechas servidor/cliente, dimensiones y propiedades cerradas. Unicidad adicional por sesión para `contact_started` y cada `section_viewed`.
- `analytics_daily`: día UTC y grupos de métricas sin IDs de visitante/sesión; cuentas de eventos y sesiones distintas por grupo, más sesiones por página de entrada. Los grupos preservan idioma, tema, dispositivo, navegador y atribución permitida. No sumar sesiones de grupos distintos para inferir un total único.

UUID deduplica reenvíos incluso si se perdió la respuesta que asignaba cookie de sesión; no crea sesiones vacías por un lote totalmente duplicado. La deduplicación de crudos dura su ventana de 180 días; fechas cliente limitadas impiden reproducir indefinidamente lotes antiguos. Restricción única por sección/sesión evita duplicados de remount y entre pestañas que compartan sesión. Visibilidad y duración son aproximaciones, no tiempo preciso de lectura.

## Agregación y retención por comando

Desde raíz, con cargador `.env` existente:

```sh
pnpm analytics:aggregate
pnpm analytics:aggregate 2026-10-08
pnpm analytics:retain
```

`ANALYTICS_DAY=YYYY-MM-DD` también configura día explícito; el argumento tiene precedencia. Default: día UTC anterior. Se validan fecha real y día pasado. Sin scheduler ni servicios permanentes.

Ejecutar agregación diaria antes de retención. Agregación transaccional con advisory lock por día y reemplazo/upsert; reejecuciones o ejecuciones concurrentes no suman duplicados. Usa recepción servidor en `[00:00 UTC, 00:00 UTC del día siguiente)`. No reescribe días cuyo inicio está fuera de los 180 días, pues podrían haber perdido fuente parcial o total; preserva históricos existentes incluso sin crudos. El operador debe agregar diariamente antes de que venza la fuente; datos crudos eliminados no se pueden reconstruir.

Retención transaccional: eventos estrictamente anteriores a 180 días; sesiones cuya última actividad es anterior a 24 meses **calendario** PostgreSQL. Los límites exactos permanecen. No toca agregados ni contactos. Recibos revocados/vencidos se desligan de sesiones con `SET NULL` y se eliminan; no se prolonga su identidad indefinidamente. Las sesiones conservan sus resúmenes hasta 24 meses, sin permitir revalidar recibos eliminados. Las relaciones permiten borrar crudos sin borrar sesiones/agregados y borrar sesiones con sus crudos remanentes. Los comandos no implementan tareas de contacto ni administración.

## Verificación

Contratos unitarios: cierre de objetos, documentos permitidos, referrer reducido y campañas ficticias declaradas. Cliente con reloj controlado: cero cola, UUID o ingestión antes de aceptar/rechazando; cola acotada, reintento idéntico, cancelación, retiro pendiente y recarga, cambio entre pestañas y vencimiento. Carrusel: callbacks manuales y ausencia en autoplay. Integración PostgreSQL temporal: migración vacía/reaplicación, vigencia/revocación/firma/origen, payload y fecha, rotaciones, deduplicación sin sesión fantasma, agregación repetida/concurrente, límites de 180 días y 24 meses calendario, conservación de históricos y comandos raíz. E2E ES/EN: teclado, foco, Escape, axe estable con movimiento reducido, consentimiento real, callbacks de formulario/carrusel, retiro entre pestañas y fallo persistido. Los escenarios heredados eligen necesarias explícitamente para preservar su propósito. Sin screenshots ni aceptación visual automatizada.
