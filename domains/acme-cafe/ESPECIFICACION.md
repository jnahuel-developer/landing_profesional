# Especificación funcional y técnica de ACME Café

**Proyecto:** Laboratorio interactivo del portfolio profesional  
**Dominio:** ACME Café  
**Tipo de documento:** Especificación funcional, de experiencia y arquitectura de dominio  
**Versión:** 1.1  
**Estado:** Aprobado para inicio de proyecto  
**Idioma base:** Español  
**Enfoque de interfaz:** Desktop-first, orientación landscape  
**Documento rector relacionado:** `ESPECIFICACION_PLATAFORMA_WEB_PERSONAL.md`, versión 1.5 o posterior compatible  

---

## 1. Propósito del documento

El presente documento define formalmente la demostración interactiva **ACME Café**, una empresa ficticia utilizada para exhibir capacidades de ingeniería de software aplicada a negocios.

La especificación comprende:

- el escenario empresarial simulado;
- los roles y recorridos disponibles;
- los módulos funcionales;
- las reglas de negocio;
- la relación entre ventas, clientes, stock, pagos, comprobantes, reservas, pedidos y asistencia conversacional;
- el modelo de datos conceptual;
- la arquitectura del dominio;
- las simulaciones de integraciones;
- la experiencia visual e interactiva;
- los datos semilla;
- las métricas particulares de la demo;
- la estrategia de implementación y pruebas;
- los criterios de aceptación.

Este documento no redefine la infraestructura, la navegación global, el sistema de sesiones, la seguridad general, la analítica transversal ni las convenciones comunes establecidas en la especificación de plataforma. ACME Café deberá integrarse en dicho marco.

---

## 2. Visión de la experiencia

ACME Café será una empresa ficticia que se percibe activa, coherente y operativa. No se presentará como una colección de mockups ni como varias demostraciones independientes.

La premisa será:

> **Una empresa completa en funcionamiento.**
>
> Clientes, ventas, pagos, stock, reservas, pedidos, facturación, asistencia y reportes conectados dentro del mismo sistema.

El visitante podrá observar una operación desde distintas perspectivas y comprobar cómo una acción produce consecuencias en otros módulos. Por ejemplo, una venta deberá afectar el stock, el historial del cliente, el comprobante, la actividad reciente y los indicadores del negocio.

La demostración deberá comunicar una idea central:

> El valor no está en cada pantalla aislada, sino en la integración de los procesos del negocio.

---

## 3. Objetivos

### 3.1. Objetivos comerciales

- Demostrar capacidad para comprender y digitalizar una operación comercial real.
- Exhibir un sistema integrado en lugar de funciones inconexas.
- Permitir que un potencial cliente reconozca procesos equivalentes en su propio negocio.
- Mostrar que la solución puede adaptarse en identidad, idioma, reglas e integraciones.
- Generar llamados a la acción relacionados con el módulo que el visitante acaba de utilizar.

### 3.2. Objetivos de experiencia

- Producir una demostración inmersiva que se comprenda sin capacitación previa.
- Permitir exploración libre y recorridos guiados.
- Mostrar varias perspectivas del mismo proceso.
- Hacer visibles las consecuencias de cada acción.
- Mantener una sensación de actividad empresarial mediante eventos controlados.
- Ofrecer errores y alternativas creíbles, no únicamente caminos exitosos.
- Evitar fricción: no habrá registro, login ni configuración obligatoria.

### 3.3. Objetivos técnicos demostrables

- CRUD y búsqueda sobre entidades relacionadas.
- flujos transaccionales de venta;
- control de inventario por sucursal;
- pagos e integraciones fiscales simuladas;
- generación simple de comprobantes;
- reservas y disponibilidad;
- pedidos multicanal;
- paneles e indicadores derivados;
- internacionalización y theming;
- asistente conversacional que consulta y modifica el estado de la demo;
- roles y capacidades diferenciadas;
- trazabilidad funcional dentro de la sesión;
- aislamiento de datos entre visitantes.

---

## 4. Principios específicos

1. **Un solo negocio, múltiples módulos.** Toda función pertenece al mismo estado empresarial.
2. **Las acciones deben tener consecuencias.** Una operación debe actualizar los módulos relacionados.
3. **Realismo controlado.** Se simularán las integraciones y se limitará la profundidad a lo que aporta valor comercial.
4. **Empresa activa.** Los indicadores, timestamps y eventos darán sensación de operación, sin introducir infraestructura innecesaria.
5. **Comprensible para dos audiencias.** El dueño de negocio verá resultados; el visitante técnico podrá ver el flujo conceptual detrás.
6. **Exploración reversible.** El visitante podrá reiniciar el escenario sin afectar a nadie más.
7. **Datos ficticios evidentes.** Ninguna operación tendrá validez comercial, fiscal o financiera.
8. **Inmersión empresarial.** Se evitará gamificación, recompensas artificiales y animaciones sin función.

---

## 5. Empresa ficticia

### 5.1. Identidad

```text
ACME Café
Specialty coffee · Buenos Aires

3 sucursales
18 empleados
1.840 clientes
aproximadamente 360 productos y variantes
```

La identidad deberá sentirse contemporánea, cálida y profesional. ACME Café será la marca propia de la demostración, subordinada visualmente al marco del laboratorio del portfolio.

### 5.2. Sucursales

| Código | Sucursal | Perfil operativo |
|---|---|---|
| PAL | Palermo | mayor tránsito, salón, take away y pedidos web |
| BEL | Belgrano | salón, reservas y venta de productos |
| SIS | San Isidro | salón, eventos pequeños y venta de café en grano |

Cada sucursal tendrá:

- stock propio;
- cajas o puntos de venta;
- agenda de reservas;
- empleados asignados;
- métricas operativas;
- horarios y capacidad;
- pedidos y actividad reciente.

### 5.3. Oferta comercial

**Productos:**

- espresso y bebidas con café;
- bebidas frías;
- pastelería y alimentos;
- café en grano;
- accesorios y merchandising;
- combos y productos estacionales.

**Servicios y canales:**

- consumo en salón;
- reservas de mesas;
- take away;
- pedidos web simulados;
- eventos pequeños;
- venta de productos físicos.

### 5.4. Magnitudes del dataset inicial

El escenario base deberá contener suficientes datos para resultar creíble sin perjudicar el rendimiento:

