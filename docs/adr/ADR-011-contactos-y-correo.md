# ADR-011 — Formulario de contacto y correo

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

- Los contactos se validarán y guardarán en `platform.contacts` antes de intentar enviar una notificación.
- Mailpit será el transporte de correo local.
- Resend será el proveedor de producción, encapsulado detrás de `ContactNotifier`.
- El fallo del correo no perderá el contacto ni convertirá una persistencia exitosa en un error para el visitante.
- No se enviará respuesta automática en la primera versión.

## Campos

- nombre: obligatorio;
- correo: obligatorio;
- empresa: opcional;
- asunto o tipo de proyecto: opcional y categórico;
- mensaje: obligatorio y limitado;
- consentimiento de privacidad: obligatorio;
- teléfono: fuera del alcance inicial.

## Estados

`NEW`, `READ`, `RESPONDED`, `ARCHIVED` y `SPAM`.

## Controles

Honeypot, tiempo mínimo razonable de envío, rate limiting, límites de longitud, validación del correo y registro técnico del resultado. No se incorporará CAPTCHA inicialmente.

## Justificación

PostgreSQL será la fuente de verdad. El correo será una notificación auxiliar, no el único lugar donde existe una oportunidad comercial.
