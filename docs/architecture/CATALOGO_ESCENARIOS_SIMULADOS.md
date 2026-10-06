# Catálogo de escenarios simulados

**Proyecto:** Web personal y laboratorio interactivo  
**Versión del catálogo:** 1.0.0  
**Estado:** Aprobado  
**Fecha:** 2026-10-05  
**Ámbito:** ACME Café y ACME Logística  

---

## 1. Propósito

Este documento define las simulaciones que se implementarán en las demostraciones, su prioridad y el contrato común para ejecutarlas. El objetivo es reproducir flujos empresariales creíbles, con estados y errores observables, sin depender de servicios externos ni construir infraestructura que no aporte valor a la exhibición.

Las simulaciones son parte del producto demostrativo. No constituyen mocks improvisados: deberán ser coherentes con el estado de la sesión, producir consecuencias en los módulos relacionados y poder repetirse en pruebas automatizadas.

---

## 2. Alcance y exclusiones

El catálogo cubre:

- pagos y facturación ficticia de ACME Café;
- motor conversacional de ACME Café;
- rutas, telemetría, conectividad y prueba de entrega de ACME Logística;
- fotografías estáticas y documentos imprimibles;
- criterios de versionado, determinismo, pruebas y aceptación.

Quedan excluidos:

- conexiones reales con ARCA o procesadores de pago;
- Google Maps, Waze o geocodificación remota;
- modelos externos de inteligencia artificial;
- GPS, dispositivos IoT, push, SMS o mensajería reales;
- cámara, carga de archivos y almacenamiento externo;
- generación de PDF en backend;
- Service Worker, PWA y replicación distribuida.

---

## 3. Prioridades

| Prioridad | Definición | Compromiso |
|---|---|---|
| P0 | Recorrido principal y evidencia mínima del producto | Obligatoria para publicar cada demo |
| P1 | Recuperación de errores y profundidad operativa | Obligatoria para considerar completa la primera versión |
| P2 | Variantes adicionales y exhibición avanzada | Posterior a P0 y P1; no bloquea la primera publicación |

Un escenario P0 deberá funcionar de extremo a extremo antes de implementar variantes P1 del mismo módulo.

---

## 4. Contrato común

Cada escenario deberá declarar:

```text
id              identificador estable
version         versión semántica del escenario
domain          acme_cafe | acme_logistica
category        pago | fiscal | conversación | ruta | telemetría | offline | documento
priority        P0 | P1 | P2
titleKey        clave localizada del nombre visible
initialState    referencia al estado semilla
steps           hitos ordenados del recorrido
outcomes        respuestas y consecuencias esperadas
latencyProfile  instant | short | delayed
fixtures        datos requeridos
assertions      invariantes verificables
```

Los contratos y fixtures se validarán con TypeBox al cargar el catálogo. Un escenario inválido impedirá iniciar la demo en desarrollo y fallará el pipeline de integración continua.

### 4.1. Identificadores y versiones

- Los identificadores no se reutilizarán con otro significado.
- Un cambio de redacción o presentación incrementará la versión patch.
- Un cambio compatible de datos o pasos incrementará minor.
- Un cambio incompatible de reglas o resultado incrementará major.
- Las métricas registrarán `scenarioId` y major version, nunca el contenido libre del visitante.

### 4.2. Determinismo

- Los recorridos guiados declararán explícitamente el escenario y resultado.
- La exploración libre permitirá elegir un caso desde controles de demostración cuando resulte útil.
- Si no existe elección, se obtendrá una secuencia estable desde `sessionId`, `scenarioId` y versión.
- No se utilizará `Math.random()` sin una semilla controlada.
- Las pruebas podrán eliminar las demoras simuladas.

### 4.3. Latencias visuales

Las demoras comunicarán etapas, no intentarán imitar tiempos reales:

- `instant`: 0–150 ms;
- `short`: 350–900 ms;
- `delayed`: 1.200–2.500 ms.

No se bloqueará la interfaz. Los recorridos permitirán reducir movimiento y las pruebas usarán reloj controlado.

---

## 5. Arquitectura de simulación