- 3 sucursales;
- 18 empleados;
- entre 80 y 120 productos base y variantes activas en la demo;
- entre 80 y 150 clientes representativos cargados por sesión a partir de semillas;
- historial agregado equivalente a varias semanas;
- entre 20 y 40 ventas del día ya registradas;
- entre 8 y 15 reservas del día;
- productos con stock normal, bajo y agotado;
- pedidos en estados diversos;
- eventos recientes relacionados entre sí.

Las cifras comerciales visibles podrán representar una empresa mayor que el subconjunto materializado en la sesión. No será necesario copiar 1.840 clientes ni 360 productos completos si una representación parcial mantiene la coherencia visual.

---

## 6. Alcance funcional

### 6.1. Incluido

- presentación inmersiva de ACME Café;
- selección y cambio de perspectiva;
- dashboard gerencial;
- clientes y CRM básico;
- catálogo de productos;
- inventario por sucursal;
- ventas y POS;
- pagos simulados;
- comprobantes y facturación simulada;
- reservas de mesas;
- pedidos web y take away;
- asistente conversacional integrado;
- reportes operativos;
- actividad reciente y explicación de consecuencias;
- personalización visual e idiomas;
- recorrido guiado principal;
- escenarios alternativos y errores controlados;
- impresión o guardado como PDF desde el navegador;
- eventos analíticos del dominio.

### 6.2. Fuera del alcance

- pagos reales;
- conexión real con Mercado Pago, Payway, Stripe o posnets;
- conexión real con ARCA;
- comprobantes fiscales válidos;
- contabilidad formal;
- liquidaciones impositivas;
- sueldos y recursos humanos;
- compras completas a proveedores;
- logística de distribución avanzada;
- marketplace o comercio electrónico productivo;
- carga de imágenes por visitantes;
- envío real de correos, WhatsApp o notificaciones push;
- modelos de inteligencia artificial obligatoriamente conectados a un proveedor externo;
- autenticación real de empleados o clientes;
- conservación de las operaciones de prueba después del vencimiento de la sesión.

---

## 7. Roles y perspectivas

Los roles serán perspectivas de demostración, no usuarios autenticados ni una implementación productiva de autorización.

### 7.1. Gerente

Intereses principales:

- ventas y rentabilidad indicativa;
- comparación de sucursales;
- productos destacados;
- alertas de stock;
- reservas y ocupación;
- desempeño por canal;
- reportes y actividad reciente.

Acciones permitidas:

- consultar todos los módulos;
- cambiar de sucursal;
- explorar reportes;
- observar consecuencias de operaciones;
- modificar algunas configuraciones de demostración.

### 7.2. Cajero o empleado de atención

Intereses principales:

- iniciar y cobrar ventas;
- buscar productos y clientes;
- aplicar cantidades y descuentos permitidos;
- seleccionar canal y forma de pago;
- entregar o imprimir comprobantes;
- consultar pedidos pendientes.

### 7.3. Encargado de stock

Intereses principales:

- existencias por sucursal;
- productos con stock bajo;
- movimientos;
- ajustes y transferencias simples;
- relación entre ventas y disponibilidad.

### 7.4. Cliente

Intereses principales:

- consultar productos y disponibilidad;
- realizar un pedido simulado;
- reservar una mesa;
- consultar o crear una reserva mediante el asistente;
- verificar el estado de un pedido.

### 7.5. Cambio de perspectiva

El control persistente **“Estás explorando como…”** permitirá cambiar de rol sin iniciar sesión. El cambio deberá:

- conservar el estado empresarial de la sesión;
- modificar navegación, acciones y dashboard;
- explicar brevemente la perspectiva seleccionada;
- registrarse como evento analítico;
- permitir observar desde otro rol la consecuencia de una acción ya realizada.

---

## 8. Entrada a la experiencia

La demo no deberá abrir directamente en un dashboard. La portada presentará el mundo y ofrecerá una decisión comprensible:

```text
ACME CAFÉ

Una empresa ficticia.
Un sistema completamente funcional.

Elegí cómo querés explorarlo.

[ Soy gerente ]
[ Soy empleado ]
[ Soy cliente ]
[ Sorprendeme ]
```

Cada opción incluirá una descripción breve:

- **Gerente:** ventas, métricas, stock y operación.
- **Empleado:** atención, pedidos, cobro y comprobantes.
- **Cliente:** compra, reserva y asistencia.
- **Sorprendeme:** recorrido guiado de dos a cuatro minutos.

La pantalla indicará que los datos son ficticios y que la sesión dura una hora.

---

## 9. Arquitectura de información del dominio

```text
ACME Café
├── Inicio / Overview
├── Clientes
├── Ventas / POS
├── Pedidos
├── Productos
├── Stock
├── Reservas
├── Comprobantes
├── Asistente
├── Reportes
└── Actividad
```

La navegación visible dependerá de la perspectiva. Los módulos deberán compartir entidades y estado; no se implementarán como micrositios independientes.

### 9.1. Contexto de sucursal

La barra superior incluirá un selector de sucursal. Según el módulo podrá ofrecer:

- una sucursal específica;
- vista consolidada de todas las sucursales;
- comparación entre sucursales.

El contexto activo deberá ser visible y persistir durante la navegación. Las acciones operativas requerirán una sucursal concreta.

### 9.2. Panel “Lo que ocurrió”

Después de operaciones significativas podrá abrirse un panel lateral con dos niveles:

**Resultado para el negocio:**

```text
✓ Venta registrada
✓ Pago aprobado
✓ Stock actualizado
✓ Comprobante generado
✓ Dashboard actualizado
```

**Vista conceptual opcional:**

```text
Interfaz POS
   ↓
API de ventas
   ↓
Pago simulado
   ↓
Inventario y comprobante
   ↓
Métricas
```

No se mostrarán implementaciones falsas, credenciales ni detalles innecesarios. La vista conceptual explicará desacoplamiento y flujo de datos de forma honesta.

---

## 10. Modos de exploración

### 10.1. Exploración libre

El visitante podrá utilizar cualquier módulo habilitado para su perspectiva, cometer errores, cambiar datos y reiniciar la demostración.

### 10.2. Recorrido guiado

Presentará objetivos breves, contexto empresarial y validación de acciones. Deberá poder pausarse o abandonarse sin perder las operaciones realizadas.

### 10.3. Escenarios preparados

El visitante podrá comenzar desde estados diseñados para mostrar una capacidad concreta:

- mañana operativa normal;
- producto con stock crítico;
- venta con pago rechazado y reintento;
- reserva para grupo;
- pedido web pendiente;
- cliente frecuente;
- tarde con alta ocupación.

