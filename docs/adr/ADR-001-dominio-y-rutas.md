# ADR-001 — Dominio y rutas públicas

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## Decisión

- `https://www.nahuelmartinez.com.ar` será el dominio canónico.
- `https://nahuelmartinez.com.ar` redirigirá permanentemente a `www`.
- El laboratorio utilizará `/lab`.
- El panel privado utilizará `/admin`.
- La API pública se expondrá bajo `/api/v1` mediante el reverse proxy cuando se despliegue.
- Español será el idioma predeterminado sin prefijo; inglés utilizará `/en`. Portugués podrá agregarse posteriormente.

## Justificación

Una única procedencia simplifica sesiones, cookies, CORS, navegación, analítica y despliegue. Un subdominio para el laboratorio no aporta aislamiento necesario en esta etapa.

## Consecuencias

Las rutas base deberán centralizarse en configuración para permitir una separación futura. Las rutas de sesiones demo y `/admin` no serán indexables.
