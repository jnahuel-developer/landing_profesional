# ADR-016 — VPS, Caddy y escalado

**Estado:** Aceptada  
**Fecha:** 2026-10-05

## VPS inicial

- Ubuntu Server 24.04 LTS;
- arquitectura x86_64;
- 2 vCPU;
- 4 GB de RAM;
- 80 GB NVMe;
- 2 GB de swap;
- Docker Engine y plugin Docker Compose.

## Caddy

- puertos públicos 80 y 443;
- TLS y renovación automática;
- redirección de `nahuelmartinez.com.ar` a `www.nahuelmartinez.com.ar`;
- reverse proxy de `/api/*` hacia API y del resto hacia web;
- compresión zstd/gzip;
- cabeceras de seguridad;
- logs JSON con rotación;
- página simple de mantenimiento cuando sea necesaria.

## Escalado

El primer escalado será vertical a 4 vCPU y 8 GB de RAM cuando ocurra de forma sostenida alguna de estas condiciones:

- CPU mayor a 70 % durante quince minutos en períodos normales;
- memoria mayor a 80 %;
- disco mayor a 75 %;
- latencia p95 de lecturas comunes mayor a 500 ms;
- errores 5xx mayores a 1 % durante cinco minutos;
- pruebas de carga que incumplan el objetivo de cincuenta sesiones simultáneas.

No se planifica balanceo horizontal en la primera versión.