### 10.4. Modo explicativo

Un control discreto **“Ver detrás del sistema”** añadirá explicaciones conceptuales a las operaciones principales. Estará desactivado por defecto y no interrumpirá el uso normal.

---

## 11. Dashboard gerencial

### 11.1. Objetivo

Mostrar el estado del negocio y reaccionar a las operaciones realizadas durante la sesión.

### 11.2. Indicadores principales

- ventas del día;
- cantidad de tickets;
- ticket promedio;
- ventas por sucursal;
- ventas por canal;
- reservas del día;
- ocupación estimada;
- pedidos pendientes;
- productos con stock bajo;
- pagos rechazados o pendientes simulados;
- clientes nuevos o recurrentes.

### 11.3. Visualizaciones

- ventas por hora;
- comparación entre sucursales;
- distribución por canal;
- productos más vendidos;
- evolución resumida de tickets;
- alertas que requieren atención;
- actividad reciente.

Los gráficos deberán derivarse de datos coherentes. Una venta realizada por el visitante modificará los indicadores correspondientes sin necesidad de recargar toda la aplicación.

### 11.4. Vista inicial de referencia

```text
Buenos días.

ACME Café · Palermo
─────────────────────────────────
Ventas hoy          $ 1.284.500
Tickets                     187
Ticket promedio         $ 6.869
Reservas                     24

Ventas por hora
[ gráfico ]

Necesita atención
⚠ 4 productos con stock bajo
⚠ 2 pagos rechazados
● 8 reservas para esta tarde
```

Los valores definitivos serán datos ficticios configurables y respetarán el formato regional seleccionado.

---

## 12. Clientes y CRM

### 12.1. Capacidades

- listar y buscar clientes;
- filtrar por sucursal preferida, estado y segmento;
- crear un cliente ficticio;
- editar datos básicos;
- consultar historial de compras y reservas;
- observar gasto acumulado y frecuencia;
- registrar notas internas breves;
- identificar clientes nuevos, frecuentes o inactivos;
- iniciar una venta o reserva desde la ficha.

### 12.2. Ficha de cliente

La ficha incluirá:

- nombre ficticio;
- información de contacto simulada;
- sucursal habitual;
- preferencias declaradas;
- historial de ventas;
- reservas;
- pedidos;
- actividad reciente;
- indicadores simples de relación.

### 12.3. Reglas

- No se requerirá documento real ni información sensible.
- Los datos ingresados permanecerán únicamente durante la sesión.
- Un cliente podrá existir sin cuenta de acceso.
- La búsqueda deberá tolerar nombre parcial, teléfono ficticio, correo ficticio o identificador.
- Los posibles duplicados producirán una advertencia, no un bloqueo absoluto.

---

## 13. Productos y catálogo

### 13.1. Entidades principales

- producto;
- categoría;
- variante;
- modificador;
- lista de precios;
- impuesto simulado;
- disponibilidad por sucursal;
- receta o consumo de insumos simplificado, opcional.

### 13.2. Capacidades

- búsqueda por nombre, categoría o código;
- visualización de precio y disponibilidad;
- variantes de tamaño o presentación;
- estado activo, temporalmente no disponible o discontinuado;
- productos destacados y estacionales;
- actualización simple de precio o disponibilidad desde perspectiva gerencial;
- relación con stock y ventas.

### 13.3. Dataset representativo

Se incluirán productos que permitan demostrar casos distintos:

- bebidas preparadas con variantes;
- alimentos con disponibilidad diaria;
- café en grano con stock unitario;
- accesorios con inventario físico;
- combos;
- producto agotado en una sucursal pero disponible en otra;
- producto con stock bajo;
- producto temporalmente deshabilitado.

---

## 14. Inventario y stock

### 14.1. Capacidades

- existencias por producto, variante y sucursal;
- stock disponible, reservado y físico;
- umbral de reposición;
- listado de stock bajo o agotado;
- historial de movimientos;
- ajuste manual con motivo;
- transferencia simple entre sucursales;
- impacto automático de ventas y cancelaciones;
- consulta de disponibilidad desde POS y asistente.

### 14.2. Tipos de movimiento

- venta;
- cancelación o devolución simulada;
- reserva de producto;
- liberación de reserva;
- ajuste positivo o negativo;
- transferencia de salida;
- transferencia de entrada;
- carga inicial del escenario.

### 14.3. Reglas de disponibilidad

- El stock disponible será el stock físico menos las unidades reservadas.
- Una venta confirmada descontará stock según la sucursal operativa.
- No se permitirá confirmar una cantidad superior al stock disponible, salvo en productos configurados sin control unitario.
- Una transferencia generará movimientos relacionados en origen y destino.
- Los productos preparados podrán utilizar disponibilidad simplificada sin implementar un sistema completo de recetas.
- Los movimientos nunca se editarán; un error se corregirá mediante un movimiento compensatorio.

---

## 15. Ventas y POS

### 15.1. Objetivo

El POS será el circuito principal de la demostración porque conecta cliente, producto, inventario, pago, comprobante y métricas.

### 15.2. Flujo principal

1. seleccionar sucursal y caja;
2. buscar o elegir productos;
3. seleccionar variantes y modificadores;
4. modificar cantidades;
5. asociar un cliente, opcionalmente;
6. elegir canal: salón, mostrador, take away o pedido web;
7. revisar subtotal, descuentos e impuestos simulados;
8. iniciar cobro;
9. seleccionar medio de pago;
10. ejecutar un resultado simulado;
11. confirmar venta;
12. actualizar stock, cliente, comprobante, dashboard y actividad.

### 15.3. Estados de venta

```text
BORRADOR
  ├── CANCELADA
  └── PENDIENTE_DE_PAGO
          ├── PAGO_RECHAZADO
          │       └── PENDIENTE_DE_PAGO
          └── PAGADA
                  ├── COMPLETADA
                  └── ANULADA
```

### 15.4. Comportamientos esperados

- El carrito conservará sus datos al navegar dentro del POS.
- El sistema advertirá cambios de precio o stock antes de cobrar.
- Los totales se recalcularán inmediatamente.
- Una venta no afectará stock hasta alcanzar el estado configurado de confirmación.
- Los botones críticos evitarán doble ejecución.
- El resultado del cobro mostrará una secuencia breve y creíble.
- Tras completar la venta se ofrecerá ver el comprobante, revisar el stock o abrir el panel de consecuencias.

---

## 16. Pagos simulados

### 16.1. Medios disponibles

