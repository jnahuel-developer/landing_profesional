# ADR-012 — Privacidad, consentimiento y retención

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

- Se publicará `/privacidad` con responsable, finalidades, categorías de datos, destinatarios, retención y mecanismo de ejercicio de derechos.
- Las cookies estrictamente necesarias para sesión demo y administración no podrán rechazarse mientras se utilicen esas funciones.
- La analítica opcional permanecerá desactivada hasta recibir consentimiento explícito.
- El visitante podrá aceptar, rechazar o modificar posteriormente su preferencia.
- La preferencia se conservará 180 días y no se solicitará nuevamente mientras siga vigente, salvo cambio material de finalidad.
- Rechazar analítica no limitará el contenido ni las demos.

## Retención

| Información | Retención |
|---|---:|
| Sesiones y datos de demo | una hora de uso; limpieza diaria posterior |
| Eventos analíticos crudos | 180 días |
| Resúmenes analíticos de sesión | 24 meses |
| Agregados diarios anonimizados | mientras sean útiles |
| Contactos | 24 meses desde la última interacción |
| Sesiones administrativas | 8 horas |
| Auditoría administrativa | 180 días |
| Logs técnicos ordinarios | 30 días |

Una solicitud válida de supresión tendrá prioridad sobre la retención prevista cuando corresponda. La redacción legal definitiva deberá revisarse antes de producción, sin alterar estas decisiones técnicas.
