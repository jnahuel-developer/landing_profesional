# Especificación funcional y técnica de ACME Logística

**Proyecto:** Laboratorio interactivo del portfolio profesional  
**Dominio:** ACME Logística  
**Tipo de documento:** Especificación funcional, de experiencia y arquitectura de dominio  
**Versión:** 1.1  
**Estado:** Aprobado para inicio de proyecto  
**Idioma base:** Español  
**Enfoque de interfaz:** Desktop-first, orientación landscape  
**Documento rector relacionado:** `ESPECIFICACION_PLATAFORMA_WEB_PERSONAL.md`, versión 1.5 o posterior compatible  

---

## 1. Propósito del documento

El presente documento define formalmente la demostración interactiva **ACME Logística**, una empresa ficticia utilizada para exhibir capacidades de ingeniería de software aplicada a operaciones logísticas.

La especificación comprende:

- el escenario empresarial simulado;
- las perspectivas de central, chofer, gestión y cliente;
- la aplicación móvil representada dentro de la experiencia desktop;
- flota, unidades, rutas, entregas, incidentes y comunicaciones;
- mapas, geolocalización y telemetría simulados;
- optimización de rutas mediante casos precalculados;
- prueba de entrega y documentación simple;
- funcionamiento offline simulado;
- modelo de datos conceptual;
- arquitectura del dominio;
- sesiones y datos semilla;
- métricas específicas;
- estrategia de implementación, pruebas y aceptación.

Este documento no redefine la infraestructura, la seguridad general, la navegación global, el sistema de sesiones ni las convenciones transversales de la plataforma. ACME Logística deberá integrarse en el marco definido por la especificación general.

---

## 2. Visión de la experiencia

ACME Logística representará una empresa de distribución activa en Buenos Aires y alrededores. El visitante podrá observar y manipular una operación desde varias superficies conectadas:

```text
                    ACME LOGÍSTICA
                           │
          ┌────────────────┼────────────────┐
          │                │                │
     Central          App del chofer   Seguimiento
   de operaciones      en teléfono       cliente
```

La premisa será:

> **Una flota conectada y una operación coordinada.**
>
> Vehículos, choferes, rutas, entregas, incidentes y telemetría visibles desde una central y desde aplicaciones de campo.

La experiencia deberá parecer una operación logística en funcionamiento, aunque toda la actividad, los proveedores de mapas, la telemetría y las comunicaciones estén simulados dentro de la sesión.

El objetivo no será reproducir una plataforma logística productiva completa. Se mostrará la profundidad suficiente para demostrar cómo distintas interfaces, procesos y datos pueden integrarse en un único producto.

---

## 3. Objetivos

### 3.1. Objetivos comerciales

- Demostrar capacidad para construir aplicaciones operativas complejas.
- Exhibir experiencia en interfaces desktop y móviles.
- Mostrar gestión de datos geográficos, eventos, sensores y estados.
- Comunicar capacidad para integrar central, personal de campo y clientes.
- Presentar optimización, automatización y trazabilidad de procesos.
- Facilitar que empresas de logística, servicios técnicos, distribución o trabajo en campo reconozcan casos aplicables a su operación.

### 3.2. Objetivos de experiencia

- Convertir el mapa en el centro visual de la operación.
- Permitir que el visitante actúe desde la central y el teléfono virtual.
- Reflejar de inmediato las consecuencias entre interfaces relacionadas.
- Ofrecer un recorrido completo desde la planificación hasta la entrega.
- Hacer visibles eventos, alertas, demoras y recuperación.
- Simular movimiento y actividad sin requerir infraestructura de tiempo real.
- Mantener una interacción comprensible para visitantes no técnicos.

### 3.3. Objetivos técnicos demostrables

- modelado de flota, personas, rutas y entregas;
- visualización geográfica;
- telemetría y series de eventos simuladas;
- aplicación móvil funcional dentro de un marco de dispositivo;
- sincronización de superficies dentro de una sesión;
- estados y reglas de operación;
- prueba de entrega con firma y fotografía preseleccionada;
- funcionamiento offline y sincronización eventual simulados;
- casos de optimización de rutas precalculados;
- alertas, geofencing y reglas;
- reportes e indicadores;
- internacionalización y variaciones iOS/Android;
- trazabilidad funcional e interacción por roles.

---

## 4. Principios específicos

1. **La operación es el producto.** El mapa, las listas y el teléfono deberán representar el mismo estado.
2. **Simulación honesta.** El sistema podrá parecer operativo sin afirmar conexiones reales inexistentes.
3. **Consecuencias cruzadas.** Una acción del chofer deberá verse en la central y viceversa.
4. **Movimiento con propósito.** La animación de vehículos explicará progreso, demora o desvío.
5. **Realismo mediante casos preparados.** Las rutas y respuestas serán precalculadas y coherentes.
6. **Datos descartables.** Las operaciones de cada visitante existirán solamente durante la sesión.
7. **Complejidad proporcional.** No se implementarán dispositivos, redes ni proveedores reales si no aportan valor visible.
8. **Seguridad comprensible.** Acciones críticas simuladas, como SOS, requerirán confirmación explícita.
9. **Experiencia desktop-first.** La app móvil se utilizará dentro de un simulador de teléfono en la pantalla principal.

---

## 5. Empresa ficticia

### 5.1. Identidad operativa

```text
ACME LOGÍSTICA

Centro operativo: Buenos Aires
24 unidades
31 choferes
14 vehículos en ruta
127 entregas planificadas hoy
82 entregas completadas
3 incidencias activas
```

Los valores visibles podrán variar según el escenario. El dataset materializado podrá contener menos entidades siempre que conserve una operación verosímil.

### 5.2. Área de operación

La demo utilizará recorridos ficticios inspirados en Buenos Aires y su área metropolitana:

- Ciudad Autónoma de Buenos Aires;
- Vicente López;
- San Isidro;
- Tigre;
- Pilar;
- San Martín;
- Morón;
- Avellaneda;
- centros operativos y clientes ficticios.

No se requerirá precisión cartográfica ni navegación real. Las direcciones podrán ser ficticias o claramente demostrativas.

### 5.3. Tipos de unidad

- camión pesado;
- camión mediano;
- utilitario;
- moto;
- unidad refrigerada.

Cada tipo tendrá capacidad, atributos y telemetría coherentes con la simulación.

### 5.4. Operación representada

- distribución de mercadería;
- entregas con ventanas horarias;
- retiro en clientes;
- carga refrigerada;
- rutas con múltiples paradas;
- atención de incidentes;
- comunicación con la central;
- seguimiento por parte del cliente;
- mantenimiento básico de flota.

---

## 6. Alcance funcional

### 6.1. Incluido