- efectivo;
- tarjeta de débito;
- tarjeta de crédito;
- billetera o QR;
- pago dividido, opcional en una fase posterior.

### 16.2. Simulación de terminal

Para tarjeta o billetera se mostrará una terminal visual dentro de la interfaz:

```text
Conectando terminal…
Tarjeta detectada
Procesando pago…
Pago aprobado
```

No existirá conexión con un proveedor real. El backend seleccionará un resultado entre casos controlados.

### 16.3. Casos precalculados

| Caso | Resultado | Propósito |
|---|---|---|
| aprobación inmediata | aprobado | recorrido principal |
| fondos insuficientes | rechazado | recuperación y nuevo medio |
| operación duplicada | advertencia | idempotencia visible |
| terminal demorada | pendiente breve | estado de procesamiento |
| terminal desconectada | error recuperable | pago alternativo |
| QR vencido | rechazado | regeneración del intento |

El recorrido guiado utilizará un resultado predecible. En exploración libre, el visitante podrá elegir un escenario desde controles de demostración o recibir una secuencia determinista según la semilla de sesión.

### 16.4. Reglas

- Un intento rechazado no confirmará la venta ni descontará stock.
- Reintentar generará un nuevo intento relacionado con la misma venta.
- Una aprobación solo podrá aplicarse una vez.
- El efectivo permitirá ingresar importe recibido y calcular vuelto.
- La interfaz indicará de forma visible que no se procesan fondos reales.

---

## 17. Comprobantes y facturación simulada

### 17.1. Alcance

La demostración generará comprobantes comerciales ficticios. Podrá representar una factura o ticket, pero no tendrá validez fiscal ni se conectará con ARCA.

### 17.2. Flujo

```text
Venta pagada
   ↓
Solicitud de emisión simulada
   ↓
Respuesta precalculada
   ↓
Número ficticio y datos de autorización simulados
   ↓
Vista HTML imprimible
```

### 17.3. Casos simulados

- emisión aprobada;
- datos de cliente incompletos;
- servicio fiscal demorado;
- servicio temporalmente no disponible;
- reintento exitoso;
- comprobante ya emitido.

### 17.4. Contenido

- marca visible **“DOCUMENTO DE DEMOSTRACIÓN – SIN VALIDEZ FISCAL”**;
- datos ficticios de ACME Café;
- sucursal y punto de venta ficticios;
- fecha y hora;
- identificador de venta;
- cliente, si fue asociado;
- detalle de productos;
- importes e impuestos simulados;
- medio de pago;
- numeración y autorización ficticias cuando corresponda.

### 17.5. Entrega

El comprobante se mostrará en una vista HTML con estilos de impresión. El diálogo nativo del navegador permitirá imprimirlo o guardarlo como PDF. No se generará ni almacenará un archivo en el backend.

---

## 18. Reservas

### 18.1. Perspectiva del cliente

Flujo propuesto:

1. seleccionar sucursal;
2. elegir fecha;
3. indicar cantidad de personas;
4. consultar horarios disponibles;
5. ingresar nombre y contacto ficticios;
6. declarar una preferencia opcional;
7. confirmar;
8. recibir identificador y resumen.

### 18.2. Perspectiva del negocio

- agenda diaria y semanal;
- capacidad por franja horaria;
- filtros por estado y sucursal;
- reservas próximas;
- creación manual;
- confirmación, llegada, cancelación y ausencia;
- asignación simple de mesa o sector;
- observaciones.

### 18.3. Estados

```text
PENDIENTE
  ├── CONFIRMADA
  │      ├── PRESENTE
  │      │      └── FINALIZADA
  │      ├── AUSENTE
  │      └── CANCELADA
  └── CANCELADA
```

### 18.4. Reglas

- La disponibilidad dependerá de sucursal, fecha, franja y cantidad de personas.
- No se implementará optimización completa de mesas; se utilizará capacidad configurada por franja.
- Una reserva creada desde el asistente deberá aparecer en la agenda administrativa.
- Un horario agotado ofrecerá alternativas cercanas.
- La cancelación liberará capacidad inmediatamente.
- Fechas y horarios respetarán el idioma y la zona horaria de la plataforma.

---

## 19. Pedidos web y take away

### 19.1. Capacidades

- catálogo orientado a cliente;
- selección de sucursal de retiro;
- carrito;
- horario de retiro estimado;
- pago simulado;
- confirmación del pedido;
- tablero operativo de preparación;
- cambio de estado;
- consulta del estado desde cliente o asistente.

### 19.2. Estados

```text
CREADO
  ├── CANCELADO
  └── PAGADO
         └── EN_PREPARACIÓN
                └── LISTO_PARA_RETIRAR
                       └── ENTREGADO
```

### 19.3. Sincronización visible

Cuando el cliente confirme un pedido, deberá aparecer en el tablero operativo de la misma sesión. Cambiarlo a **Listo para retirar** deberá reflejarse en la vista de cliente y en el asistente.

No se enviarán notificaciones reales. La interfaz podrá mostrar una notificación simulada como consecuencia del cambio.

---

## 20. Asistente conversacional integrado

### 20.1. Objetivo

El asistente deberá consultar y operar sobre el estado de ACME Café. No será un chat decorativo ni un generador de respuestas desconectado del sistema.

### 20.2. Capacidades iniciales

- consultar productos y precios;
- consultar stock por sucursal;
- buscar alternativas cuando un producto esté agotado;
- consultar horarios;
- crear una reserva;
- consultar una reserva creada en la sesión;
- consultar el estado de un pedido;
- recomendar productos desde un catálogo controlado;
- explicar políticas ficticias básicas.

### 20.3. Implementación base

La primera versión no requerirá un proveedor externo de IA. Utilizará:

- intenciones y entidades reconocibles;
- ejemplos de frases en los idiomas soportados;
- respuestas controladas;
- llamadas a funciones internas del dominio;
- aclaraciones cuando falten datos;
- respuestas de fallback honestas.

```text
Interfaz de chat
   ↓
Motor conversacional de demo
   ├── buscarProductos()
   ├── consultarStock()
   ├── crearReserva()
   ├── consultarReserva()
   └── consultarPedido()
          ↓
       Backend ACME Café
```

Un modelo externo podrá evaluarse en una evolución posterior, sin modificar las funciones internas ni las reglas de negocio.

### 20.4. Ejemplo conectado

