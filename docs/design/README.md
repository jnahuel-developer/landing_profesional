# Diseño

Los archivos de [`mockups/`](mockups/) son referencias visuales aprobadas para la plataforma y las demos. Representan dirección de arte, jerarquía y composición; no sustituyen criterios de accesibilidad, responsive design ni estados funcionales definidos en las especificaciones.

La home no deberá interpretarse como una sucesión de páginas o capturas estáticas. Su implementación seguirá ADR-020: una experiencia comercial continua, con cabecera persistente, secciones enlazables, revelado progresivo, escenas vinculadas al scroll y tarjetas interactivas. El desplazamiento permanecerá bajo control del visitante y toda animación tendrá una alternativa completa con movimiento reducido.

Como referencias de dinamismo se consideran [Cheetos](https://www.cheetos.com/) y [Hello Monday](https://www.hellomonday.com/). Estas referencias orientan ritmo, continuidad e interacción, pero no autorizan copiar su identidad, contenido, multimedia ni comportamiento de scroll.

## Referencias disponibles

- home pública en tema claro;
- ACME Café: laboratorio/POS, dashboard, inventario, reservas y asistente del cliente;
- ACME Logística: operación en vivo, planificación de rutas, flota/telemetría, incidentes y experiencia offline del chofer.

## Carruseles ACME aprobados

Las siguientes referencias `v2` corresponden a las escenas aprobadas para reemplazar las miniinterfaces provisionales de la sección Experiencia. Se conservan como PNG de diseño; la integración productiva utilizará las variantes WebP definidas en el contrato de activos.

### ACME Café

1. [`acme-cafe-carousel-01-operations-overview-v2.png`](mockups/acme-cafe-carousel-01-operations-overview-v2.png) — Resumen operativo.
2. [`acme-cafe-carousel-02-connected-sale-v2.png`](mockups/acme-cafe-carousel-02-connected-sale-v2.png) — Venta conectada.
3. [`acme-cafe-carousel-03-stock-replenishment-v2.png`](mockups/acme-cafe-carousel-03-stock-replenishment-v2.png) — Stock y reposición.
4. [`acme-cafe-carousel-04-reservations-tables-v2.png`](mockups/acme-cafe-carousel-04-reservations-tables-v2.png) — Reservas y mesas.
5. [`acme-cafe-carousel-05-assisted-service-v2.png`](mockups/acme-cafe-carousel-05-assisted-service-v2.png) — Atención asistida.

### ACME Logística

1. [`acme-logistica-carousel-01-control-center-v2.png`](mockups/acme-logistica-carousel-01-control-center-v2.png) — Central operativa.
2. [`acme-logistica-carousel-02-route-planning-v2.png`](mockups/acme-logistica-carousel-02-route-planning-v2.png) — Planificación de rutas.
3. [`acme-logistica-carousel-03-fleet-telemetry-v2.png`](mockups/acme-logistica-carousel-03-fleet-telemetry-v2.png) — Flota y telemetría.
4. [`acme-logistica-carousel-04-coordinated-incident-v2.png`](mockups/acme-logistica-carousel-04-coordinated-incident-v2.png) — Incidente coordinado.
5. [`acme-logistica-carousel-05-driver-app-v2.png`](mockups/acme-logistica-carousel-05-driver-app-v2.png) — Aplicación del chofer.

## Contratos de activos

- [Imágenes de los carruseles ACME](ACME_CAROUSELES_IMAGENES.md): dimensiones, escenas, nombres de archivo y reglas de integración para las diez imágenes estáticas de Experiencia.