- portada inmersiva y selección de perspectiva;
- central de operaciones;
- mapa operativo simulado;
- gestión de flota y choferes;
- planificación y asignación de rutas;
- optimización precalculada de rutas;
- movimiento simulado de unidades;
- detalle e historial de recorrido;
- aplicación móvil funcional dentro de marcos iOS y Android;
- inicio de jornada;
- listado y ejecución de entregas;
- prueba de entrega;
- incidentes y alertas;
- mensajería simulada entre central y chofer;
- botón SOS simulado;
- geofencing;
- seguimiento de cliente;
- telemetría de vehículo e IoT simulada;
- unidad refrigerada y alertas de temperatura;
- modo offline y sincronización eventual simulados;
- gestión básica de mantenimiento;
- reportes y actividad;
- recorridos guiados;
- personalización, idiomas y métricas.

### 6.2. Fuera del alcance

- aplicaciones móviles nativas publicadas;
- dispositivos GPS, gateways o sensores reales;
- conexión real con vehículos;
- Google Maps, Waze u otros servicios cartográficos reales;
- cálculo dinámico de rutas mediante proveedores externos;
- mensajería push, SMS, telefonía o WhatsApp reales;
- fotografías tomadas o cargadas por visitantes;
- almacenamiento de multimedia externo;
- tracking de personas o vehículos reales;
- optimización matemática de flota a escala productiva;
- despacho automático real;
- gestión completa de combustible, seguros, costos o nómina;
- firma digital legal;
- comprobantes de entrega con validez jurídica;
- infraestructura distribuida de eventos;
- WebSockets o SSE como requisito de la primera versión;
- conservación de operaciones después de vencer la sesión.

---

## 7. Perspectivas y superficies

### 7.1. Operador de central

Intereses:

- posición y estado de unidades;
- avance de rutas;
- entregas próximas o demoradas;
- incidentes;
- mensajes;
- reasignaciones y desvíos;
- confirmaciones de entrega.

### 7.2. Gerente de operaciones

Intereses:

- cumplimiento y puntualidad;
- utilización de flota;
- distancias y tiempos;
- incidencias por categoría;
- desempeño de rutas y unidades;
- alertas de mantenimiento o temperatura;
- reportes consolidados.

### 7.3. Chofer

Superficie principal: teléfono virtual.

Intereses:

- jornada y vehículo asignado;
- ruta del día;
- próxima parada;
- instrucciones de entrega;
- navegación simulada;
- prueba de entrega;
- incidentes;
- mensajes y alertas;
- estado de conexión.

### 7.4. Cliente receptor

Intereses:

- estado de su entrega;
- ventana estimada;
- progreso resumido;
- aviso de proximidad;
- confirmación de entrega.

No verá información de otras entregas ni datos internos de la flota.

### 7.5. Cambio de perspectiva

El visitante podrá cambiar entre central, gerente, chofer y cliente sin login. El estado operativo deberá conservarse y la navegación adaptarse a cada perspectiva.

---

## 8. Entrada a la experiencia

```text
ACME LOGÍSTICA

Una flota conectada.
Una operación funcionando.

Elegí cómo querés explorarla.

[ Central de operaciones ]
[ Aplicación del chofer ]
[ Seguimiento del cliente ]
[ Sorprendeme ]
```

Descripciones:

- **Central:** gestionar flota, rutas, entregas e incidentes.
- **Chofer:** ejecutar una jornada desde un dispositivo móvil simulado.
- **Cliente:** seguir una entrega sin acceder a información interna.
- **Sorprendeme:** recorrer una operación desde la salida hasta la prueba de entrega.

La entrada indicará que los datos, mapas, comunicaciones e integraciones son simulados y que la sesión dura una hora.

---

## 9. Arquitectura de información

```text
ACME Logística
├── Operación en vivo
├── Entregas
├── Rutas y planificación
├── Flota
├── Choferes
├── Incidentes
├── Mensajes
├── Telemetría
├── Mantenimiento
├── Reportes
├── Actividad
├── App del chofer
└── Seguimiento cliente
```

La navegación visible dependerá de la perspectiva. La central y el teléfono podrán mostrarse simultáneamente durante recorridos y escenarios cruzados.

### 9.1. Panel “Lo que ocurrió”

Después de una operación significativa podrá mostrarse:

```text
✓ Entrega ENT-20318 confirmada
✓ Ruta R-1048 actualizada
✓ Central notificada
✓ Comprobante de entrega disponible
✓ Indicadores recalculados
```

Una vista conceptual opcional explicará el flujo sin afirmar infraestructura inexistente:

```text
App del chofer
   ↓
API de la demo
   ↓
Entregas y ruta
   ↓
Central y reportes
```

---

## 10. Modos de exploración

### 10.1. Exploración libre

Permite seleccionar unidades, cambiar estados, enviar mensajes, completar entregas, provocar alertas y reiniciar la demo.

### 10.2. Recorrido guiado

Conduce al visitante por una jornada abreviada desde el inicio de ruta hasta la entrega.

### 10.3. Escenarios preparados

- jornada normal;
- congestión y ruta alternativa;
- problema mecánico;
- entrega rechazada o parcial;
- pérdida y recuperación de conexión;
- temperatura fuera de rango;
- alerta SOS;
- alta demanda con demoras.

### 10.4. Modo explicativo

El control **“Ver detrás del sistema”** añadirá explicaciones conceptuales sobre geolocalización, sincronización, telemetría, reglas y separación de superficies.

---

## 11. Central de operaciones

### 11.1. Layout principal

La central estará optimizada para landscape:

```text
┌──────────────────────────────────────────────────────────────┐
│ Indicadores · filtros · reloj de simulación                 │
├───────────────────────────────────────┬──────────────────────┤
│                                       │ Unidades / alertas    │
│                MAPA                   │ Entregas próximas     │
│                                       │ Actividad             │
├───────────────────────────────────────┴──────────────────────┤
│ Línea temporal o detalle contextual                          │
└──────────────────────────────────────────────────────────────┘
```

### 11.2. Indicadores

- vehículos activos;
- rutas iniciadas;
- entregas completadas y pendientes;
- puntualidad estimada;
- kilómetros planificados y simulados;
- incidencias activas;
- unidades sin conexión;
- alertas de temperatura o mantenimiento.

### 11.3. Filtros

- tipo de vehículo;
- estado operativo;
- ruta;
- chofer;
- prioridad;
- incidencia;
- zona;
- entrega demorada;
- unidad refrigerada.

### 11.4. Selección de unidad

Al seleccionar una unidad se mostrará:

- identificador, modelo y patente ficticia;
- chofer;
- estado;
- velocidad simulada;
- última actualización;
- ruta y siguiente parada;
- entregas completadas y pendientes;
- ETA;
- combustible, batería y otros sensores simulados;
- mensajes e incidentes recientes;
- acciones contextuales.

---

## 12. Mapa operativo simulado

### 12.1. Base cartográfica

No se dependerá de Google Maps, Waze ni tiles externos. El mapa podrá implementarse mediante:

- una base vectorial simplificada alojada con la aplicación;
- un plano esquemático propio;
- capas y recorridos SVG o Canvas;
- datos geográficos ficticios inspirados en el área operativa.

El objetivo será representar relaciones espaciales y movimiento, no ofrecer navegación precisa.

