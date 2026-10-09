# Contrato visual — Imágenes de carruseles ACME

**Estado:** Imágenes aprobadas, registradas como mockups e integradas en MOD009
**Fecha:** 2026-10-09  
**Aplicación:** corrección visual de MOD009  

## 1. Objetivo

Reemplazar las miniinterfaces construidas mediante HTML, CSS y SVG dentro de las cards de ACME Café y ACME Logística por diez imágenes estáticas de alta calidad visual, cinco por empresa.

Las imágenes se generarán, revisarán y aprobarán antes de preparar el prompt correctivo de MOD009. Las láminas conceptuales anteriores son referencias de composición; no se incorporarán directamente al producto.

## 2. Contrato técnico

- resolución final: `1600×900 px`;
- relación de aspecto: `16:9` exacta;
- perfil de color: sRGB;
- formato de producción: WebP;
- peso objetivo: entre 150 y 300 KB por imagen;
- peso máximo orientativo: 400 KB por imagen;
- área segura mínima: 5 % en cada borde;
- encuadre centrado, sin información indispensable cerca de los límites;
- dimensiones, perspectiva, marco y escala consistentes en las diez imágenes;
- sin transparencia, watermark, browser chrome, logos de terceros ni marcas de proveedores externos.

Las fuentes generadas podrán conservarse como PNG durante la revisión. Una vez aprobadas, se normalizarán a `1600×900` y se convertirán a WebP.

## 3. Tamaños de presentación verificados

| Viewport de referencia | Ancho aproximado | Alto 16:9 aproximado |
|---|---:|---:|
| `1440×900` | 614 px | 345 px |
| `1280×720` | 534 px | 300 px |
| `390×844` | 308 px | 173 px |

La implementación utilizará `width: 100%` y `aspect-ratio: 16 / 9`. No mantendrá las alturas fijas anteriores de `22rem` y `24rem`. Las imágenes no deberán deformarse ni depender de recortes variables para encajar.

## 4. Localización y texto incrustado

Las mismas diez imágenes se utilizarán en español e inglés. Por ese motivo:

- no se incrustarán títulos, descripciones o instrucciones indispensables;
- se priorizarán iconos, cifras, gráficos, estados visuales y textos secundarios mínimos;
- cualquier microtexto decorativo deberá ser neutral o prescindible;
- el título, descripción y nombre accesible de cada escena permanecerán como contenido HTML localizado;
- la imagen no repetirá información textual que ya se encuentre disponible para tecnologías de asistencia.

La iteración 02 incorpora descripciones revisadas y tres chips específicos por escena en ES/EN. El arreglo localizado de escenas es la única fuente de imagen, título, descripción y chips; no hay estado independiente para estos últimos. Los títulos se conservan. Las capacidades genéricas siguen disponibles para el catálogo del Laboratorio, pero no se muestran en las cards de Experiencia.

Título y descripción quedan centrados, con un título aproximadamente un 50 % mayor y descripción de ancho controlado sin saltos forzados. Todas las escenas participan de una grilla de tamaño estable: sólo la activa es visible y accesible; las restantes son inertes. Los tres chips ocupan columnas iguales con wrapping y se apilan en el viewport estrecho. El fallback sin JavaScript incluye también los chips.

## 5. ACME Café

Dirección visual: producto SaaS comercial de alta fidelidad, identidad cálida, superficies azul oscuro o carbón, acentos ámbar y crema, estados verdes o rojos limitados y componentes realistas.

| Orden | Escena | Intención visual | Archivo previsto |
|---:|---|---|---|
| 1 | Resumen operativo | ventas del día, pedidos activos, ocupación y una lectura ejecutiva inmediata | `apps/web/public/images/experience/acme-cafe/01-operations-overview.webp` |
| 2 | Venta conectada | flujo POS con productos, pedido actual y total, mostrando conexión entre caja y operación | `apps/web/public/images/experience/acme-cafe/02-connected-sale.webp` |
| 3 | Stock y reposición | inventario reconocible, niveles de existencias y una alerta de reposición | `apps/web/public/images/experience/acme-cafe/03-stock-replenishment.webp` |
| 4 | Reservas y mesas | plano simple del salón, estados de mesas y agenda breve | `apps/web/public/images/experience/acme-cafe/04-reservations-tables-v2.webp` |
| 5 | Atención asistida | conversación contextual, pedido asociado y una sugerencia útil de asistencia | `apps/web/public/images/experience/acme-cafe/05-assisted-service-v2.webp` |

