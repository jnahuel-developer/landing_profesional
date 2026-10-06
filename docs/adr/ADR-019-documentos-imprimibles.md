# ADR-019 — Documentos HTML imprimibles

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

Los comprobantes de ACME Café y las pruebas de entrega de ACME Logística serán vistas HTML con estilos CSS específicos para impresión. La acción correspondiente abrirá el diálogo nativo del navegador mediante `window.print()`, desde el cual podrá elegirse una impresora o **Guardar como PDF**.

La primera versión no incorporará generación PDF en backend, Chromium headless, bibliotecas PDF, colas, almacenamiento de documentos ni archivos temporales.

## Reglas

- Todo documento llevará una marca visible de demostración y ausencia de validez legal o fiscal.
- Los datos se validarán antes de renderizarse y el contenido libre se escapará.
- La plantilla deberá funcionar en español, inglés y portugués cuando el flujo correspondiente esté localizado.
- Se comprobarán impresión A4, ausencia de controles interactivos y cortes de página razonables.

## Justificación

La impresión del navegador cubre el objetivo comercial con una implementación mínima, portable y sin carga operacional adicional. Un generador real solo se justificará si aparece un requisito posterior de descarga automática o composición documental avanzada.
