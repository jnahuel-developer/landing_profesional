# Eventos declarativos de la superficie pública

MOD009 prepara puntos declarativos. No hay recolección, transporte, persistencia ni consentimiento operativo. La conexión corresponde a MOD011 y requerirá consentimiento explícito (ADR-009 y ADR-012).

| Punto | Evento previsto | Dimensiones permitidas |
|---|---|---|
| CTA de home, pie y Laboratorio | `cta_clicked` (atributo actual `cta_select`) | origen categórico, destino `contact` o `laboratory`, idioma, tema |
| Punto, teclado o swipe | `carousel_changed` (`carousel_select` en controles) | demo `cafe` o `logistics`, escena 1–5, origen categórico |
| Primera interacción con formulario | `contact_started` | documento, idioma; una vez por recorrido |
| Revisión local del formulario | `contact_validated` (`contact_validation` en control) | resultado `invalid` o `prepared`; nunca `submitted` en MOD009 |
| Entrada al catálogo público | `lab_opened` | documento, idioma, tema |

Los atributos `data-track-*` identifican puntos de integración; no son listeners ni afirman eventos emitidos. Teclado y gesto deberán conectarse al cambio de estado, evitando contar también el clic del control. El autoplay no se contará como intención del visitante. Hover, foco y visibilidad son pausas temporales; toda interacción manual detiene el autoplay definitivamente. No existe control ni evento de pausa/reanudación explícita. Las navegaciones del pie se resolverán por destino. No hay evento `demo_started` porque las cards públicas no inician experiencias. La futura taxonomía versionada normalizará los nombres de atributos con los eventos de la especificación.

Se excluyen nombres, correo, empresa, texto del mensaje, campos de formulario, IP, firmas, imágenes y contenido funcional de las demos. Tampoco se recogerán query strings o referencias sin una lista explícita de valores permitidos. No se usará el DOM del formulario como carga analítica.

## Contacto y fronteras

`@portfolio/contracts` publica `ContactInputSchema` (TypeBox) para la futura API: nombre 1–100, correo hasta 254 con patrón sintáctico, empresa opcional hasta 160, tipo opcional `web | product | automation | data | other`, mensaje 1–2000 y aceptación literal `true`. Los campos obligatorios no admiten sólo espacios y no se admiten propiedades adicionales.

El frontend actual conserva un validador cliente con esos límites, sin nueva dependencia ni importaciones entre directorios de workspaces. Las pruebas contrastan ambos comportamientos con los mismos casos límite. MOD010 deberá consumir el contrato al conectar el transporte y retirar ese espejo si la frontera lo permite. El formulario no realiza fetch, no tiene endpoint y no escribe almacenamiento; su único resultado válido es `prepared`.

Los documentos, el contenido de About, el cierre comercial y los títulos/descripciones de las escenas son contenido renderizado en servidor. Los carruseles reciben escenas localizadas con rutas de imágenes WebP locales y usan Next Image con dimensiones intrínsecas; controlan selección, visibilidad y detención del autoplay. El formulario y las suscripciones a preferencias del navegador quedan acotados a componentes cliente. Los límites globales de error tienen su propia traducción de respaldo, sin depender del proveedor del layout.

La portada de `/lab` es indexable; sus futuras sesiones y módulos no lo son. Sólo home, privacidad y catálogo, en español e inglés, figuran en el sitemap. La aceptación visual y la revisión legal antes de producción quedan a cargo del propietario.