Se implementará un paquete compartido `packages/simulation-catalog` con esquemas, manifiestos y fixtures versionados. La API resolverá los casos mediante interfaces internas:

```text
PaymentProvider
FiscalProvider
ConversationEngine
RoutingProvider
TelemetryScenario
OfflineSyncPolicy
```

La configuración inicial solo registrará implementaciones `Simulated*`. Ninguna contendrá credenciales o clientes HTTP de proveedores externos.

La interfaz de usuario no leerá fixtures directamente. Solicitará una operación de dominio y recibirá un resultado validado. De esta manera, una venta, reserva o entrega conservará reglas reales dentro de la demo aunque el proveedor sea simulado.

Ubicaciones sugeridas:

```text
packages/simulation-catalog/
├── src/contracts/
├── src/acme-cafe/
├── src/acme-logistica/
└── test/

apps/web/public/demo/acme-logistica/proof/
├── reception-ok.webp
├── goods-counter.webp
├── damaged-package.webp
└── access-closed.webp
```

---

## 6. ACME Café

### 6.1. Pagos

| ID | Prioridad | Caso | Consecuencia principal |
|---|---:|---|---|
| `CAF-PAY-001` | P0 | Tarjeta aprobada | Confirma pago, venta, stock y comprobante |
| `CAF-PAY-002` | P0 | Fondos insuficientes | Conserva la venta y permite cambiar el medio |
| `CAF-PAY-003` | P1 | Terminal demorada | Muestra estado pendiente y termina sin doble cobro |
| `CAF-PAY-004` | P1 | Terminal desconectada | Permite reintentar o cobrar en efectivo |
| `CAF-PAY-005` | P1 | Operación duplicada | Reconoce la clave idempotente y no aplica dos pagos |
| `CAF-PAY-006` | P2 | QR vencido | Regenera el intento sin duplicar la venta |

El recorrido guiado utilizará `CAF-PAY-001`. El escenario de recuperación principal combinará `CAF-PAY-002` con un segundo intento aprobado.

### 6.2. Facturación ficticia

| ID | Prioridad | Caso | Consecuencia principal |
|---|---:|---|---|
| `CAF-FISC-001` | P0 | Emisión aprobada | Asigna número y autorización ficticios |
| `CAF-FISC-002` | P0 | Datos del cliente incompletos | Solicita completar datos sin perder la venta |
| `CAF-FISC-003` | P1 | Servicio no disponible | Mantiene venta pagada y habilita reintento |
| `CAF-FISC-004` | P1 | Reintento exitoso | Emite luego del caso no disponible |
| `CAF-FISC-005` | P1 | Comprobante ya emitido | Devuelve el existente sin duplicarlo |

Los datos se etiquetarán como ficticios. No se copiarán algoritmos, firmas, códigos ni respuestas oficiales de ARCA. El comprobante tendrá una vista HTML imprimible con la leyenda **“DOCUMENTO DE DEMOSTRACIÓN – SIN VALIDEZ FISCAL”**.

### 6.3. Motor conversacional

El motor será determinista y resolverá intenciones mediante normalización, diccionarios localizados, patrones y extracción de entidades. Las acciones se ejecutarán mediante los servicios internos de catálogo, stock, reservas y pedidos.

| ID | Prioridad | Intención o flujo | Resultado |
|---|---:|---|---|
| `CAF-CONV-001` | P0 | Consultar producto y stock | Respuesta coherente con sucursal y sesión |
| `CAF-CONV-002` | P0 | Buscar alternativa | Propone productos o sucursales con disponibilidad |
| `CAF-CONV-003` | P0 | Crear reserva | Confirma datos y crea una reserva visible |
| `CAF-CONV-004` | P0 | Consultar pedido | Informa el estado real del pedido de sesión |
| `CAF-CONV-005` | P1 | Consultar horarios | Responde desde configuración ficticia localizada |
| `CAF-CONV-006` | P1 | Recomendar producto | Filtra el catálogo por preferencias controladas |
| `CAF-CONV-007` | P1 | Faltan datos | Solicita una aclaración concreta |
| `CAF-CONV-008` | P1 | Fuera de alcance | Explica los límites y ofrece ejemplos válidos |

Reglas:

- Las respuestas deberán coincidir con los módulos visuales.
- Toda mutación solicitará confirmación cuando tenga efectos visibles.
- No se enviarán mensajes a una API externa ni se afirmará usar IA generativa.
- Se conservará el historial solo durante la sesión.
- La analítica registrará intención y resultado categóricos, nunca el texto escrito.

---

## 7. ACME Logística

### 7.1. Rutas precalculadas

| ID | Prioridad | Área y caso | Capacidades visibles |
|---|---:|---|---|
| `LOG-RTE-001` | P0 | CABA Centro, distribución normal | Inicio, progreso, geofence y entrega exitosa |
| `LOG-RTE-002` | P0 | Corredor Norte, congestión | Comparación de tres alternativas y nueva ETA |
| `LOG-RTE-003` | P1 | Zona Oeste, incidente mecánico | Alerta, detención y reasignación controlada |
| `LOG-RTE-004` | P1 | Zona Sur, entrega fallida | Evidencia local, motivo y reprogramación |
| `LOG-RTE-005` | P1 | AMBA Norte, cadena de frío | Temperatura fuera de rango y acción correctiva |
| `LOG-RTE-006` | P0 | Barracas–Palermo, red inestable | Operación offline, reconexión y conflicto |

Cada ruta tendrá:

- polilínea principal y, cuando corresponda, alternativas;
- entre 6 y 12 paradas;
- distancias y duraciones coherentes entre sí;
- keyframes de posición y eventos;
- ventana horaria, ETA y datos de unidad;
- perfiles visuales **Google Maps · simulación**, **Waze · simulación** y **Motor ACME · simulación**.

Los perfiles podrán ordenar o describir las alternativas de forma diferente, pero siempre utilizarán los mismos datos internos. No se solicitarán mapas, tráfico ni rutas por red.

### 7.2. Movimiento y telemetría

La posición se interpolará en el navegador desde la polilínea y el reloj de simulación. La actualización visual se producirá cada dos a cinco segundos sin crear una fila de base de datos por muestra.

Los keyframes definirán valores plausibles de:

- velocidad;
- rumbo;
- ignición;
- combustible o batería;
- temperatura de motor;
- temperatura de carga cuando aplique;
- conexión;
- estado de chofer y vehículo.

Solo se persistirán hitos: salida, llegada a geofence, detención, alerta, reconocimiento, reanudación y entrega. Pausar la demo congelará reloj, posición y telemetría.

### 7.3. Offline y sincronización

`LOG-RTE-006` utilizará un selector manual de red: 4G, 3G, inestable y sin conexión. No se inspeccionará ni interrumpirá la conexión real del navegador.

Durante el modo offline:

- la ruta y las entregas precargadas seguirán disponibles;
- las mutaciones se guardarán en una cola de `localStorage` aislada por `sessionId`;
- cada operación tendrá `clientOperationId`, orden y timestamp simulado;
- la central mostrará el último estado confirmado;
- no se ejecutarán reintentos en segundo plano.

Al reconectar, el navegador enviará la cola completa a un endpoint de sincronización. La API aplicará operaciones idempotentes en orden y devolverá resultados individuales.

El conflicto preparado será: la central reprograma una entrega mientras el teléfono offline la marca como completada. La interfaz mostrará ambas versiones y permitirá **conservar entrega completada** o **aceptar reprogramación**. La resolución quedará registrada como hito temporal de la sesión.

No se implementarán Service Worker, PWA, base de datos móvil, WebSocket ni un algoritmo general de resolución de conflictos.

### 7.4. Fotografías y firma

La prueba de entrega ofrecerá exactamente cuatro fotografías WebP optimizadas y alojadas con la aplicación:

1. recepción correcta;
2. mercadería sobre mostrador;
3. embalaje con observación;
4. acceso cerrado.

No existirá cámara ni selector de archivos. La sesión guardará únicamente el identificador del activo elegido.

La firma se capturará como una lista limitada de trazos vectoriales normalizados. No se almacenará como imagen ni tendrá validez jurídica. Una alternativa accesible permitirá seleccionar **“Recepción confirmada sin firma manuscrita”** y registrar el motivo ficticio.