### 12.2. Elementos

- centro operativo;
- unidades;
- rutas planificadas;
- rutas recorridas;
- próximas paradas;
- clientes;
- incidentes;
- zonas de geofence;
- congestión o cortes simulados;
- selección y seguimiento de unidad.

### 12.3. Estados visuales

Los iconos diferenciarán:

- disponible;
- en ruta;
- detenido;
- entregando;
- demorado;
- con incidencia;
- sin conexión;
- emergencia.

El color no será el único indicador; se utilizarán forma, iconografía y etiquetas accesibles.

### 12.4. Proveedores simulados

La interfaz podrá ofrecer un selector conceptual:

```text
Motor de rutas
○ Google Maps · simulación
○ Waze · simulación
● Motor ACME · simulación
```

Todos los resultados provendrán de casos internos precalculados. Las marcas externas se utilizarán únicamente como referencia de integración posible y con identificación visible de simulación.

---

## 13. Movimiento y telemetría de posición

### 13.1. Modelo de movimiento

Cada ruta contendrá una polilínea precalculada y una duración de simulación. La posición visible se interpolará en el navegador según:

- reloj de simulación;
- progreso de ruta;
- velocidad configurada;
- paradas;
- incidentes;
- desvíos aplicados.

No será necesario persistir cada coordenada. El backend conservará hitos y estado operativo; el frontend derivará posiciones intermedias.

### 13.2. Datos visibles

```text
latitude
longitude
speed
heading
accuracy
timestamp
battery
connection
driverStatus
vehicleStatus
```

Los valores serán simulados y coherentes con el escenario.

### 13.3. Frecuencia visual

La interfaz podrá actualizar la posición cada dos a cinco segundos. Esta actualización será local y no implicará transmisión real desde un dispositivo.

### 13.4. Historial

La ruta podrá mostrar:

- trayecto planificado;
- trayecto realizado;
- entregas;
- paradas inesperadas;
- incidentes;
- desvíos;
- tiempos de espera;
- kilómetros simulados.

---

## 14. Flota

### 14.1. Capacidades

- listado y búsqueda de unidades;
- filtros por tipo, estado y disponibilidad;
- ficha del vehículo;
- capacidad y tipo de carga;
- asignación actual;
- kilometraje simulado;
- telemetría reciente;
- incidentes;
- mantenimiento planificado;
- documentación ficticia y vencimientos representativos.

### 14.2. Estados

```text
DISPONIBLE
ASIGNADA
EN_RUTA
DETENIDA
EN_ENTREGA
CON_INCIDENCIA
EN_MANTENIMIENTO
FUERA_DE_SERVICIO
```

Las transiciones dependerán de asignaciones y eventos. No se permitirá iniciar una ruta con una unidad en mantenimiento o fuera de servicio.

### 14.3. Capacidad

Cada vehículo tendrá peso, volumen y categorías de carga admitidas. La planificación mostrará una advertencia si una ruta supera la capacidad, sin implementar un optimizador completo de carga.

---

## 15. Choferes

### 15.1. Capacidades

- listado y búsqueda;
- estado actual;
- vehículo y ruta asignados;
- jornada;
- entregas realizadas;
- incidentes recientes;
- habilitaciones ficticias;
- métricas simples de puntualidad y cumplimiento.

### 15.2. Estados

- disponible;
- asignado;
- en jornada;
- en pausa;
- con incidencia;
- fuera de servicio.

### 15.3. Reglas

- Un chofer no podrá tener dos rutas activas simultáneas.
- Una ruta no podrá iniciarse sin chofer y vehículo válidos.
- Los datos personales serán ficticios.
- Las métricas no deberán presentarse como evaluación laboral real.

---

## 16. Rutas y planificación

### 16.1. Entidad ruta

Una ruta incluirá:

- identificador;
- fecha;
- centro operativo;
- vehículo;
- chofer;
- lista ordenada de paradas;
- distancia y duración estimadas;
- capacidad utilizada;
- ventanas horarias;
- prioridad;
- caso de recorrido asociado;
- estado.

### 16.2. Flujo de planificación

1. seleccionar entregas pendientes;
2. elegir vehículo y chofer;
3. revisar capacidad y restricciones;
4. ordenar paradas;
5. solicitar optimización simulada;
6. comparar alternativa;
7. aplicar el recorrido seleccionado;
8. publicar la ruta en la app del chofer.

### 16.3. Optimización precalculada

La aplicación contará con entre cinco y seis casos de rutas preparados. Cada caso contendrá:

- orden original y optimizado;
- polilíneas;
- distancia;
- duración;
- ventanas horarias;
- congestión;
- alternativas;
- explicación resumida de criterios.

Ejemplo:

```text
Ruta original       112 km · 6 h 18 min
Ruta optimizada      91 km · 5 h 31 min

Ahorro simulado
21 km · 47 min
```

No se ejecutará un algoritmo de optimización productivo ni se consultarán APIs externas.

### 16.4. Desvío

Un evento de congestión podrá ofrecer una ruta alternativa precalculada. Si la central la aplica:

- cambiará el recorrido visible;
- se recalculará la ETA simulada;
- el teléfono recibirá una actualización dentro de la sesión;
- se registrará el evento en la actividad.

---

## 17. Entregas

### 17.1. Datos principales

- identificador;
- cliente y destino ficticios;
- contacto;
- ventana horaria;
- bultos, peso y volumen;
- requisitos;
- ruta y posición;
- prioridad;
- estado;
- prueba de entrega;
- incidentes relacionados.

### 17.2. Estados

```text
PENDIENTE
  ├── ASIGNADA
  │      └── EN_RUTA
  │             ├── PRÓXIMA
  │             ├── EN_DESTINO
  │             │      ├── ENTREGADA
  │             │      ├── PARCIAL
  │             │      └── FALLIDA
  │             └── REPROGRAMADA
  └── CANCELADA
```

### 17.3. Reglas

- Las transiciones inválidas se rechazarán con explicación.
- Una entrega confirmada actualizará ruta, tablero, cliente y métricas.
- Una entrega parcial requerirá cantidad entregada y motivo.
- Una entrega fallida requerirá motivo y acción siguiente.
- No se modificarán entregas finalizadas salvo mediante una corrección explícita de demo.

---

## 18. Aplicación móvil del chofer

### 18.1. Presentación

La aplicación aparecerá dentro de un marco de teléfono interactivo. No será una captura ni una animación grabada.

```text
╭─────────────────────╮
│  ACME LOGÍSTICA     │
│                     │
│  Buenos días,       │
│  Martín             │
│                     │
│  Ruta R-1048        │
│  11 entregas        │
│  74 km              │
│  5 h 20 min         │
│                     │
│  [ INICIAR RUTA ]   │
╰─────────────────────╯
```

### 18.2. Navegación móvil

- Inicio;
- Ruta;
- Entregas;
- Mensajes;
- Incidentes;
- Perfil y conexión.

### 18.3. Variantes de dispositivo

El visitante podrá alternar:

- iPhone;
- Android;
- tema claro u oscuro;
- idioma.

Cambiarán el marco, safe areas, navegación y algunos patrones visuales. La lógica funcional será la misma. No se afirmará que son aplicaciones nativas instaladas.

### 18.4. Sincronización

Cuando el teléfono y la central estén visibles en la misma página compartirán el estado del frontend. Las acciones relevantes se persistirán mediante la API para sobrevivir una recarga durante la sesión.

No se requerirán WebSockets. Si una vista separada necesitara consultar cambios del backend, podrá utilizar polling moderado.

---

## 19. Inicio de jornada

### 19.1. Resumen

El chofer verá:

- ruta;
- vehículo;
- cantidad de paradas;
- distancia;
- duración estimada;
- alertas previas;
- estado de conexión.

### 19.2. Checklist

Antes de iniciar podrá confirmar:

- identidad y vehículo;
- nivel de combustible simulado;
- documentación ficticia;
- estado general;
- carga asignada;
- teléfono y GPS simulados.

### 19.3. Consecuencia

Al iniciar:

```text
✓ Jornada iniciada
✓ GPS simulado activo
✓ Vehículo vinculado
✓ Central actualizada
```

La unidad pasará de **Asignada** a **En ruta** y comenzará el movimiento visual.

---

## 20. Ejecución de entrega

### 20.1. Próxima parada

La app mostrará:

- cliente;
- dirección ficticia;
- ETA;
- bultos y peso;
- contacto;
- instrucciones;
- acciones **Navegar** y **Llegué**.

### 20.2. Llegada

Al marcar llegada:

- la entrega pasará a **En destino**;
- la unidad aparecerá detenida;
- la central se actualizará;
- se habilitará la confirmación de entrega.

### 20.3. Confirmación

El chofer podrá registrar:

- bultos entregados;
- nombre ficticio de quien recibe;
- firma dibujada con mouse o puntero;
- una fotografía elegida entre tres o cuatro imágenes locales;
- observaciones breves;
- ubicación simulada;
- fecha y hora.

No se habilitará cámara ni carga de archivos.

---

## 21. Prueba de entrega

### 21.1. Contenido

- entrega;
- cliente;
- chofer;
- vehículo;
- fecha y hora;
- bultos previstos y entregados;
- receptor;
- firma capturada;
- fotografía local seleccionada;
- ubicación simulada;
- observaciones;
- marca **“DOCUMENTO DE DEMOSTRACIÓN”**.

### 21.2. Representación de firma

La firma podrá almacenarse durante la sesión como trazos vectoriales o imagen temporal en los datos descartables. No tendrá validez jurídica.

### 21.3. Fotografías

Se incluirán tres o cuatro imágenes estáticas optimizadas dentro de la aplicación, por ejemplo:

- recepción correcta;
- mercadería en mostrador;
- embalaje con observación;
- acceso cerrado.

No se requerirá storage externo ni respaldo de estas imágenes.

### 21.4. Documento

La prueba de entrega utilizará una vista HTML con estilos de impresión. El diálogo nativo del navegador permitirá imprimirla o guardarla como PDF. No se generará ni almacenará un archivo en el backend.

---

## 22. Incidentes

### 22.1. Categorías

- tránsito;
- vehículo;
- accidente;
- entrega;
- cliente;
- carga;
- temperatura;
- otro.

### 22.2. Datos

- categoría;
- prioridad;
- descripción breve;
- unidad, chofer, ruta y entrega relacionadas;
- ubicación simulada;
- fotografía local opcional cuando corresponda;
- estado;
- acciones de central;
- timestamps.

### 22.3. Estados

```text
ABIERTO
  ├── EN_REVISIÓN
  │      ├── RESUELTO
  │      └── ESCALADO
  └── DESCARTADO
```

### 22.4. Consecuencias

Un incidente podrá:

- cambiar el icono de la unidad;
- detener o demorar una ruta;
- generar una alerta;
- modificar ETA;
- habilitar mensajes sugeridos;
- ofrecer un desvío o reprogramación precalculados.

---

## 23. SOS y alertas críticas

El teléfono incluirá una acción SOS simulada. Requerirá pulsación prolongada o confirmación doble.

Al confirmarla:

- se creará una alerta prioritaria;
- la unidad cambiará de estado visual;
- la central enfocará la ubicación;
- se mostrará un protocolo ficticio de respuesta;
- se registrará el evento.

La interfaz indicará que se trata de una simulación y que no se contactará a servicios de emergencia.

---

## 24. Mensajería operativa

### 24.1. Alcance

La central y el teléfono podrán intercambiar mensajes dentro de la sesión:

- texto breve;
- respuestas rápidas;
- instrucciones de ruta;
- confirmación de recepción;
- mensajes vinculados a incidentes.

### 24.2. Implementación

Cuando ambas superficies estén en la misma experiencia, los mensajes se reflejarán mediante estado compartido. Si se alternan vistas, se persistirán en el backend y se consultarán al abrir el módulo o mediante polling moderado.

No habrá SMS, push, correo ni mensajería externa.

### 24.3. Reglas

- Los mensajes pertenecerán a la sesión.
- No se enviarán a personas reales.
- No se almacenarán de manera permanente en las métricas.
- La analítica registrará únicamente categorías de interacción.
- Los mensajes preparados podrán traducirse; el texto libre no requerirá traducción automática.

---

## 25. Geofencing y avisos

### 25.1. Funcionamiento

Cada parada podrá tener un radio ficticio, por ejemplo 200 metros. Cuando la posición interpolada ingrese en él se generará un evento `ENTER`; al salir podrá generarse `EXIT`.

### 25.2. Consecuencias

- sugerir **“Llegué”** al chofer;
- marcar la unidad próxima en la central;
- actualizar el seguimiento del cliente;
- mostrar una notificación simulada;
- registrar el hito en la ruta.

### 25.3. Límites

No se utilizará geolocalización real del navegador ni se enviarán avisos externos. Todo se calculará con datos del escenario.

---

## 26. Seguimiento del cliente

### 26.1. Información visible

- estado de la entrega;
- mapa simplificado;
- ventana de llegada;
- nombre de pila ficticio del chofer;
- tipo de unidad, si aporta valor;
- cantidad aproximada de paradas anteriores;
- aviso de proximidad;
- confirmación final.

### 26.2. Privacidad simulada

La vista no mostrará:

- otras entregas;
- ruta completa del vehículo;
- datos de otros clientes;
- telemetría interna;
- contacto personal completo del chofer;
- incidentes no relacionados.

### 26.3. Actualización

La vista se actualizará al avanzar el reloj de simulación y cuando el chofer complete hitos. Podrá verse junto a las otras superficies durante el recorrido guiado.

---

## 27. Telemetría e IoT simulados

### 27.1. Señales

- GPS;
- velocidad;
- rumbo;
- combustible;
- temperatura de motor;
- kilometraje;
- batería;
- puertas;
- temperatura de carga;
- calidad de conexión.

