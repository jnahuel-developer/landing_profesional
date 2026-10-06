# ADR-013 — Observabilidad y alertas

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

- Fastify utilizará Pino y emitirá logs JSON a stdout.
- Caddy emitirá access logs JSON.
- Docker rotará logs con `max-size: 10m` y `max-file: 5`.
- La API expondrá `/api/v1/health/live` y `/api/v1/health/ready`.
- El frontend expondrá una comprobación pública mínima de disponibilidad.
- UptimeRobot monitorizará la web y la API desde fuera del VPS cada cinco minutos y notificará por correo los estados DOWN y UP.
- El panel `/admin/status` mostrará salud, versión, tareas programadas y recursos básicos.

## Límites

No se desplegarán Prometheus, Grafana, Loki, OpenTelemetry, Sentry ni un agregador de logs en la primera versión. Los errores del frontend se enviarán categorizados al backend sin incluir contenido sensible.

## Justificación

Los logs estructurados, healthchecks y monitoreo externo cubren las necesidades reales de una aplicación en un único VPS. UptimeRobot puede detectar una caída total que un monitor alojado en el mismo servidor no podría reportar.