### 7.5. Documento de prueba de entrega

La prueba de entrega será una vista HTML imprimible con datos de entrega, unidad, receptor ficticio, bultos, ubicación simulada, fotografía seleccionada y firma o alternativa accesible. Llevará la marca **“DOCUMENTO DE DEMOSTRACIÓN – SIN VALIDEZ LEGAL”**.

El navegador permitirá imprimirla o guardarla como PDF. El backend no producirá ni almacenará archivos.

---

## 8. Estrategia de implementación

### Fase A — Contratos comunes

- tipos y validación del manifiesto;
- registro de adaptadores simulados;
- selección determinista;
- reloj controlable;
- soporte de traducciones;
- herramientas de prueba.

### Fase B — ACME Café P0

- pago aprobado y rechazo recuperable;
- emisión aprobada y validación incompleta;
- consulta de stock, alternativa, reserva y pedido;
- comprobante imprimible.

### Fase C — ACME Logística P0

- rutas 001, 002 y 006;
- interpolación, hitos y telemetría;
- cola offline y conflicto;
- prueba de entrega imprimible.

### Fase D — Profundidad P1

- errores adicionales de pago y facturación;
- conversación aclaratoria y fallback;
- rutas 003, 004 y 005;
- fotografías, firma y alertas especializadas.

### Fase E — Variantes P2

- QR vencido;
- variantes visuales o narrativas que aporten valor después de validar el uso real.

---

## 9. Pruebas

### 9.1. Unitarias

- validación de manifiestos;
- selección determinista;
- transiciones e invariantes;
- resolución de intenciones y entidades;
- interpolación de keyframes;
- idempotencia de pagos y sincronización offline.

### 9.2. Integración

- consecuencias cruzadas entre módulos;
- persistencia durante la hora de sesión;
- aislamiento entre sesiones;
- aplicación ordenada de la cola offline;
- reconstrucción desde semillas.

### 9.3. End-to-end

- un recorrido P0 completo por demo;
- un error recuperable por integración;
- coherencia entre central y teléfono;
- impresión A4 de comprobante y prueba de entrega;
- navegación por teclado y alternativa accesible de firma.

No se realizarán pruebas contra proveedores externos.

---

## 10. Analítica

Se admitirán los siguientes datos categóricos:

- dominio;
- `scenarioId` y major version;
- escenario iniciado, completado, abandonado o reiniciado;
- resultado categórico;
- duración aproximada;
- rol o perspectiva;
- impresión solicitada;
- resolución de conflicto seleccionada.

No se conservarán mensajes, observaciones, nombres ficticios ingresados, trazos de firma, fotografías, identificadores de entrega ni estado funcional de la demo en la analítica permanente.

---

## 11. Criterios de aceptación

- [ ] Todos los escenarios P0 tienen manifiesto válido y pruebas automatizadas.
- [ ] Ningún adaptador de la primera versión realiza conexiones a proveedores externos.
- [ ] Repetir una sesión con la misma semilla produce la misma secuencia.
- [ ] Las consecuencias se reflejan en todos los módulos relacionados.
- [ ] Los fallos P0 y P1 permiten una recuperación comprensible.
- [ ] Las rutas y telemetría permanecen coherentes al pausar, reanudar o acelerar el reloj.
- [ ] La cola offline aplica operaciones una sola vez y permite resolver el conflicto preparado.
- [ ] Solo se utilizan las cuatro fotografías locales aprobadas.
- [ ] Los documentos se imprimen correctamente y muestran su carácter ficticio.
- [ ] Las métricas no almacenan contenido libre ni datos funcionales descartables.
- [ ] Los nombres de proveedores externos se muestran acompañados por la palabra **simulación**.

---

## 12. Control de cambios

El catálogo se versionará de forma semántica. Agregar un escenario compatible incrementará minor; corregir contenido sin alterar comportamiento incrementará patch; cambiar contratos o resultados de manera incompatible incrementará major.

La incorporación de una conexión real, IA externa, generación PDF en backend, uploads o sincronización distribuida requerirá un ADR nuevo y no podrá introducirse como detalle de implementación.

---

**Fin del documento.**