### 27.2. Generación

Los valores se derivarán del escenario, tipo de vehículo, progreso y eventos. No se almacenará una muestra por cada actualización visual; solo hitos, alertas o agregados relevantes.

### 27.3. Unidad refrigerada

Una unidad podrá transportar productos refrigerados con rango permitido. El escenario incluirá:

```text
Temperatura normal: 4,1 °C
Alerta: 6,7 °C durante 4 minutos simulados
```

La alerta será visible para central y chofer. El visitante podrá reconocerla, añadir una observación y ejecutar una acción preparada.

### 27.4. Reglas configuradas

Se mostrarán reglas como:

- velocidad mayor a 100 km/h;
- temperatura mayor al límite;
- sin señal durante un intervalo;
- detenido demasiado tiempo;
- desvío mayor a una distancia;
- combustible bajo.

No se implementará un motor general de reglas. Las condiciones estarán configuradas en el dominio y evaluadas sobre los datos simulados.

---

## 28. Modo offline y sincronización eventual

### 28.1. Simulación de red

El teléfono permitirá seleccionar:

```text
Red
● 4G
○ 3G
○ Inestable
○ Sin conexión
```

### 28.2. Comportamiento offline

Durante el modo sin conexión:

- la app seguirá mostrando ruta y entregas cargadas;
- las acciones se guardarán en una cola local de la demo;
- la central no mostrará todavía esos cambios;
- el teléfono indicará cantidad de eventos pendientes.

### 28.3. Reconexión

Al restaurar conexión:

```text
Sincronizando…
✓ 3 eventos enviados
✓ 1 entrega actualizada
✓ 1 prueba de entrega sincronizada
```

La cola se aplicará en orden y la central reflejará las consecuencias. Toda la simulación ocurrirá en el navegador y el backend común; no requerirá una aplicación móvil real ni protocolos distribuidos.

### 28.4. Conflictos

Se incluirá al menos un caso preparado, por ejemplo una entrega reprogramada por central mientras el teléfono estaba offline. La interfaz explicará el conflicto y ofrecerá una resolución controlada.

---

## 29. Mantenimiento de flota

### 29.1. Alcance

- próximos servicios;
- kilometraje simulado;
- tareas pendientes;
- alertas derivadas de incidentes;
- historial resumido;
- estado de disponibilidad.

### 29.2. Reglas

- Una unidad en mantenimiento no podrá asignarse a una ruta.
- Una alerta crítica podrá recomendar retirar la unidad.
- Completar una tarea actualizará la disponibilidad.
- No se gestionarán repuestos, talleres, costos ni órdenes de compra completas.

---

## 30. Reportes

### 30.1. Reportes previstos

- entregas por estado;
- puntualidad;
- cumplimiento por ruta;
- distancia planificada frente a simulada;
- incidencias por categoría;
- utilización de flota;
- tiempos de parada;
- temperatura fuera de rango;
- unidades sin conexión;
- productividad operativa agregada.

### 30.2. Interacción

- filtros por fecha, ruta, unidad y zona;
- comparación entre escenarios;
- tabla y gráfico relacionados;
- acceso desde un indicador hacia el detalle;
- actualización después de acciones de la sesión.

Los reportes tendrán finalidad demostrativa y no implementarán analítica logística avanzada.

---

## 31. Actividad y línea temporal

La experiencia mostrará una línea temporal unificada:

```text
08:14 Ruta R-1048 iniciada
08:42 Entrega ENT-20311 completada
09:31 Congestión detectada
09:34 Ruta alternativa aplicada
10:49 Geofence de Farmacia Central alcanzado
10:54 Entrega ENT-20318 confirmada
```

Cada evento incluirá:

- tiempo de simulación;
- actor o fuente;
- unidad, ruta o entrega relacionada;
- categoría;
- resultado;
- enlace contextual.

La línea temporal es funcional y narrativa; no sustituye un sistema productivo de auditoría.

---

## 32. Recorrido guiado principal

### 32.1. Premisa

> Son las 08:10 en el centro operativo de Buenos Aires. La unidad ACM-024 está asignada a una ruta de once entregas hacia zona norte.

### 32.2. Secuencia

1. revisar ruta, chofer y vehículo desde central;
2. abrir el teléfono virtual;
3. completar checklist e iniciar jornada;
4. observar la unidad en movimiento;
5. detectar congestión;
6. comparar y aplicar una alternativa precalculada;
7. recibir la actualización en el teléfono;
8. ingresar al geofence de la siguiente entrega;
9. confirmar llegada;
10. capturar receptor, firma y fotografía preparada;
11. completar la entrega;
12. revisar la prueba de entrega y los indicadores actualizados.

### 32.3. Final

El resumen mostrará:

- perspectivas utilizadas;
- flujo completo;
- datos sincronizados;
- capacidades de aplicación móvil;
- geolocalización y telemetría simuladas;
- automatizaciones y documentación;
- CTA: **“¿Necesitás conectar operaciones de campo con una central de gestión?”**

---

## 33. Escenarios precalculados

### 33.1. `LOG-RTE-001` — Distribución CABA Centro

- once paradas;
- progreso sin incidentes;
- prueba de entrega exitosa.

### 33.2. `LOG-RTE-002` — Corredor Norte con congestión

- demora de dieciocho minutos;
- alternativa que ahorra once minutos;
- actualización de ETA y teléfono.

### 33.3. `LOG-RTE-003` — Zona Oeste con problema mecánico

- alerta de motor;
- detención segura;
- comunicación con central;
- reasignación preparada de entregas.

### 33.4. `LOG-RTE-004` — Zona Sur con entrega fallida

- cliente ausente o acceso cerrado;
- fotografía local;
- motivo;
- reprogramación.

### 33.5. `LOG-RTE-005` — Cadena de frío AMBA Norte

- aumento gradual de temperatura;
- alerta;
- reconocimiento;
- acción correctiva simulada.

### 33.6. `LOG-RTE-006` — Barracas–Palermo con conectividad intermitente

- modo offline;
- entrega completada localmente;
- cola pendiente;
- reconexión y conflicto controlado.

Cada escenario tendrá datos, eventos, polilíneas y resultados versionados.

---

## 34. Personalización e idiomas

### 34.1. Identidad visual

ACME Logística utilizará una identidad más técnica y operativa que ACME Café:

- tonos fríos y neutros;
- acentos de alta visibilidad;
- mapas oscuros y claros;
- estados operativos consistentes;
- tipografía legible en alta densidad;
- iconografía de flota y alertas.

### 34.2. Temas

- claro;
- oscuro;
- contraste reforzado cuando la plataforma lo contemple;
- densidad cómoda y compacta.

### 34.3. Idiomas

- español;
- inglés;
- portugués.

Se localizarán interfaces, estados, mensajes preparados, recorridos, fechas, números, unidades y documentos. Las coordenadas y códigos permanecerán neutrales.

### 34.4. Dispositivo móvil

La variante iOS/Android se conservará al cambiar idioma o tema. El cambio no reiniciará la ruta ni la entrega activa.