```text
Visitante:
¿Todavía tienen Colombia Huila?

Asistente:
En Palermo está agotado. Quedan 6 unidades en Belgrano
y 3 en San Isidro.

Visitante:
Reservame una en Belgrano para hoy.

Asistente:
Perfecto. Creé la reserva R-183, pendiente de retiro.
```

La disponibilidad respondida deberá coincidir con el módulo de stock. La reserva creada deberá ser visible fuera del chat.

### 20.5. Límites

- No se responderán consultas ajenas al escenario.
- No se afirmará que el asistente es una persona.
- No se solicitarán datos sensibles.
- Las acciones con efecto pedirán confirmación cuando sea razonable.
- El fallback ofrecerá ejemplos de consultas admitidas.

---

## 21. Reportes

### 21.1. Reportes previstos

- ventas por período;
- ventas por sucursal;
- ventas por canal;
- medios de pago;
- productos más vendidos;
- productos con stock bajo;
- movimientos de inventario;
- reservas por franja;
- pedidos por estado;
- clientes frecuentes.

### 21.2. Interacción

- filtros por fecha y sucursal;
- comparación simple;
- tabla y gráfico relacionados;
- actualización después de operaciones de la sesión;
- exportación visual o impresión solo cuando aporte valor.

Los reportes no pretenderán constituir una herramienta de inteligencia empresarial completa. Su objetivo será demostrar agregación, filtros, visualización y consistencia de datos.

---

## 22. Actividad y trazabilidad funcional

La demo mantendrá una línea de actividad comprensible para el visitante:

```text
10:42 Venta V-1048 iniciada
10:43 Pago con tarjeta aprobado
10:43 Stock actualizado en Palermo
10:43 Comprobante DEMO-18472 emitido
10:45 Reserva R-183 creada por el asistente
```

Cada entrada deberá incluir:

- timestamp de simulación;
- actor o perspectiva;
- acción;
- entidad relacionada;
- resultado;
- enlace al elemento cuando corresponda.

Esta actividad no sustituye logs técnicos ni auditoría productiva. Es una herramienta narrativa y funcional de la demo.

---

## 23. Recorrido guiado principal

### 23.1. Premisa

> Son las 10:42 en ACME Palermo. Un cliente acaba de pedir dos flat whites y una bolsa de café Colombia Huila.

### 23.2. Secuencia

1. **Crear la venta:** agregar los productos desde el POS.
2. **Asociar el cliente:** seleccionar un cliente frecuente.
3. **Cobrar:** ejecutar un pago aprobado simulado.
4. **Observar consecuencias:** revisar venta, stock y comprobante.
5. **Cambiar a gerente:** comprobar la actualización del dashboard.
6. **Consultar al asistente:** preguntar por Colombia Huila.
7. **Crear una reserva de producto:** reservar una unidad en otra sucursal.
8. **Cerrar recorrido:** mostrar resumen de capacidades y CTA contextual.

### 23.3. Hitos visibles

```text
1 de 5 · Prepará el pedido
2 de 5 · Procesá el pago
3 de 5 · Revisá lo que cambió
4 de 5 · Consultá otra sucursal
5 de 5 · Observá la operación como gerente
```

La agrupación visual podrá condensar pasos técnicos sin ocultar el flujo real.

### 23.4. Final

El resumen indicará:

- módulos utilizados;
- efectos producidos;
- perspectivas visitadas;
- capacidades demostradas;
- acceso a exploración libre;
- CTA: **“¿Necesitás digitalizar ventas, stock o atención en tu negocio?”**

---

## 24. Escenarios alternativos y errores

La demo deberá incluir errores diseñados, con recuperación clara:

| Escenario | Resultado esperado |
|---|---|
| stock insuficiente | impedir confirmación y ofrecer otra sucursal o producto |
| pago rechazado | conservar venta y permitir otro medio |
| terminal desconectada | mostrar error recuperable y alternativa |
| emisión fiscal simulada demorada | completar venta y permitir reintento del comprobante |
| horario de reserva completo | ofrecer horarios cercanos |
| cliente posiblemente duplicado | advertir y permitir revisar |
| pedido ya entregado | impedir transición inválida |
| consulta no comprendida por el asistente | explicar límites y sugerir ejemplos |

Los errores deberán parecer parte de un producto bien diseñado, no fallos técnicos accidentales.

---

## 25. Actividad simulada

Para reforzar la sensación de empresa activa podrán generarse eventos locales controlados:

- nueva reserva;
- pedido web recibido;
- producto que alcanza stock bajo;
- pedido listo para retirar;
- actualización de un indicador;
- actividad reciente de otra sucursal.

Los eventos se producirán mediante una secuencia determinista basada en la semilla de sesión. No requerirán conexiones en tiempo real ni procesos externos. Deberán pausarse cuando interfieran con un recorrido guiado y no modificar entidades que el visitante esté editando.

---

## 26. Personalización visual e idiomas

### 26.1. Identidades visuales

Además de los temas claro y oscuro de la plataforma, ACME Café permitirá demostrar variaciones controladas:

- **ACME Classic:** cálida y artesanal;
- **Minimal:** neutral y limpia;
- **Corporate:** sobria y estructurada;
- **Dark:** optimizada para superficies oscuras.

Podrá ofrecerse selección de color principal y densidad cómoda o compacta. La personalización modificará tokens visuales, no la arquitectura de la experiencia ni la accesibilidad.

### 26.2. Marca editable de demostración

Un panel **“Personalizar demo”** podrá permitir cambiar de forma efímera:

- nombre visible del negocio;
- color principal entre opciones seguras;
- estilo;
- densidad;
- idioma.

El objetivo será demostrar adaptabilidad, no construir un editor de temas completo.

### 26.3. Idiomas

ACME Café soportará inicialmente:

- español;
- inglés;
- portugués.

Se localizarán:

- interfaz;
- productos descriptivos relevantes;
- fechas, horas, números y moneda;
- mensajes del POS;
- casos de pago y comprobante;
- asistente conversacional;
- contenido imprimible;
- recorrido guiado.

El cambio de idioma deberá conservar el módulo, la perspectiva y el estado de la sesión.

---

## 27. Diseño visual y UX

### 27.1. Identidad

ACME Café utilizará una paleta cálida inspirada en café, crema y materiales naturales, con un color de acción claramente accesible. La estética será contemporánea; evitará clichés excesivamente rústicos.

### 27.2. Layout desktop

- barra lateral para módulos;
- barra superior con sucursal, rol, sesión, idioma y tema;
- área principal flexible;
- panel contextual o de consecuencias a la derecha;
- tablas y tableros con densidad regulable;
- modal o panel específico para terminal de pago;
- chat lateral o vista dedicada según el módulo.

