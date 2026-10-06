# Operación, contenedores y despliegue futuro

**Proyecto:** Web personal y laboratorio interactivo  
**Versión:** 1.0  
**Estado:** Aprobado  
**Fecha:** 2026-10-05  

---

## 1. Principio operativo

El proyecto se desarrollará y validará localmente. La infraestructura productiva se preparará desde el código, pero no se contratará ni desplegará un VPS hasta que el sitio institucional y la plataforma base alcancen un estado maduro.

La topología productiva será un único VPS con Docker Compose. No se utilizarán Kubernetes, Docker Swarm, bases administradas, storage externo ni servicios distribuidos.

---

## 2. Entornos

### 2.1. Local

- web y API ejecutadas en el host;
- PostgreSQL y Mailpit mediante `compose.dev.yaml`;
- datos descartables;
- correo capturado localmente.

### 2.2. CI

- runner efímero de GitHub Actions;
- PostgreSQL de servicio;
- build completo;
- pruebas sin acceso a secretos productivos;
- construcción de imágenes sin despliegue.

### 2.3. Validación de release

Antes del VPS, cada candidato se probará localmente mediante las imágenes productivas y `compose.release.yaml`. Esto sustituye un staging remoto permanente durante la primera etapa.

### 2.4. Producción

- VPS único;
- imágenes obtenidas desde GHCR;
- configuración y secretos únicamente en el servidor;
- datos persistentes en volúmenes;
- despliegue iniciado manualmente.

---

## 3. Topología productiva

```text
Internet
   │
   ▼
Caddy :80/:443
   ├── /api/* ──► api:4000
   └── /*     ──► web:3000

Red interna Docker
   ├── web
   ├── api
   └── postgres

Volúmenes
   ├── postgres-data
   ├── caddy-data
   ├── caddy-config
   └── /srv/nahuelmartinez/backups/platform
```

Solo Caddy tendrá puertos públicos.

---

## 4. Imágenes

### 4.1. Web

- build multi-stage;
- Next.js standalone;
- usuario no root;
- healthcheck HTTP;
- configuración pública inyectada de forma controlada;
- sin secretos dentro de la imagen.

### 4.2. API

- build multi-stage;
- código compilado;
- usuario no root;
- healthchecks;
- comandos de servidor y mantenimiento;
- sin herramientas de desarrollo en la imagen final.

Comandos previstos:

```text
api server
api db:migrate
api db:seed
api maintenance:cleanup
api maintenance:aggregate-analytics
api maintenance:backup-platform
```

### 4.3. Imágenes externas

Caddy y PostgreSQL usarán imágenes oficiales. En producción se fijarán por versión y digest para evitar actualizaciones implícitas.

---

## 5. Integración continua

### 5.1. Pull requests

```text
install --frozen-lockfile
lint
typecheck
unit tests
integration tests
build web
build api
validate migrations
Playwright smoke tests
Docker build
```

La rama `main` requerirá que estas verificaciones sean satisfactorias.

### 5.2. Imágenes

Después de integrar en `main`, GitHub Actions podrá publicar:

```text
ghcr.io/<propietario>/<repositorio>/web:<commit-sha>
ghcr.io/<propietario>/<repositorio>/api:<commit-sha>
```

Las etiquetas de SHA serán la referencia de despliegue. `latest` no se utilizará para producción.

---

## 6. Despliegue

El workflow productivo será manual y recibirá un SHA validado.

### 6.1. Secuencia

1. comprobar CI del SHA;
2. generar respaldo de `platform`;
3. guardar el SHA actualmente desplegado;
4. autenticar el VPS contra GHCR;
5. descargar las imágenes exactas;
6. ejecutar migraciones una sola vez;
7. recrear API y web;
8. comprobar healthchecks;
9. ejecutar smoke tests públicos;
10. registrar versión y resultado.

### 6.2. Migraciones

- deberán ser compatibles con la versión anterior durante el reemplazo;
- no se aplicarán cambios destructivos sin backup de `platform`;
- los esquemas de demo podrán reconstruirse;
- una migración fallida detendrá el despliegue antes de reemplazar servicios sanos.

### 6.3. Rollback

Si falla un smoke test:

1. restablecer las etiquetas SHA anteriores en el archivo de entorno;
2. recrear web y API;
3. verificar healthchecks;
4. no revertir automáticamente migraciones;
5. corregir mediante migración posterior si el esquema cambió.

---

## 7. Caddy

Configuración conceptual:

```text
nahuelmartinez.com.ar
  → redirección permanente a www.nahuelmartinez.com.ar

www.nahuelmartinez.com.ar
  /api/* → api:4000
  /*     → web:3000
```

Caddy gestionará:

- certificados y renovación;
- redirección HTTP a HTTPS;
- dominio canónico;
- compresión;
- cabeceras de seguridad;
- límites generales de tamaño;
- proxy hacia servicios internos;
- access logs JSON.

El rate limiting funcional seguirá perteneciendo a la API.

---

## 8. Observabilidad

### 8.1. Logs

Campos mínimos:

```text
timestamp
level
service
environment
version
requestId
route
statusCode
durationMs
errorCode
```

No se registrarán contraseñas, cookies, tokens, mensajes de contacto, firmas ni datos funcionales completos.

### 8.2. Healthchecks

**Liveness:** confirma que el proceso responde.  
**Readiness:** confirma configuración, acceso a PostgreSQL y capacidad de recibir tráfico.

La readiness no consultará servicios externos opcionales.

### 8.3. Monitoreo externo

UptimeRobot comprobará:

- página principal;
- readiness pública reducida de la API;
- certificado y disponibilidad del dominio.

Canal inicial: correo electrónico. Se probarán manualmente alertas DOWN y UP antes del lanzamiento.

### 8.4. Estado interno

`/admin/status` mostrará:

- versión desplegada;
- uptime de procesos;
- estado de PostgreSQL;
- uso básico de disco, memoria y conexiones;
- última limpieza;
- última agregación analítica;
- último backup;
- errores recientes agrupados.

---

## 9. Tareas programadas

Un timer del host ejecutará comandos de una sola ejecución. Los horarios se interpretarán en `America/Argentina/Buenos_Aires`, aunque los logs y timestamps persistidos se mantendrán en UTC:

| Horario | Tarea |
|---|---|
| 03:00 | limpieza de sesiones y datos demo vencidos |
| 03:15 | agregación analítica diaria |
| 03:30 | backup del esquema `platform` |
| 03:45 | comprobación de espacio y resultado de tareas |

No existirá un worker permanentemente activo. Un fallo se registrará y notificará por correo mediante el mecanismo operativo.

---

## 10. Backup local

Comando conceptual:

```text
pg_dump --format=custom --schema=platform
```

Destino:

```text
/srv/nahuelmartinez/backups/platform/
```

Nombre:

```text
platform_YYYY-MM-DD_HH-mm_<schema-version>.dump
```

Política:

- una copia diaria;
- catorce copias rotativas;
- checksum SHA-256;
- permisos restrictivos;
- descarga manual por SFTP;
- sin copia externa automática.

Antes del lanzamiento se verificará una restauración en una base temporal.

---

## 11. VPS y escalado

### 11.1. Capacidad inicial

```text
Ubuntu Server 24.04 LTS
2 vCPU
4 GB RAM
80 GB NVMe
2 GB swap
x86_64
```

### 11.2. Umbrales

Se aumentará a 4 vCPU y 8 GB cuando exista presión sostenida de CPU o memoria, el disco supere 75 %, la API incumpla sus objetivos de latencia o las pruebas no soporten cincuenta sesiones simultáneas.

Se limpiarán datos y logs antes de ampliar disco cuando el crecimiento sea evitable. No se diseñará escalado horizontal hasta que el escalado vertical resulte insuficiente.

---

## 12. Activación diferida

Durante el desarrollo local se implementarán:

- Dockerfiles;
- healthchecks;
- Compose de release;
- CI;
- logs estructurados;
- comandos de mantenimiento.

Quedarán sin activar hasta disponer del VPS:

- Caddy público;
- GHCR como fuente de despliegue;
- workflow productivo;
- UptimeRobot;
- timers del host;
- backup diario;
- alertas operativas.

---

## 13. Criterios de aceptación

- [ ] CI valida código, pruebas, migraciones, builds e imágenes.
- [ ] Las imágenes web y API ejecutan como usuario no root.
- [ ] Un Compose de release puede levantar la plataforma completa localmente.
- [ ] Solo Caddy publica puertos en producción.
- [ ] El dominio raíz redirige a `www`.
- [ ] TLS se provisiona y renueva automáticamente.
- [ ] Los healthchecks distinguen vida y disponibilidad.
- [ ] UptimeRobot detecta una caída y una recuperación de prueba.
- [ ] Los logs tienen rotación y no contienen secretos.
- [ ] El despliegue utiliza imágenes identificadas por SHA.
- [ ] El workflow productivo requiere ejecución manual.
- [ ] Puede volver a ejecutarse la versión anterior de web y API.
- [ ] El backup contiene únicamente el esquema `platform`.
- [ ] Se conservan catorce backups y se genera checksum.
- [ ] Una restauración de prueba finaliza correctamente.
- [ ] Los datos de demo no forman parte del backup.
- [ ] El panel interno muestra versión, tareas y salud.

---

**Fin del documento.**