---

## 35. Diseño visual y UX

### 35.1. Jerarquía

El mapa será la superficie primaria de la central. Las listas y paneles aportarán detalle sin ocultarlo. La interfaz deberá permitir localizar rápidamente:

- incidentes;
- unidades seleccionadas;
- entregas demoradas;
- acciones prioritarias;
- estado del teléfono simulado.

### 35.2. Vista dividida

Los escenarios cruzados utilizarán una vista dividida:

```text
┌─────────────────────────────────┬───────────────────┐
│ Central / mapa                  │ Teléfono virtual  │
│                                 │                   │
│ Estado de unidad y entregas     │ App del chofer    │
└─────────────────────────────────┴───────────────────┘
```

El teléfono podrá expandirse y la central conservar contexto.

### 35.3. Microinteracciones

- movimiento suave de unidades;
- transición entre rutas;
- pulsos moderados para alertas;
- cambios de ETA;
- badges de mensajes;
- progreso de sincronización;
- estados de carga y conexión;
- actualización de indicadores;
- foco automático en eventos críticos solo cuando no interrumpa una acción.

### 35.4. Reducción de movimiento

Con `prefers-reduced-motion`, las unidades actualizarán posición sin interpolación continua y las alertas evitarán pulsos repetitivos. Toda información tendrá representación textual.

---

## 36. Reglas de negocio transversales

1. Toda entidad mutable pertenecerá a una sesión de demo.
2. Una ruta activa tendrá un único vehículo y un único chofer.
3. Un vehículo o chofer no podrá participar en dos rutas activas simultáneas.
4. Una entrega pertenecerá como máximo a una ruta activa.
5. Las transiciones deberán seguir los estados definidos.
6. Completar una entrega actualizará ruta, central, seguimiento y métricas.
7. Los eventos offline se aplicarán en orden al reconectar.
8. Una alerta crítica requerirá reconocimiento explícito.
9. La prueba de entrega será ficticia y no tendrá validez jurídica.
10. Las posiciones visibles se derivarán del escenario y no de geolocalización real.
11. Los resultados de rutas serán precalculados y estarán identificados como simulación.
12. Los eventos automáticos no modificarán el elemento que el visitante esté editando.
13. Reiniciar restaurará la semilla de la sesión.
14. Vencida la hora, las operaciones no podrán continuar.
15. Las métricas permanentes no incluirán mensajes, firmas, nombres ni fotografías seleccionadas.

---

## 37. Modelo de datos conceptual

### 37.1. Entidades

```text
DemoSession
OperationsCenter
Vehicle
Driver
Route
RouteStop
Delivery
ProofOfDelivery
Incident
OperationalMessage
TelemetrySnapshot
TelemetryAlert
Geofence
MaintenanceTask
CustomerTrackingView
BusinessEvent
PrecomputedRouteCase
OfflineEvent
```

### 37.2. Relaciones

```text
DemoSession
 ├── Vehicles
 ├── Drivers
 ├── Routes
 │    ├── RouteStops
 │    │      └── Delivery
 │    │             └── ProofOfDelivery
 │    └── BusinessEvents
 ├── Incidents
 ├── OperationalMessages
 ├── TelemetryAlerts
 ├── MaintenanceTasks
 └── OfflineEvents

Vehicle
 ├── TelemetrySnapshot actual
 ├── Routes
 ├── Incidents
 └── MaintenanceTasks
```

### 37.3. Persistencia de telemetría

No se guardará cada posición interpolada. Se persistirán:

- estado actual;
- progreso de ruta;
- último hito;
- alertas;
- incidentes;
- snapshots necesarios para una vista coherente;
- agregados utilizados en reportes.

### 37.4. Identificadores visibles

```text
ACM-024      unidad
R-1048       ruta
ENT-20318    entrega
INC-041      incidente
POD-20318    prueba de entrega
```

Serán ficticios y no sustituirán identificadores internos opacos.

---

## 38. Arquitectura del dominio

### 38.1. Módulos de backend

```text
acme-logistica
├── fleet
├── drivers
├── routes
├── deliveries
├── proof-of-delivery
├── incidents
├── messaging
├── telemetry-simulation
├── geofencing
├── maintenance
├── customer-tracking
├── reports
├── activity
└── seed-scenarios
```

Los módulos formarán parte del monolito modular. No serán microservicios ni contenedores independientes.

### 38.2. Simulación en frontend y backend

**Frontend:** interpolación de movimiento, teléfono, reloj, red, vista dividida y actualización visual.  
**Backend:** estados relevantes, transiciones, hitos, entregas, incidentes, mensajes, pruebas de entrega y persistencia temporal.

### 38.3. API de referencia

```text
GET    /api/v1/demo/acme-logistica/overview
GET    /api/v1/demo/acme-logistica/vehicles
GET    /api/v1/demo/acme-logistica/vehicles/{id}
GET    /api/v1/demo/acme-logistica/drivers
GET    /api/v1/demo/acme-logistica/routes
POST   /api/v1/demo/acme-logistica/routes
POST   /api/v1/demo/acme-logistica/routes/{id}/optimize
POST   /api/v1/demo/acme-logistica/routes/{id}/start
PATCH  /api/v1/demo/acme-logistica/routes/{id}/progress
GET    /api/v1/demo/acme-logistica/deliveries/{id}
POST   /api/v1/demo/acme-logistica/deliveries/{id}/arrival
POST   /api/v1/demo/acme-logistica/deliveries/{id}/complete
POST   /api/v1/demo/acme-logistica/incidents
PATCH  /api/v1/demo/acme-logistica/incidents/{id}
POST   /api/v1/demo/acme-logistica/messages
GET    /api/v1/demo/acme-logistica/telemetry/{vehicleId}
GET    /api/v1/demo/acme-logistica/reports/{report}
GET    /api/v1/demo/acme-logistica/activity
POST   /api/v1/demo/acme-logistica/reset
```

Los contratos definitivos se formalizarán en OpenAPI.

### 38.4. Sincronización simplificada

- El estado compartido actualizará central, teléfono y cliente cuando convivan en una página.
- Las mutaciones importantes se enviarán a la API.
- Las posiciones intermedias se derivarán localmente.
- Las vistas alternadas cargarán el último estado del backend.
- El polling se reservará para casos donde aporte continuidad visible.
- No se incluirá infraestructura distribuida de eventos.

---

## 39. Sesión, semillas y datos

### 39.1. Sesión

La plataforma creará o reutilizará una sesión vigente con una duración fija de una hora. No habrá registro ni login.

### 39.2. Semillas

Cada escenario definirá:

- reloj de simulación;
- unidades y choferes;
- rutas y polilíneas;
- entregas;
- posiciones iniciales;
- telemetría;
- incidentes;
- mensajes preparados;
- fotografías locales disponibles;
- reglas y eventos programados;
- alternativas de ruta.

Las semillas serán deterministas, versionadas y libres de datos reales.

### 39.3. Persistencia temporal