### 27.3. Microinteracciones

- skeletons breves;
- totales que se actualizan;
- estados visibles de procesamiento;
- toasts relacionados con consecuencias;
- transiciones entre pasos de cobro;
- actualización de gráficos;
- timestamps relativos;
- foco y selección claros;
- confirmaciones solo cuando eviten pérdida o efectos relevantes.

### 27.4. Estados obligatorios

Cada módulo deberá contemplar:

- carga;
- vacío;
- resultados sin coincidencias;
- error recuperable;
- error definitivo;
- datos desactualizados, si aplica;
- operación exitosa;
- permisos limitados por perspectiva.

---

## 28. Reglas de negocio transversales

1. Toda operación estará asociada a una sesión de demo.
2. Toda operación operativa estará asociada a una sucursal.
3. Las cantidades monetarias se almacenarán en unidades mínimas y con moneda explícita.
4. Los timestamps se persistirán en UTC y se presentarán según locale.
5. Una venta pagada no podrá recibir una segunda aprobación válida.
6. El stock no podrá quedar negativo en productos controlados.
7. Una transición inválida deberá rechazarse con explicación comprensible.
8. Las cancelaciones generarán efectos compensatorios, no eliminación silenciosa.
9. El comprobante ficticio deberá conservar coherencia con la venta que representa.
10. Las consultas del asistente deberán leer el mismo estado que los módulos visuales.
11. Los eventos automáticos no podrán invalidar un flujo guiado en curso.
12. Reiniciar la demo restaurará el escenario base de la sesión.
13. Al vencer la hora de sesión no se conservarán operaciones funcionales.
14. Las métricas de interacción se registrarán separadas del estado descartable.

---

## 29. Modelo de datos conceptual

### 29.1. Entidades

```text
DemoSession
Branch
Employee
Customer
Product
ProductVariant
Category
Price
InventoryBalance
InventoryMovement
Sale
SaleItem
PaymentAttempt
Receipt
Reservation
Order
OrderItem
Conversation
ConversationMessage
BusinessEvent
```

### 29.2. Relaciones principales

```text
DemoSession
 ├── Customers
 ├── Sales
 │    ├── SaleItems ── ProductVariant
 │    ├── PaymentAttempts
 │    └── Receipt
 ├── InventoryMovements ── InventoryBalance
 ├── Reservations ── Customer / Branch
 ├── Orders
 │    └── OrderItems ── ProductVariant
 ├── Conversations
 │    └── ConversationMessages
 └── BusinessEvents

Branch
 ├── Employees
 ├── InventoryBalances
 ├── Sales
 ├── Reservations
 └── Orders
```

### 29.3. Alcance de sesión

Las entidades mutables creadas o modificadas durante la demo estarán asociadas a `demoSessionId`. Los catálogos semilla podrán materializarse por sesión o combinar una definición inmutable con deltas de sesión.

La implementación deberá impedir que una consulta o mutación acceda al estado de otra sesión.

### 29.4. Identificadores visibles

Los identificadores públicos serán legibles y ficticios, por ejemplo:

```text
V-1048       venta
P-2198       pedido
R-183        reserva
DEMO-18472   comprobante
```

No se utilizarán como claves de seguridad ni permitirán enumerar datos de otras sesiones.

---

## 30. Arquitectura del dominio

### 30.1. Módulos de backend

```text
acme-cafe
├── customers
├── catalog
├── inventory
├── sales
├── payments-simulation
├── receipts-simulation
├── reservations
├── orders
├── assistant
├── reports
├── activity
└── seed-scenarios
```

Los módulos formarán parte del backend modular de la plataforma. No se desplegarán como microservicios independientes.

### 30.2. Dependencias permitidas

- `sales` consulta catálogo, inventario y clientes;
- `payments-simulation` procesa intentos para una venta;
- `receipts-simulation` emite sobre una venta confirmada;
- `inventory` recibe movimientos derivados de ventas y cancelaciones;
- `reservations` administra capacidad por sucursal;
- `orders` reutiliza catálogo, pagos e inventario;
- `assistant` invoca servicios públicos internos de catálogo, stock, reservas y pedidos;
- `reports` consulta proyecciones o agregados del estado de la sesión;
- `activity` recibe eventos funcionales de los demás módulos.

Se evitarán dependencias circulares. Las consecuencias de una operación deberán coordinarse en una transacción o servicio de aplicación cuando sea necesario mantener consistencia.

### 30.3. API de referencia

```text
GET    /api/v1/demo/acme-cafe/overview
GET    /api/v1/demo/acme-cafe/customers
POST   /api/v1/demo/acme-cafe/customers
GET    /api/v1/demo/acme-cafe/products
GET    /api/v1/demo/acme-cafe/inventory
POST   /api/v1/demo/acme-cafe/inventory/adjustments
POST   /api/v1/demo/acme-cafe/sales
POST   /api/v1/demo/acme-cafe/sales/{id}/payment-attempts
POST   /api/v1/demo/acme-cafe/sales/{id}/complete
GET    /api/v1/demo/acme-cafe/sales/{id}/receipt
GET    /api/v1/demo/acme-cafe/reservations
POST   /api/v1/demo/acme-cafe/reservations
POST   /api/v1/demo/acme-cafe/orders
PATCH  /api/v1/demo/acme-cafe/orders/{id}/status
POST   /api/v1/demo/acme-cafe/assistant/messages
GET    /api/v1/demo/acme-cafe/reports/{report}
GET    /api/v1/demo/acme-cafe/activity
POST   /api/v1/demo/acme-cafe/reset
```

La lista es orientativa. Los contratos definitivos se formalizarán en OpenAPI.

---

## 31. Sesión, semillas y persistencia

### 31.1. Inicio

Al abrir ACME Café, la plataforma creará o reutilizará una sesión vigente y cargará un escenario semilla. La sesión tendrá una duración fija de una hora desde su creación.

### 31.2. Semillas

Las semillas deberán ser:

- deterministas;
- versionadas;
- coherentes entre módulos;
- traducibles cuando corresponda;
- rápidas de materializar;
- libres de datos personales reales.

Cada escenario definirá:

- reloj inicial;
- sucursal activa;
- rol sugerido;
- clientes y productos relevantes;
- stock;
- ventas previas;
- reservas;
- pedidos;
- casos simulados disponibles;
- secuencia de actividad automática.

### 31.3. Persistencia temporal

