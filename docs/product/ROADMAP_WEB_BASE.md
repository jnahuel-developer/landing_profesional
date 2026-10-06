# Roadmap de implementación de la web base

**Proyecto:** Web profesional y portfolio interactivo de Nahuel Martínez  
**Versión:** 1.0  
**Estado:** Aprobado para planificación de mods  
**Fecha:** 2026-10-06  
**Alcance:** Desde el bootstrap inicial hasta la web base preparada para incorporar ACME Café y ACME Logística  

---

## 1. Propósito

Este documento define el orden de implementación de la plataforma general. Organiza el trabajo en bloques verificables y establece qué grupos de mods, funcionalidades y pruebas deberán completarse antes de avanzar.

El roadmap no implementa todavía las funciones internas de ACME Café ni ACME Logística. Al finalizar, la web comercial, los servicios comunes, el panel administrativo y el marco del laboratorio deberán estar listos para recibir ambos dominios.

---

## 2. Punto de partida

El repositorio parte del siguiente estado:

- monorepositorio pnpm inicializado;
- nueve workspaces registrados;
- estructura de `apps/`, `packages/`, `domains/`, `tests/` e `infrastructure/`;
- documentación formal, ADR y mockups incorporados;
- PostgreSQL y Mailpit definidos en Docker Compose;
- configuración raíz de TypeScript, ESLint, Prettier y CI;
- `pnpm-lock.yaml` generado y validado;
- aplicaciones Next.js y Fastify aún no implementadas;
- Node.js 24 LTS pendiente de instalación en la máquina de desarrollo.

Actualizar Node.js a la versión 24 LTS es un prerrequisito para comenzar `mod001`, no una mod del producto.

---

## 3. Estrategia de ramas

### 3.1. Ramas permanentes

- `main`: versión estable de producción. Solo recibe cambios mediante MR desde `develop`.
- `develop`: versión integrada y estable de desarrollo. Solo recibe cambios mediante MR desde una rama `modxxx`.

Como operación inicial única, `develop` se creará desde el `main` actual antes de iniciar `mod001`.

### 3.2. Ramas de modificación

- Cada mod utilizará una rama denominada `modxxx`.
- Toda `modxxx` partirá del último estado válido de `develop`.
- Una mod contendrá un objetivo cohesivo y verificable.
- La integración se realizará mediante MR hacia `develop`.
- Una mod no aprobada no se utilizará como base de otra mod, salvo decisión explícita por dependencia técnica.
- El MR deberá completar los controles automáticos y los criterios de aceptación definidos para la mod.

### 3.3. Promoción a `main`

No se promoverán bloques parciales a `main` durante este roadmap. Al cerrar el Bloque 6 se abrirá el MR final `develop → main`. La versión resultante se etiquetará como `v0.1.0`.

### 3.4. Validación visual

Las instancias Codex no realizarán pruebas visuales, comparación de screenshots ni regresión contra mockups. Podrán ejecutar pruebas funcionales de interfaz, accesibilidad y rendimiento. La revisión estética y la aceptación visual de cada mod corresponden al propietario del proyecto y se realizan antes de autorizar su integración.

---

## 4. Resumen del roadmap

El detalle implementable de cada rama se encuentra en [`mods/`](mods/README.md).

| Bloque | Objetivo | Mods | Estado final |
|---|---|---|---|
| 1 | Fundación ejecutable | `mod001`–`mod003` | Web, API, base y CI funcionando |
| 2 | Sistema visual y shell global | `mod004`–`mod006` | Experiencia visual, navegación e i18n comunes |
| 3 | Web comercial completa | `mod007`–`mod009` | Portfolio público terminado |
| 4 | Datos permanentes y panel interno | `mod010`–`mod013` | Contactos, analítica y administración operativos |
| 5 | Plataforma base del laboratorio | `mod014`–`mod016` | Sesiones y marco común de demos listos |
| 6 | Consolidación de la web base | `mod017`–`mod019` | Versión candidata a `v0.1.0` |

---

## 5. Bloque 1 — Fundación ejecutable

### Inicio

Monorepositorio estructural sin aplicaciones implementadas.

### Mods previstas

- `mod001`: runtime, workspaces y aplicaciones mínimas.
- `mod002`: Fastify, PostgreSQL, Drizzle y migración inicial.
- `mod003`: infraestructura de pruebas y CI real.

### Funcionalidades esperadas

- aplicación Next.js disponible en `http://localhost:3000`;
- API Fastify disponible en `http://localhost:4000/api/v1`;
- endpoints `/health/live` y `/health/ready`;
- conexión de la API con PostgreSQL;
- esquemas `platform`, `demo_core`, `acme_cafe` y `acme_logistica` creados mediante migración;
- PostgreSQL y Mailpit ejecutados con Docker Compose;
- configuración de entorno validada al iniciar;
- OpenAPI mínimo para healthchecks;
- comandos raíz de desarrollo, build y pruebas operativos.