El estado sobrevivirá a recargas durante la sesión. Las posiciones podrán reconstruirse desde progreso y reloj. Las firmas, mensajes, pruebas de entrega y operaciones serán descartables.

### 39.4. Limpieza

La tarea diaria común eliminará sesiones vencidas y datos del dominio. Las métricas categóricas ya almacenadas no se eliminarán.

### 39.5. Reinicio

**“Restablecer demostración”** reconstruirá el escenario elegido sin afectar a otros visitantes ni borrar las métricas permanentes.

---

## 40. Métricas específicas

```text
acme_logistica_started
acme_logistica_perspective_selected
acme_logistica_vehicle_selected
acme_logistica_route_started
acme_logistica_route_optimized
acme_logistica_detour_applied
acme_logistica_driver_app_opened
acme_logistica_delivery_arrived
acme_logistica_delivery_completed
acme_logistica_pod_viewed
acme_logistica_incident_created
acme_logistica_message_sent
acme_logistica_sos_simulated
acme_logistica_geofence_triggered
acme_logistica_offline_enabled
acme_logistica_offline_synced
acme_logistica_telemetry_alert_viewed
acme_logistica_guided_tour_completed
acme_logistica_device_changed
acme_logistica_demo_reset
```

Dimensiones permitidas:

- perspectiva;
- módulo;
- escenario;
- tipo de vehículo;
- categoría de incidente;
- estado de entrega;
- resultado categórico;
- idioma y tema;
- tipo de dispositivo simulado;
- duración agregada.

No se almacenarán permanentemente mensajes, firmas, nombres de receptor, coordenadas exactas de interacción ni fotografías seleccionadas.

El panel interno permitirá comparar inicio, módulos explorados, recorrido completado, uso del teléfono y CTA posterior.

---

## 41. Requisitos no funcionales del dominio

### 41.1. Rendimiento

- El mapa y la lista principal deberán resultar utilizables dentro del objetivo general de carga.
- El movimiento de entre 12 y 20 unidades activas deberá mantenerse fluido en el viewport de referencia.
- Solo la unidad seleccionada requerirá el máximo detalle visual.
- La interpolación deberá detenerse en pestañas no visibles o reducir frecuencia.
- Las mutaciones comunes cumplirán los objetivos de API de la plataforma.
- Las fotografías estarán optimizadas y se cargarán bajo demanda.
- No se persistirá telemetría visual redundante.

### 41.2. Accesibilidad

- Toda entidad del mapa tendrá alternativa en lista.
- Seleccionar una unidad no dependerá exclusivamente del puntero.
- Los cambios críticos se anunciarán de forma accesible.
- El teléfono será operable por teclado.
- La firma dispondrá de una alternativa demostrativa accesible, como seleccionar una firma predefinida.
- Las alertas no dependerán solo de color o animación.
- El recorrido guiado mantendrá foco lógico.
- Los gráficos tendrán resumen textual o tabla.

### 41.3. Integridad

- central, teléfono y cliente deberán mostrar estados compatibles;
- una entrega completada no podrá completarse nuevamente;
- una ruta no podrá avanzar con vehículo fuera de servicio;
- un evento offline no podrá aplicarse dos veces;
- una alternativa aplicada deberá actualizar ETA y polilínea juntas;
- la prueba de entrega deberá corresponder a la entrega correcta.

### 41.4. Privacidad y seguridad proporcional

- solo se utilizarán identidades ficticias;
- no se solicitará ubicación real;
- no se habilitará cámara ni subida de archivos;
- SOS no contactará servicios reales;
- la vista cliente limitará la información;
- el aislamiento entre sesiones será obligatorio;
- las entradas libres tendrán límites y validación.

---

## 42. Estrategia de pruebas

### 42.1. Unitarias

- transiciones de ruta, unidad y entrega;
- capacidad de vehículo;
- interpolación de posición;
- cálculo de ETA simulado;
- detección de geofence;
- reglas de telemetría;
- orden y aplicación de eventos offline;
- resolución de conflictos preparados;
- agregados de reportes.

### 42.2. Integración

- inicio de ruta y cambio de estado de unidad;
- entrega completada con prueba;
- incidente reflejado en central y teléfono;
- desvío con nueva ETA;
- mensaje bidireccional dentro de sesión;
- alerta de temperatura;
- sincronización después de modo offline;
- reinicio del escenario;
- aislamiento entre sesiones.

### 42.3. End-to-end

1. entrar a central y seleccionar una unidad;
2. abrir el teléfono e iniciar jornada;
3. observar movimiento coherente;
4. aplicar una ruta alternativa;
5. confirmar llegada y entrega;
6. registrar firma y fotografía local;
7. ver la prueba de entrega;
8. reportar y resolver un incidente;
9. intercambiar mensajes;
10. activar offline, operar y sincronizar;
11. ver seguimiento como cliente;
12. cambiar dispositivo, idioma y tema;
13. completar Sorprendeme;
14. reiniciar y verificar expiración.

### 42.4. Visuales

- mapas claro y oscuro;
- unidades en todos los estados;
- central con distintas densidades;
- teléfono iOS y Android;
- teléfono en temas e idiomas;
- vista dividida;
- incidentes y SOS;
- offline y sincronización;
- prueba de entrega;
- resoluciones desktop mínima y de referencia.

---

## 43. Roadmap de implementación

### Fase 1 — Fundaciones

- modelo de dominio;
- semillas;
- shell y navegación;
- perspectivas;
- reloj de simulación;
- lista de unidades y rutas.

### Fase 2 — Central y mapa

- mapa local;
- unidades y selección;
- polilíneas;
- movimiento interpolado;
- detalle de unidad;
- indicadores y filtros.

### Fase 3 — App del chofer

- marco iOS/Android;
- jornada;
- ruta y paradas;
- llegada y entrega;
- sincronización con central.

### Fase 4 — Operación avanzada

- incidentes;
- mensajes;
- SOS;
- geofencing;
- seguimiento cliente;
- prueba de entrega;
- fotografías locales.

### Fase 5 — Simulaciones especiales

- optimización precalculada;
- desvíos;
- telemetría e IoT;
- refrigeración;
- offline y conflictos;
- mantenimiento.

### Fase 6 — Reportes e inmersión

- actividad;
- reportes;
- recorrido guiado;
- modo explicativo;
- ES, EN y PT;
- temas, densidad y microinteracciones.

### Fase 7 — Validación

- accesibilidad;
- pruebas end-to-end;
- aislamiento;
- rendimiento con unidades activas;
- métricas;
- CTA contextual;
- validación completa en staging.

---

## 44. Criterios de aceptación

### 44.1. Mundo y navegación

- [ ] ACME Logística se presenta como una operación ficticia coherente.
- [ ] La entrada ofrece Central, Chofer, Cliente y Sorprendeme.
- [ ] El visitante puede cambiar de perspectiva conservando estado.
- [ ] La navegación se adapta a la perspectiva.
- [ ] La experiencia informa que datos, mapas e integraciones son simulados.
- [ ] La sesión indica su duración de una hora.