Las operaciones realizadas permanecerán disponibles durante la sesión y sobrevivirán a una recarga del navegador. No deberán conservarse después de la limpieza diaria de sesiones vencidas.

### 31.4. Reinicio

El control **“Restablecer demostración”** pedirá confirmación y reconstruirá el escenario inicial. El reinicio no eliminará las métricas ya registradas, pero descartará las entidades funcionales creadas durante la sesión.

---

## 32. Métricas específicas

Además de la analítica común de la plataforma se registrarán, sin almacenar contenido libre:

```text
acme_cafe_started
acme_cafe_role_selected
acme_cafe_branch_changed
acme_cafe_sale_started
acme_cafe_sale_completed
acme_cafe_payment_result_viewed
acme_cafe_receipt_viewed
acme_cafe_receipt_printed
acme_cafe_inventory_viewed
acme_cafe_reservation_created
acme_cafe_order_created
acme_cafe_order_status_changed
acme_cafe_assistant_started
acme_cafe_assistant_intent_used
acme_cafe_guided_tour_completed
acme_cafe_theme_changed
acme_cafe_demo_reset
```

Dimensiones permitidas:

- rol;
- módulo;
- sucursal;
- idioma;
- estilo visual;
- escenario;
- resultado categórico;
- paso del recorrido;
- duración agregada.

No se almacenarán mensajes completos del asistente, nombres ingresados, notas ni contenido de ventas como parte de la analítica permanente.

El panel interno de la plataforma deberá permitir comparar inicio, interacción significativa, finalización de recorrido y CTA posterior para ACME Café.

---

## 33. Requisitos no funcionales del dominio

### 33.1. Rendimiento

- El dashboard deberá ser utilizable dentro del objetivo general de carga de demo.
- Búsquedas comunes deberán responder de forma perceptiblemente inmediata.
- Agregar productos y recalcular el carrito deberá producir feedback en menos de 100 ms en el frontend.
- Las mutaciones comunes deberán respetar los objetivos de API de la plataforma.
- Gráficos, chat y terminal simulada se cargarán bajo demanda cuando reduzca el peso inicial.
- La actividad automática no deberá degradar la interacción principal.

### 33.2. Accesibilidad

- POS, tablas, reservas, chat y gráficos deberán ser navegables por teclado.
- La terminal de pago simulada no dependerá de gestos.
- Los cambios de estado se anunciarán de forma accesible.
- Los gráficos tendrán resumen textual o tabla equivalente.
- Los indicadores no dependerán solo del color.
- Los pasos guiados conservarán foco lógico.
- El comprobante imprimible mantendrá orden de lectura correcto.

### 33.3. Compatibilidad

Se aplicarán los navegadores y viewports definidos por la plataforma. La experiencia primaria será desktop landscape. Una vista reducida podrá permitir recorridos simples, pero no será requisito reproducir todo el POS o dashboard en mobile durante la primera versión.

### 33.4. Integridad

- no habrá ventas pagadas sin intento aprobado o efectivo confirmado;
- no habrá movimientos sin entidad y motivo relacionados;
- no habrá reservas por encima de capacidad sin advertencia explícita;
- no habrá discrepancias entre disponibilidad mostrada por stock, POS y asistente;
- el comprobante deberá coincidir con los totales de venta.

---

## 34. Estrategia de pruebas

### 34.1. Unitarias

- cálculo de totales;
- disponibilidad de stock;
- movimientos compensatorios;
- transiciones de venta, pedido y reserva;
- capacidad por franja;
- selección de casos simulados;
- resolución de intenciones del asistente;
- agregados de reportes.

### 34.2. Integración

- venta completa con inventario y comprobante;
- reintento de pago;
- cancelación y compensación de stock;
- reserva desde interfaz y asistente;
- pedido web reflejado en tablero;
- cambio de estado reflejado en cliente;
- reinicio de escenario;
- aislamiento entre sesiones.

### 34.3. End-to-end

1. entrar como empleado y completar una venta;
2. provocar un pago rechazado y recuperarlo;
3. verificar actualización de stock y dashboard;
4. imprimir o guardar como PDF el comprobante ficticio desde el navegador;
5. crear una reserva como cliente y verla como gerente;
6. consultar stock y crear una reserva mediante el asistente;
7. iniciar un pedido web y marcarlo listo;
8. cambiar idioma, tema y perspectiva conservando estado;
9. completar el recorrido “Sorprendeme”;
10. reiniciar la demo;
11. verificar expiración al cumplirse una hora.

### 34.4. Pruebas visuales

- dashboard en temas y estilos disponibles;
- POS con carrito vacío, completo y con error;
- terminal en todos sus estados;
- agenda con distinta ocupación;
- panel de consecuencias;
- chat en los tres idiomas;
- comprobante imprimible;
- resoluciones desktop mínimas y de referencia.

---

## 35. Roadmap de implementación de ACME Café

### Fase 1 — Fundaciones del dominio

- módulos y rutas;
- esquema de datos;
- semillas de sucursales, productos y clientes;
- selección de rol y sucursal;
- navegación y shell visual;
- actividad básica.

### Fase 2 — Circuito principal

- catálogo;
- stock;
- POS;
- pagos simulados;
- comprobante ficticio;
- panel de consecuencias;
- actualización del dashboard.

### Fase 3 — Operación ampliada

- CRM;
- reservas;
- pedidos web y tablero;
- reportes;
- escenarios de error.

### Fase 4 — Asistente y continuidad

- motor conversacional controlado;
- consultas de producto y stock;
- reservas y pedidos mediante funciones internas;
- coherencia entre chat y módulos.

### Fase 5 — Inmersión y personalización

- recorrido guiado;
- actividad automática determinista;
- modo explicativo;
- estilos y densidades;
- ES, EN y PT;
- microinteracciones y pulido.

### Fase 6 — Validación

- accesibilidad;
- pruebas end-to-end;
- aislamiento de sesiones;
- rendimiento;
- métricas;
- contenido y CTA contextual;
- validación completa en staging.

---

## 36. Criterios de aceptación

### 36.1. Mundo y navegación

- [ ] ACME Café se presenta como una empresa ficticia coherente con tres sucursales.
- [ ] La entrada ofrece Gerente, Empleado, Cliente y Sorprendeme.
- [ ] El visitante puede cambiar de perspectiva sin perder el estado de negocio.
- [ ] El contexto de sucursal es visible y consistente.
- [ ] La navegación presenta solo los módulos pertinentes para cada perspectiva.
- [ ] La demostración informa que los datos son ficticios y la sesión dura una hora.