### Pruebas y controles

- instalación con lockfile congelado;
- formato, lint y typecheck;
- build de web y API;
- pruebas unitarias mínimas;
- prueba de integración API–PostgreSQL;
- smoke test Playwright de web y healthcheck;
- pipeline CI completamente verde.

### Fin

El proyecto puede instalarse desde un checkout limpio, levantar sus servicios locales y ejecutar web, API, migraciones y pruebas sin pasos manuales no documentados.

---

## 6. Bloque 2 — Sistema visual y shell global

### Inicio

Aplicaciones técnicas funcionales sin experiencia visual definitiva.

### Mods previstas

- `mod004`: tokens, tipografía, temas y componentes base.
- `mod005`: layout, cabecera, navegación y pie global.
- `mod006`: internacionalización, preferencias y accesibilidad base.

### Funcionalidades esperadas

- identidad visual aprobada aplicada mediante tokens;
- componentes fundamentales en `packages/ui`;
- estructura desktop-first orientada a landscape;
- contingencia responsive para pantallas menores;
- navegación global y estado de sección activa;
- temas y densidades aprobados;
- español como idioma predeterminado sin prefijo;
- inglés bajo `/en`;
- persistencia de idioma, tema y preferencias visuales;
- estados de foco, carga, error y contenido vacío reutilizables.

### Pruebas y controles

- pruebas unitarias de componentes;
- pruebas con Testing Library;
- navegación completa por teclado;
- análisis axe sin errores críticos;
- cambio de idioma y tema sin pérdida de contexto;
- verificaciones funcionales de layout en las resoluciones objetivo;
- contraste y reducción de movimiento.

### Fin

Existe un shell visual consistente y accesible sobre el cual pueden construirse todas las páginas públicas, el panel y el laboratorio sin redefinir patrones comunes.

---

## 7. Bloque 3 — Web comercial completa

### Inicio

Shell funcional con rutas provisionales o sin contenido final.

### Mods previstas

- `mod007`: inicio y posicionamiento profesional.
- `mod008`: soluciones, experiencia y metodología.
- `mod009`: sobre mí, contacto, privacidad y presentación del laboratorio.

### Funcionalidades esperadas

- página de inicio completa;
- posicionamiento **“Ingeniería de software para negocios”**;
- secciones de soluciones, experiencia, cómo trabajo y sobre mí;
- presentación de ACME Café y ACME Logística sin implementar sus dominios;
- formulario visual de contacto preparado para su integración;
- página de privacidad;
- llamados a la acción consistentes;
- títulos, descripciones, canonical, `hreflang`, sitemap y robots.txt;
- páginas de error y estados no encontrados;
- contenidos principales en español e inglés.

### Pruebas y controles

- navegación de todas las páginas públicas;
- enlaces internos y llamados a la acción;
- renderizado de ambos idiomas;
- metadatos y SEO técnico;
- accesibilidad de páginas públicas;
- smoke tests de recorridos comerciales;
- validación funcional de la estructura aprobada; la comparación visual será realizada por el propietario.

### Fin

El portfolio comunica la propuesta profesional completa y permite recorrer todo el contenido comercial, aunque el formulario aún no persista datos y las demos permanezcan sin implementar.

---

## 8. Bloque 4 — Datos permanentes y panel interno

### Inicio

Sitio comercial completo sin operación persistente para contactos, métricas o administración.

### Mods previstas

- `mod010`: formulario, persistencia y correo mediante Mailpit.
- `mod011`: consentimiento y analítica first-party.
- `mod012`: autenticación y sesión administrativa.
- `mod013`: panel `/admin`, contactos, métricas y estado.

### Funcionalidades esperadas

- recepción, validación y almacenamiento de contactos;
- notificación local mediante Mailpit;
- estados de contacto y acciones administrativas;
- consentimiento explícito y modificable;
- analítica propia sin texto libre ni datos funcionales de las demos;
- sesión administrativa mediante cookie segura;
- panel con Resumen, Adquisición, Demos, Conversión, Contactos y Estado;
- políticas de retención aprobadas;
- rate limiting en contacto y autenticación;
- registros funcionales y errores controlados.

### Pruebas y controles

- integración real con PostgreSQL y Mailpit;
- formulario válido, inválido, duplicado y limitado;
- consentimiento aceptado, rechazado y modificado;
- verificación de la taxonomía analítica;
- login, logout, credenciales incorrectas y expiración;
- protección de todas las rutas administrativas;
- ausencia de contenido sensible en eventos;
- pruebas de permisos y cookies.

### Fin

La plataforma puede recibir contactos, medir interacciones consentidas y presentar la información relevante en un panel administrativo protegido.