## 6. ACME Logística

Dirección visual: plataforma logística profesional, azul oscuro y carbón, acentos azul eléctrico o cian, composición más despejada que Café y una única visualización dominante por escena.

| Orden | Escena | Intención visual | Archivo previsto |
|---:|---|---|---|
| 1 | Central operativa | mapa simplificado con pocas unidades, selección clara y estados generales | `apps/web/public/images/experience/acme-logistica/01-control-center.webp` |
| 2 | Planificación de rutas | comparación de dos recorridos precalculados y una recomendación evidente | `apps/web/public/images/experience/acme-logistica/02-route-planning.webp` |
| 3 | Flota y telemetría | pocas unidades, estados principales y una serie telemétrica de la unidad seleccionada | `apps/web/public/images/experience/acme-logistica/03-fleet-telemetry.webp` |
| 4 | Incidente coordinado | alerta, ubicación esquemática y comunicación breve entre chofer y central | `apps/web/public/images/experience/acme-logistica/04-coordinated-incident.webp` |
| 5 | Aplicación del chofer | interfaz móvil dominante con parada, entrega, estado offline y comprobante | `apps/web/public/images/experience/acme-logistica/05-driver-app.webp` |

## 7. Controles del carrusel

Los controles no formarán parte de las imágenes. Se renderizarán mediante HTML y CSS sobre el borde inferior del activo:

- cinco puntos pequeños centrados;
- activo blanco;
- inactivos negros semitransparentes y suavemente difuminados;
- sin cajas individuales visibles;
- sin flechas visibles;
- sin numeración `n / 5`;
- sin texto duplicado de posición;
- sin Pausar/Reanudar;
- selección accesible mediante cada punto;
- soporte adicional de teclado y swipe.

El avance automático sólo operará mientras la card sea visible. Se pausará con hover o foco y quedará detenido después de una interacción manual. No existirá acción de reanudación. Con movimiento reducido no habrá autoplay.

La escena completa (imagen, título, descripción y chips) tiene una entrada por opacidad de aproximadamente 280 ms que se reinicia al cambiar la selección, sin traslación, zoom ni cambio de tamaño. Con movimiento reducido no hay animación ni desenfoque.

## 8. CTA luminosos

Los CTA individuales y el CTA general del Laboratorio deberán sentirse activos incluso sin interacción:

- arco luminoso visible que recorre el perímetro en aproximadamente cuatro segundos;
- halo radial con pulsación suave de 2,5–3 segundos;
- acento ámbar para Café y azul/cian para Logística;
- mayor intensidad y tamaño en el CTA general;
- refuerzo moderado con hover y foco;
- sin cambios de tamaño, saltos de layout o parpadeos;
- estado estático de alto contraste con movimiento reducido.

Tratamiento final de la iteración 02: perímetro de 4 px en CTA individuales y 5 px en el general, sin cambiar la caja externa del botón. El segmento del degradado cónico ocupa aproximadamente un tercio del recorrido, con extremos suavizados y glow localizado moderado. La rotación utiliza `transform`, mantiene el ciclo de cuatro segundos y conserva el halo radial de 2,8 segundos. Movimiento reducido deja el arco estático junto al borde de contraste permanente.

## 9. Puerta de aprobación

No se generará el prompt correctivo de MOD009 hasta que:

1. las diez imágenes hayan sido generadas;
2. el propietario haya aprobado la dirección visual y el contenido de cada escena;
3. los archivos finales hayan sido normalizados y ubicados en las rutas previstas;
4. se haya confirmado que ninguna imagen contiene errores de texto, marcas externas o información impropia.

Los diez mockups aprobados quedaron normalizados a `1600×900 px` y registrados en [`docs/design/mockups/`](mockups/). Sus nombres y correspondencia por escena se encuentran en el [índice de diseño](README.md#carruseles-acme-aprobados). La conversión a WebP y su copia a las rutas públicas previstas quedaron integradas mediante la implementación correctiva de MOD009.

En la iteración 02 el propietario revisó y volvió a aprobar `acme-cafe-carousel-04-reservations-tables-v2.png` y `acme-cafe-carousel-05-assisted-service-v2.png`. Se conservaron como fuentes inmutables y se regeneraron únicamente `acme-cafe/04-reservations-tables-v2.webp` y `acme-cafe/05-assisted-service-v2.webp`: 1600×900, sRGB, sin alfa, sin recorte ni deformación y dentro del objetivo de 150–300 KB. Los otros ocho PNG v2 y WebP no cambiaron.