### 36.2. Venta integrada

- [ ] El visitante puede crear una venta con productos y variantes.
- [ ] Puede asociar opcionalmente un cliente.
- [ ] Los totales se calculan correctamente.
- [ ] Puede ejecutar al menos un pago aprobado y uno rechazado.
- [ ] Un pago rechazado no descuenta stock ni completa la venta.
- [ ] Una venta confirmada actualiza stock, cliente, actividad y dashboard.
- [ ] La doble confirmación no duplica efectos.
- [ ] El panel “Lo que ocurrió” explica las consecuencias.

### 36.3. Stock y catálogo

- [ ] La disponibilidad se mantiene por sucursal.
- [ ] POS, inventario y asistente muestran valores coherentes.
- [ ] El sistema impide vender stock insuficiente en productos controlados.
- [ ] Se pueden registrar ajustes con motivo.
- [ ] Una transferencia simple genera movimientos relacionados.
- [ ] Los estados bajo, agotado y disponible son accesibles y comprensibles.

### 36.4. Comprobantes

- [ ] Una venta pagada permite ver un comprobante ficticio coherente.
- [ ] El documento indica de forma prominente que no tiene validez fiscal.
- [ ] Puede imprimirse o guardarse como PDF desde el navegador sin almacenamiento permanente.
- [ ] Al menos un caso de emisión demorada o fallida puede demostrarse.
- [ ] No existe comunicación real con ARCA.

### 36.5. Reservas y pedidos

- [ ] Un cliente puede crear y cancelar una reserva.
- [ ] La reserva aparece en la agenda del negocio.
- [ ] La capacidad y las alternativas horarias se comportan según las reglas.
- [ ] Un pedido web aparece en el tablero operativo.
- [ ] Cambiar el estado del pedido se refleja en la perspectiva del cliente.
- [ ] No se envían comunicaciones reales.

### 36.6. Asistente

- [ ] El asistente consulta catálogo y stock reales de la sesión.
- [ ] Puede crear una reserva visible en el módulo correspondiente.
- [ ] Puede consultar un pedido creado durante la sesión.
- [ ] Los casos no comprendidos ofrecen ayuda útil.
- [ ] No depende obligatoriamente de una API externa de IA.
- [ ] No almacena mensajes libres en la analítica permanente.

### 36.7. Reportes y dashboard

- [ ] Los indicadores se derivan de datos coherentes.
- [ ] Una venta realizada modifica las métricas pertinentes.
- [ ] Existen filtros por sucursal y período donde corresponda.
- [ ] Los gráficos tienen alternativa textual o tabular.
- [ ] La actividad enlaza entidades relevantes.

### 36.8. Personalización e idiomas

- [ ] ACME Classic, Minimal, Corporate y Dark aplican cambios consistentes.
- [ ] La densidad puede alternarse sin pérdida funcional.
- [ ] Español, inglés y portugués cubren los flujos principales.
- [ ] Fechas, números y moneda respetan el locale.
- [ ] Cambiar idioma o estilo conserva rol, módulo y estado.
- [ ] Todos los estilos cumplen los contrastes acordados.

### 36.9. Sesiones y datos

- [ ] Cada visitante trabaja con datos aislados.
- [ ] El estado sobrevive a una recarga durante la hora de vigencia.
- [ ] Reiniciar restaura la semilla sin afectar métricas permanentes.
- [ ] Una sesión vencida no permite nuevas operaciones.
- [ ] La limpieza diaria elimina el estado funcional vencido.
- [ ] Los datos semilla pueden reconstruirse sin respaldo.

### 36.10. Calidad

- [ ] El recorrido principal puede completarse sin explicación externa.
- [ ] Los escenarios de error permiten recuperación clara.
- [ ] Los flujos críticos tienen pruebas end-to-end.
- [ ] No existen errores críticos de accesibilidad conocidos.
- [ ] La demo cumple los objetivos de rendimiento de la plataforma.
- [ ] Los eventos analíticos definidos se registran sin contenido sensible.

---

## 37. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Demasiados módulos superficiales | Sensación de maqueta | Priorizar circuito de venta y continuidad antes de ampliar |
| Datos incoherentes entre módulos | Pérdida de credibilidad | Servicios de dominio compartidos y pruebas de integración |
| Simulaciones demasiado obvias | Menor inmersión | Demoras breves, casos variados y consecuencias coherentes |
| Exceso de actividad automática | Distracción | Secuencia controlada, pausa durante edición y configuración por escenario |
| Chatbot rígido | Frustración | Sugerencias visibles, intenciones acotadas y fallback útil |
| Personalización excesiva | Retraso del núcleo funcional | Variaciones basadas en tokens y opciones cerradas |
| POS demasiado complejo | Recorrido largo | Flujo principal breve y funciones secundarias progresivas |
| Confusión sobre validez fiscal | Riesgo reputacional | Marcas visibles de demostración y ausencia de integración real |
| Métricas con datos libres | Riesgo de privacidad | Eventos categóricos sin nombres, mensajes ni notas |

---

## 38. Decisiones de implementación

Quedan cerradas por la plataforma y el catálogo de simulaciones:

1. stack concreto ya seleccionado por la plataforma;
2. impresión documental mediante vistas HTML y diálogo nativo del navegador;
3. motor conversacional determinista sin proveedor externo;
4. escenarios P0, P1 y P2 de pagos, facturación y conversación definidos en `docs/architecture/CATALOGO_ESCENARIOS_SIMULADOS.md`.

Permanecen como decisiones de contenido o implementación del dominio:

1. profundidad de recetas e insumos para productos preparados;
2. motor de gráficos;
3. contenido y nomenclatura final de productos;
4. estilo visual inicial y tokens de ACME Classic;
5. indicadores definitivos del dashboard;
6. CTA contextual por módulo.

Estas decisiones deberán mantener el alcance y la simplicidad establecidos en este documento.

---

## 39. Control de cambios

La versión 1.1 incorpora las decisiones transversales de la Ronda 4 sobre escenarios simulados, motor conversacional e impresión. Todo cambio que altere módulos, recorridos principales, reglas transversales, sesiones, integraciones simuladas o criterios de aceptación deberá registrarse con descripción, motivación, impacto y versión.

Las capacidades compartidas continuarán regidas por la especificación general de plataforma. Ante una contradicción, deberá resolverse explícitamente cuál documento requiere actualización, sin introducir excepciones implícitas.

---

**Fin del documento.**