### 44.2. Central y mapa

- [ ] El mapa local muestra entre 12 y 20 unidades activas sin proveedor externo.
- [ ] Las unidades se diferencian por estado de forma accesible.
- [ ] Seleccionar una unidad muestra datos, ruta, chofer y entregas coherentes.
- [ ] La lista permite operar como alternativa al mapa.
- [ ] Los filtros producen resultados coherentes.
- [ ] La ruta planificada y recorrida pueden compararse.

### 44.3. Movimiento y rutas

- [ ] Las unidades avanzan sobre polilíneas precalculadas.
- [ ] No se persiste una coordenada por cada actualización visual.
- [ ] Al menos cinco casos de ruta están disponibles.
- [ ] La optimización compara recorrido original y alternativo.
- [ ] Aplicar un desvío actualiza polilínea, ETA, teléfono y actividad.
- [ ] No existe conexión real con Google Maps o Waze.

### 44.4. Aplicación del chofer

- [ ] El teléfono virtual es funcional y no una imagen.
- [ ] Puede alternarse entre iOS y Android.
- [ ] El chofer puede iniciar jornada.
- [ ] Puede consultar ruta y entregas.
- [ ] Puede marcar llegada y completar una entrega.
- [ ] Las acciones se reflejan en la central.
- [ ] El estado sobrevive a una recarga durante la sesión.

### 44.5. Prueba de entrega

- [ ] Se registran bultos, receptor ficticio, firma, fotografía local, hora y ubicación simulada.
- [ ] Solo se ofrecen tres o cuatro fotografías incluidas con la aplicación.
- [ ] No existe cámara ni carga de archivos.
- [ ] La prueba indica que es un documento de demostración.
- [ ] Puede imprimirse o descargarse sin almacenamiento permanente.
- [ ] No se atribuye validez jurídica a la firma.

### 44.6. Incidentes y comunicación

- [ ] El chofer puede reportar incidentes de varias categorías.
- [ ] Un incidente actualiza central, unidad y actividad.
- [ ] La central puede responder con mensajes dentro de la sesión.
- [ ] El teléfono puede confirmar recepción.
- [ ] SOS requiere confirmación y no contacta servicios reales.
- [ ] Los mensajes libres no se conservan en métricas permanentes.

### 44.7. Geofencing, cliente y telemetría

- [ ] Ingresar a un geofence actualiza teléfono, central y cliente.
- [ ] La vista cliente no expone otras entregas.
- [ ] La telemetría es coherente con vehículo y escenario.
- [ ] Una unidad refrigerada puede producir una alerta de temperatura.
- [ ] Las reglas operativas generan alertas controladas.
- [ ] No se utiliza ubicación real del navegador.

### 44.8. Offline

- [ ] El teléfono permite simular 4G, 3G, red inestable y offline.
- [ ] Las acciones offline se acumulan localmente.
- [ ] La central no las refleja antes de sincronizar.
- [ ] La reconexión aplica eventos una sola vez y en orden.
- [ ] Existe al menos un conflicto preparado y resoluble.
- [ ] No se requiere una aplicación móvil real.

### 44.9. Personalización e idiomas

- [ ] Temas claro y oscuro funcionan en central, mapa y teléfono.
- [ ] La densidad puede cambiar sin pérdida funcional.
- [ ] Español, inglés y portugués cubren los flujos principales.
- [ ] Fechas, unidades y números respetan locale.
- [ ] Cambiar idioma, tema o dispositivo conserva estado.
- [ ] La reducción de movimiento mantiene la información comprensible.

### 44.10. Sesiones, métricas y calidad

- [ ] Cada visitante opera sobre datos aislados.
- [ ] Reiniciar restaura el escenario sin afectar métricas.
- [ ] Vencida la sesión no se admiten operaciones nuevas.
- [ ] La limpieza diaria elimina datos funcionales vencidos.
- [ ] Los datos semilla permiten reconstruir la demo.
- [ ] Los eventos analíticos no contienen mensajes, firmas ni identidades ingresadas.
- [ ] Los recorridos críticos tienen pruebas end-to-end.
- [ ] No existen errores críticos de accesibilidad conocidos.
- [ ] La demo cumple los objetivos de rendimiento de la plataforma.

---

## 45. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Mapa demasiado costoso o complejo | Retraso y bajo rendimiento | Plano vectorial local y alcance geográfico acotado |
| Movimiento poco creíble | Menor inmersión | Polilíneas preparadas, paradas y velocidades coherentes |
| Confusión con tracking real | Riesgo reputacional | Etiquetas visibles de simulación y datos ficticios |
| Exceso de telemetría | Ruido visual | Detalle progresivo y persistencia solo de hitos |
| Inconsistencia entre central y teléfono | Pérdida de credibilidad | Estado compartido, API común y pruebas de integración |
| Uso indebido de marcas de mapas | Confusión comercial | Identificar proveedores como simulaciones de integración |
| Offline demasiado complejo | Sobrecosto técnico | Cola local acotada y conflictos precalculados |
| SOS interpretado como real | Riesgo de seguridad | Confirmación y aviso explícito de demostración |
| Fotografías y firmas innecesariamente persistidas | Mayor complejidad | Activos locales y datos temporales de sesión |
| Demasiados módulos superficiales | Sensación de maqueta | Priorizar ruta, entrega e interacción central–chofer |

---

## 46. Decisiones de implementación

Quedan cerradas por la plataforma y el catálogo de simulaciones:

1. seis rutas definitivas y sus variantes, identificadas de `LOG-RTE-001` a `LOG-RTE-006`;
2. movimiento y telemetría local a partir de polilíneas, keyframes y reloj simulado;
3. cola offline local acotada, sincronización por lote y un conflicto precalculado;
4. cuatro fotografías WebP locales para prueba de entrega, sin cámara ni uploads;
5. firma temporal como trazos vectoriales;
6. impresión documental mediante vista HTML y diálogo nativo del navegador.

Permanecen como decisiones visuales o de calibración del dominio:

1. tecnología definitiva de representación del mapa local;
2. nivel final de detalle visual del plano;
3. escala exacta del reloj de simulación;
4. cantidad inicial de unidades activas dentro del rango aprobado;
5. resolución visual de los marcos iOS y Android;
6. reportes e indicadores prioritarios;
7. CTA contextual por módulo.

Estas decisiones deberán preservar el principio de realismo visual con implementación proporcional.

---

## 47. Control de cambios

La versión 1.1 incorpora las decisiones transversales de la Ronda 4 sobre rutas, telemetría, modo offline, activos locales e impresión. Todo cambio que altere perspectivas, rutas, sincronización, telemetría, sesiones, integraciones simuladas o criterios de aceptación deberá registrarse con descripción, motivación, impacto y versión.

Las capacidades compartidas continuarán regidas por la especificación general de plataforma. Ante una contradicción, deberá resolverse explícitamente cuál documento requiere actualización.

---

**Fin del documento.**
