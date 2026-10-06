# ADR-010 — Panel y acceso administrativo

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

- El panel se ubicará en `/admin` y no será indexable.
- Existirá una única cuenta administrativa local durante la primera versión.
- La contraseña se almacenará mediante Argon2id.
- No habrá registro público, recuperación automática de contraseña ni proveedores OAuth.
- La sesión durará como máximo ocho horas y utilizará cookie `HttpOnly`, `Secure` y `SameSite=Strict`.
- Se limitarán los intentos de acceso y se registrarán accesos exitosos, fallidos y cierres de sesión sin conservar la contraseña ni datos sensibles.

## Secciones

- Resumen;
- Adquisición;
- Demos;
- Conversión;
- Contactos;
- Estado.

## Gestión de cuenta

La cuenta inicial se creará mediante un comando administrativo local que reciba el usuario y solicite la contraseña de forma interactiva. Cambiar o recuperar la contraseña requerirá ejecutar otro comando administrativo con acceso al servidor.

## Justificación

Una única cuenta satisface la necesidad real sin introducir un sistema de identidad, roles o proveedores externos.