---

## 9. Bloque 5 — Plataforma base del laboratorio

### Inicio

El laboratorio está presentado comercialmente, pero aún no permite iniciar una experiencia interactiva.

### Mods previstas

- `mod014`: sesiones demo de una hora, reinicio y expiración.
- `mod015`: catálogo, lanzador y shell común del laboratorio.
- `mod016`: roles, escenarios, recorridos guiados y contrato de demos.

### Funcionalidades esperadas

- ruta `/lab` operativa;
- catálogo de ACME Café y ACME Logística;
- sesiones anónimas aisladas con duración fija de una hora;
- tiempo restante, reinicio y tratamiento de expiración;
- selección de empresa, rol, perspectiva y escenario;
- modo libre y recorrido guiado;
- navegación, ayuda y panel común de consecuencias;
- theming e i18n dentro del laboratorio;
- contratos de demo y catálogo de simulaciones validados;
- tarjetas de ambos dominios con estado **Próximamente**;
- comando de limpieza diaria de sesiones vencidas.

### Pruebas y controles

- aislamiento entre sesiones;
- persistencia durante recarga;
- expiración fija y rechazo de operaciones posteriores;
- reinicio sin afectar analítica permanente;
- selección y cambio de rol;
- validación de manifiestos de escenarios;
- limpieza limitada a datos descartables;
- accesibilidad del lanzador y shell;
- recorridos end-to-end básicos del laboratorio.

### Fin

El laboratorio posee toda la infraestructura común necesaria para incorporar ACME Café y ACME Logística sin modificar las bases de sesiones, navegación, roles, escenarios o métricas.

---

## 10. Bloque 6 — Consolidación de la web base

### Inicio

Todas las capacidades de la plataforma base están presentes, pero falta su endurecimiento y aceptación integral.

### Mods previstas

- `mod017`: observabilidad, logs y página de estado.
- `mod018`: accesibilidad, SEO y rendimiento final.
- `mod019`: suite end-to-end, correcciones y documentación operativa.

### Funcionalidades esperadas

- logging estructurado con correlación básica;
- healthchecks definitivos;
- manejo uniforme de errores;
- estado operativo visible en `/admin`;
- presupuestos de rendimiento aplicados;
- documentación de instalación y operación local actualizada;
- contratos y comandos verificados desde un entorno limpio;
- deuda crítica del roadmap resuelta;
- versión preparada para promoción a `main`.

### Pruebas y controles

- suite unitaria, de integración y end-to-end completa;
- Playwright sobre todos los recorridos críticos;
- axe sin errores críticos conocidos;
- verificación técnica de SEO;
- pruebas de sesiones, contactos, analítica y administración;
- build limpio desde un checkout nuevo;
- confirmación del propietario de que realizó la revisión visual contra los mockups aprobados;
- validación de logs y estados de error;
- comprobación de que no se implementaron integraciones externas reales.

### Fin

`develop` contiene una versión estable de la plataforma general. Se abre el MR `develop → main`, se ejecuta la aceptación final y se etiqueta el resultado como `v0.1.0`.

---

## 11. Criterios globales para cerrar un bloque

Un bloque se considerará cerrado únicamente cuando:

1. todas sus mods estén integradas en `develop`;
2. no existan MRs pendientes que cambien su alcance;
3. CI se encuentre verde;
4. se hayan ejecutado las pruebas indicadas;
5. no existan defectos críticos o bloqueantes conocidos;
6. la documentación afectada esté actualizada;
7. el estado de `develop` pueda instalarse y ejecutarse desde cero;
8. las funcionalidades del bloque anterior continúen operativas.

Los defectos menores diferidos deberán quedar registrados y asignados a una mod posterior concreta.

---

## 12. Fuera del alcance de este roadmap

- implementación funcional de ACME Café;
- implementación funcional de ACME Logística;
- aplicaciones móviles nativas;
- integraciones reales con proveedores;
- Caddy productivo;
- imágenes Docker de producción;
- publicación en GHCR;
- despliegue en VPS;
- backups productivos;
- automatización de promoción a producción.

Estas capacidades se abordarán después de cerrar `v0.1.0`. Las decisiones arquitectónicas ya documentadas continúan vigentes, pero no forman parte de esta fase.

---

## 13. Resultado esperado

Al completar el roadmap existirán:

- web comercial terminada en español e inglés;
- sistema visual y navegación definitivos;
- formulario de contacto operativo;
- analítica propia y consentimiento;
- panel administrativo protegido;
- sesiones demo anónimas y descartables;
- laboratorio con catálogo, roles y recorridos comunes;
- pruebas automatizadas y CI estable;
- base técnica preparada para comenzar ACME Café y, posteriormente, ACME Logística.

---

**Fin del documento.**
