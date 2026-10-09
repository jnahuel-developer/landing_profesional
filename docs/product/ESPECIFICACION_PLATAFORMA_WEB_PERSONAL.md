# Especificación funcional y técnica de la plataforma web personal

**Proyecto:** Web personal y portfolio profesional  
**Posicionamiento:** Ingeniería de software para negocios  
**Tipo de documento:** Especificación general de producto, experiencia, arquitectura y operación  
**Versión:** 1.6  
**Estado:** Aprobado para inicio de proyecto  
**Idioma base:** Español  
**Enfoque de interfaz:** Desktop-first, orientación landscape  
**Modalidad de despliegue:** VPS mediante contenedores Docker  

---

## 1. Propósito del documento

El presente documento establece la definición formal de la plataforma web personal y del portfolio profesional asociado. Describe la visión de producto, el alcance funcional, la arquitectura de información, la experiencia de usuario, el sistema visual, las capacidades comunes del laboratorio interactivo, la arquitectura técnica, la infraestructura, la operación y los criterios de aceptación de la plataforma base.

Este documento constituye la referencia principal para iniciar el análisis detallado, el diseño, la implementación, las pruebas y el despliegue del proyecto.

Quedan expresamente fuera de este documento las definiciones funcionales internas, los modelos de negocio, los flujos operativos, las pantallas específicas y las reglas particulares de las empresas ficticias **ACME Café** y **ACME Logística**. Dichos dominios serán documentados en especificaciones independientes. Aquí solo se define el marco de plataforma que las aloja, presenta y opera.

---

## 2. Visión del producto

La plataforma será la presencia digital profesional de un ingeniero de software orientado a negocios. Su objetivo no será exhibir únicamente capacidades de diseño o programación, sino demostrar la capacidad de comprender operaciones reales y convertirlas en sistemas digitales completos, confiables y mantenibles.

La propuesta central será:

> **Ingeniería de software para negocios.**

La plataforma comunicará que el servicio ofrecido comprende el diseño y desarrollo de soluciones que digitalizan procesos empresariales, incluyendo ventas, operaciones, datos, integraciones, automatización, inteligencia artificial, aplicaciones web y móviles, generación documental, observabilidad y despliegue.

La experiencia se apoyará en dos componentes complementarios:

1. **Sitio profesional y comercial:** explica el posicionamiento, los servicios, el método de trabajo, las capacidades técnicas y las vías de contacto.
2. **Laboratorio interactivo:** permite experimentar sistemas ficticios pero funcionales, presentados como productos vivos y conectados, no como imágenes estáticas o prototipos aislados.

La plataforma deberá transmitir solvencia técnica, criterio de producto, comprensión del negocio y capacidad de ejecución de extremo a extremo.

---

## 3. Objetivos

### 3.1. Objetivos de negocio

- Posicionar al profesional como proveedor de ingeniería de software aplicada a negocios, y no como ejecutor aislado de páginas web.
- Generar oportunidades comerciales calificadas.
- Reducir la distancia entre una explicación comercial y una demostración concreta de capacidades.
- Exhibir experiencia en sistemas integrales, interfaces, datos, integraciones, infraestructura y operación.
- Facilitar conversaciones comerciales basadas en problemas, resultados y procesos empresariales.
- Construir una base reutilizable para incorporar nuevas demostraciones y casos sin rediseñar la plataforma completa.

### 3.2. Objetivos de producto

- Ofrecer una navegación clara entre contenido comercial y experiencias interactivas.
- Proporcionar demostraciones inmersivas, seguras y reiniciables.
- Permitir cambios de idioma y apariencia sin perder el estado relevante de navegación.
- Mantener coherencia visual y operativa entre el sitio principal y las demostraciones.
- Permitir que cada visitante explore roles y perspectivas diferentes dentro de una misma experiencia.
- Permitir imprimir o guardar como PDF documentos simples mediante el navegador cuando una demo lo requiera.
- Medir el uso de la plataforma sin comprometer información sensible ni degradar la experiencia.

### 3.3. Objetivos técnicos

- Implementar una arquitectura modular, observable y desplegable en un VPS mediante Docker Compose.
- Mantener separación entre el núcleo de plataforma y los dominios particulares de cada demo.
- Centralizar capacidades transversales: sesiones, preferencias, analítica, métricas operativas, documentos simples y controles básicos de seguridad.
- Disponer de entornos reproducibles y un proceso de despliegue automatizable.
- Permitir evolución futura hacia interfaces móviles sin bloquear el diseño inicial desktop-first.

### 3.4. Indicadores iniciales de éxito

Los indicadores deberán definirse con valores objetivo durante la instrumentación analítica. Como mínimo se medirán:

- tasa de acceso al laboratorio desde el sitio principal;
- proporción de sesiones que inician una demo;
- tiempo de interacción dentro de las demos;
- cantidad de roles o perspectivas exploradas por sesión;
- uso de cambio de idioma y tema;
- interacciones con llamados a la acción de contacto;
- finalización de recorridos guiados;
- errores funcionales por sesión;
- disponibilidad y tiempos de respuesta de la plataforma.

---

## 4. Principios rectores

1. **Demostrar antes que afirmar.** Las capacidades técnicas se respaldarán con experiencias operables.
2. **Negocio antes que tecnología.** La comunicación partirá de resultados y procesos, sin ocultar la solidez técnica.
3. **Una plataforma, múltiples mundos.** Las demos conservarán identidad propia dentro de un marco común reconocible.
4. **Datos ficticios, comportamiento realista.** Todo contenido será simulado, pero los estados, interacciones y respuestas deberán resultar creíbles.
5. **Exploración segura.** Ninguna acción del visitante podrá dañar una demo compartida ni afectar a otros usuarios.
6. **Estado comprensible.** El sistema deberá comunicar cuándo un dato es simulado, cuándo fue actualizado y qué efectos tendrá cada acción.
7. **Progresividad.** El visitante podrá obtener valor desde una exploración breve y profundizar sin quedar obligado a completar un recorrido lineal.
8. **Calidad operacional visible.** Rendimiento, accesibilidad, seguridad y observabilidad serán parte del producto, no tareas posteriores.

---

## 5. Alcance

### 5.1. Incluido en la plataforma base

- sitio público profesional;
- navegación global y arquitectura de información;
- laboratorio interactivo y catálogo de demos;
- marco común de ejecución de demos;
- selector de empresa, rol o perspectiva y escenario, cuando corresponda;
- sesiones de demostración aisladas y reiniciables;
- preferencias de tema, idioma y accesibilidad;
- internacionalización;
- sistema de diseño compartido;
- componentes de orientación, ayuda, recorridos y avisos de simulación;
- backend común y API de plataforma;
- persistencia temporal de sesiones demo durante una hora;
- vistas documentales simples preparadas para imprimir o guardar como PDF desde el navegador;
- archivos estáticos mínimos alojados en el VPS;
- analítica de producto y eventos;
- registro de auditoría técnica y funcional;
- observabilidad de aplicación e infraestructura;
- simulaciones internas de integraciones externas mediante casos precalculados;
- infraestructura de despliegue en VPS;
- pipeline propuesto de integración y despliegue continuo;
- respaldo local de métricas, contactos y configuración persistente;
- SEO técnico y metadatos sociales del sitio público.

### 5.2. Fuera del alcance de esta especificación

- detalle funcional interno de ACME Café;
- detalle funcional interno de ACME Logística;
- publicación de aplicaciones móviles nativas en tiendas;
- back office comercial real con clientes reales;
- procesamiento real de pagos, facturación fiscal o documentación legal;
- gestión de datos personales o empresariales de producción;
- conexiones reales con ARCA, Google Maps, Waze u otros proveedores durante las demostraciones;
- almacenamiento externo de objetos, buckets o repositorios de multimedia;
- adaptación móvil completa en la primera versión;
- sistema de gestión de contenidos generalista, salvo decisión posterior;
- portal autenticado para clientes reales;
- comercio electrónico real.

### 5.3. Supuestos

- La primera versión estará optimizada para pantallas de escritorio y notebooks en orientación landscape.
- Las demos utilizarán datos ficticios y estarán identificadas como simulaciones.
- El VPS ejecutará Linux y permitirá Docker Engine, Docker Compose, volúmenes persistentes y acceso seguro por SSH.
- Las integraciones externas de las demos se representarán mediante casos internos precalculados y respuestas simuladas realistas.
- La plataforma podrá alojarse bajo un dominio principal y uno o más subdominios, sin que esto implique experiencias visualmente separadas.

---

## 6. Audiencias y recorridos principales

### 6.1. Audiencias objetivo

- propietarios y directores de pequeñas y medianas empresas;
- responsables de operaciones;
- responsables comerciales y de producto;
- responsables de tecnología que evalúan capacidad de implementación;
- agencias, consultoras o socios potenciales;
- reclutadores o líderes técnicos interesados en una evaluación integral.

### 6.2. Necesidades por audiencia

| Audiencia | Necesidad principal | Evidencia esperada |
|---|---|---|
| Dirección | Entender impacto, alcance y confiabilidad | Resultados, visión integral y demos comprensibles |
| Operaciones | Ver procesos y control operativo | Flujos, estados, alertas, reportes y trazabilidad |
| Producto | Evaluar experiencia y capacidad de evolución | UX, consistencia, escenarios y modularidad |
| Tecnología | Validar decisiones técnicas y calidad | Arquitectura, seguridad, observabilidad y despliegue |
| Socios o agencias | Identificar capacidad de colaboración | Método, alcance, comunicación e integración |

### 6.3. Recorridos de alto nivel

1. **Descubrimiento comercial:** inicio → soluciones → experiencia o caso → contacto.
2. **Prueba directa:** inicio → laboratorio → selección de demo → selección de perspectiva → exploración.
3. **Evaluación técnica:** inicio → cómo trabajo → arquitectura/capacidades → laboratorio → contacto.
4. **Retorno a una demo:** enlace profundo → restauración o creación de sesión → módulo o recorrido solicitado.
5. **Exploración guiada:** laboratorio → recorrido recomendado → hitos → resumen y llamado a la acción.

---

## 7. Arquitectura de información

### 7.1. Mapa general

```text
Plataforma
├── Experiencia comercial continua
│   ├── Inicio
│   ├── Soluciones
│   │   ├── Sistemas de gestión
│   │   ├── Automatización e integraciones
│   │   ├── Aplicaciones web y móviles
│   │   ├── Datos, analítica e IA
│   │   └── Infraestructura y operación
│   ├── Experiencia / Casos
│   │   ├── Presentación de ACME Café
│   │   └── Presentación de ACME Logística
│   ├── Cómo trabajo
│   ├── Sobre mí
│   └── Contacto
├── Laboratorio
│   ├── Catálogo de demos
│   ├── Lanzador de experiencia
│   ├── Contenedor común de demo
│   └── Ayuda y recorridos
├── Información legal y privacidad
└── Estado de servicios, opcional
```

La sección **Experiencia / Casos** cumplirá una función narrativa y comercial. El **Laboratorio** será el espacio operativo en el que se ejecutan las demostraciones.

### 7.2. Estructura de URL sugerida

```text
https://dominio.tld/
https://dominio.tld/#solutions
https://dominio.tld/#experience
https://dominio.tld/#process
https://dominio.tld/#about
https://dominio.tld/#contact
https://dominio.tld/privacidad
https://dominio.tld/lab
https://dominio.tld/lab/demo/{demo}
https://dominio.tld/lab/demo/{demo}/{modulo-opcional}
```

Las anclas de la experiencia comercial serán estables e independientes del idioma. El contenido y las etiquetas se localizarán, pero los identificadores `home`, `solutions`, `experience`, `process`, `about` y `contact` no cambiarán. Las antiguas rutas comerciales independientes se retirarán o redirigirán a la sección equivalente y no constituirán copias canónicas.

El laboratorio se implementará bajo `/lab`, de acuerdo con ADR-001. El sitio y el laboratorio compartirán diseño, identidad y navegación contextual.

### 7.3. Contenido del sitio público

- propuesta de valor inmediata;
- problemas de negocio que pueden resolverse;
- áreas de solución;
- evidencia mediante casos y demos;
- metodología de trabajo;
- perfil profesional y principios;
- llamados a la acción claros;
- vías de contacto;
- información de privacidad y uso de analítica.

---

## 8. Navegación

### 8.1. Navegación global

La cabecera principal será persistente en el sitio público y contendrá:

- identidad del profesional;
- acceso a Inicio, Soluciones, Experiencia, Cómo trabajo, Sobre mí y Contacto;
- acceso destacado al Laboratorio;
- selector de idioma;
- selector de tema;
- indicador de sección activa.

La navegación comercial operará sobre una única página mediante anclas. La cabecera tendrá altura acotada y no mostrará etiquetas redundantes alrededor de los controles. El selector de idioma presentará únicamente el código `ES` o `EN`; el control de tema alternará claro y oscuro mediante iconos de sol y luna con nombres accesibles. Densidad y movimiento no se expondrán como preferencias públicas.

La sección activa se calculará mediante `IntersectionObserver`. La navegación iniciada por el visitante deberá producir un enlace profundo utilizable y respetar el historial. Las actualizaciones automáticas motivadas por el scroll podrán reemplazar el fragmento actual, pero no crearán una entrada nueva por cada sección observada.

En el laboratorio, la navegación se adaptará para priorizar la experiencia sin perder una salida clara al sitio principal. Deberá incluir:

- marca de la plataforma;
- identidad de la demo activa;
- cambio de demo o salida al catálogo;
- cambio de perspectiva o rol, cuando esté habilitado;
- controles de sesión: reiniciar, consultar el tiempo restante o comenzar un recorrido;
- idioma, tema, ayuda y estado de la simulación;
- retorno al portfolio.

### 8.2. Enlaces profundos

Las vistas relevantes deberán poder representarse mediante URL. Un enlace profundo podrá identificar la demo y el módulo, pero no expondrá identificadores sensibles ni estados internos completos. Al abrirlo:

- se reutilizará una sesión vigente compatible, o se creará una nueva con una duración fija de una hora;
- se aplicará un estado inicial seguro;
- se informará al usuario si la experiencia fue restaurada o reiniciada;
- se evitará que la URL dependa de datos efímeros no recuperables.

### 8.3. Historial y salida segura

- Los controles Atrás y Adelante del navegador deberán funcionar en las transiciones significativas.
- No se perderá una acción relevante sin confirmación cuando exista estado local no sincronizado.
- Salir de una demo no destruirá automáticamente la sesión; podrá retomarse hasta que se cumpla una hora desde su creación.
- Reiniciar una demo requerirá confirmación y generará un nuevo estado base o restaurará el escenario seleccionado.

---

## 9. Diseño visual y experiencia de usuario

### 9.1. Dirección visual

La identidad deberá combinar precisión técnica, sobriedad comercial y una capa de dinamismo que haga visible el carácter interactivo de la plataforma. Se evitarán tanto la estética genérica de portfolio de freelance como la apariencia excesivamente corporativa o impersonal.

Características recomendadas:

- composición amplia y modular;
- jerarquía tipográfica fuerte;
- superficies limpias con profundidad moderada;
- visualización de datos clara y consistente;
- animación funcional, no ornamental;
- acentos cromáticos diferenciados para cada demo;
- lenguaje visual común para estados, alertas, acciones y ayuda;
- ilustraciones o recursos propios cuando aporten contexto.

### 9.2. Desktop-first y landscape

La experiencia primaria se diseñará para un viewport de referencia de **1440 × 900 px**, con soporte completo desde **1280 × 720 px** y adaptación razonable a resoluciones superiores.

El diseño deberá aprovechar el ancho disponible mediante:

- paneles laterales;
- vistas maestro-detalle;
- tableros con grillas;
- áreas de datos y contexto simultáneas;
- simuladores de dispositivos móviles integrados dentro de la vista desktop;
- densidad informativa adecuada a cada superficie.

Aunque la primera entrega no será mobile-first, la arquitectura de componentes no deberá impedir una adaptación posterior. En viewports menores al mínimo soportado se ofrecerá una versión de contingencia usable: contenido comercial refluido y, para las demos complejas, un aviso que recomiende escritorio junto con acceso limitado cuando sea viable.

### 9.3. Sistema de diseño

Se implementará un sistema de diseño compartido con:

- tokens semánticos de color, tipografía, espacio, elevación, radio, borde, movimiento y capas;
- temas claro y oscuro;
- tipografías con carga optimizada y alternativas del sistema;
- componentes accesibles de formulario, navegación, feedback y visualización;
- patrones comunes para tablas, filtros, paneles, mapas, gráficos, timelines y modales;
- estados normalizados: vacío, carga, error, éxito, advertencia, sin conexión y datos desactualizados;
- documentación de componentes y variantes;
- revisión visual manual de los componentes críticos por parte del propietario.

Las demos podrán extender tokens de marca, pero no redefinir comportamientos base ni degradar accesibilidad.

### 9.4. Animación e inmersión

Las animaciones deberán explicar cambios de estado, continuidad espacial y actividad del sistema. Se contemplarán:

- revelado progresivo de secciones durante el scroll;
- escenas parcialmente fijas que evolucionen sin bloquear el desplazamiento natural;
- respuesta de profundidad e iluminación en tarjetas mediante puntero y foco;
- transiciones entre módulos;
- actualización de indicadores;
- actividad simulada en tiempo real;
- cambios de foco entre perspectivas;
- recorridos guiados;
- microinteracciones de confirmación.

Se respetará `prefers-reduced-motion`. Ninguna información esencial dependerá exclusivamente del movimiento.

El sitio no utilizará scroll-jacking, smooth-scroll global, WebGL, video de fondo ni multimedia pesada. El desplazamiento seguirá siendo nativo. Las animaciones se implementarán como mejora progresiva mediante CSS, SVG, `IntersectionObserver` y componentes cliente acotados. Los efectos ligados continuamente al puntero o al scroll deberán minimizar trabajo de layout, priorizar `transform` y `opacity`, y desactivarse o simplificarse cuando el dispositivo o la preferencia del usuario lo requieran.

Los efectos hover tendrán una representación equivalente mediante foco y no contendrán información exclusiva. En dispositivos táctiles se utilizará una variante estable sin inclinación dependiente del puntero.

### 9.5. Estados y feedback

Toda acción deberá producir feedback visible. Para operaciones demoradas se distinguirá entre:

- acción recibida;
- procesamiento;
- resultado exitoso;
- resultado parcial;
- error recuperable;
- error definitivo.

Los mensajes deberán explicar qué ocurrió, si el cambio afecta solo a la sesión actual y cuál es la acción de recuperación disponible.

---

## 10. Laboratorio interactivo

### 10.1. Propósito

El laboratorio será el entorno común para ejecutar y descubrir demostraciones. Debe comunicar que se está ingresando a un sistema funcional con datos simulados y ofrecer una transición clara desde la narrativa comercial hacia la interacción.

### 10.2. Catálogo y lanzador

Cada demo tendrá una ficha con:

- nombre e identidad visual;
- descripción breve del problema empresarial representado;
- capacidades demostradas;
- perspectivas o roles disponibles;
- duración orientativa de un recorrido;
- estado de disponibilidad;
- botón para iniciar o continuar;
- aviso explícito de datos ficticios.

El lanzador permitirá seleccionar, según la demo:

- perspectiva o rol;
- escenario inicial;
- recorrido libre o guiado;
- idioma y tema iniciales.

### 10.3. Marco común de demos

Toda demo se integrará mediante un contrato común que contemple:

- metadatos y versión;
- módulos y rutas registradas;
- roles o perspectivas disponibles;
- permisos de demostración;
- escenarios y datos semilla;
- eventos analíticos;
- acciones de reinicio;
- capacidades de exportación;
- estado de salud;
- traducciones y tokens visuales extendidos;
- integraciones simuladas y casos precalculados requeridos;
- política de sesión y expiración.

El contenedor de demo proporcionará navegación, ayuda, preferencias, avisos legales, estado de sesión, reinicio, recorridos, telemetría y manejo de errores. Cada dominio implementará sus funciones sin duplicar estas capacidades transversales.

### 10.4. Roles de demo a nivel general

Los roles no representarán cuentas reales ni autorización empresarial. Serán perspectivas controladas para mostrar diferentes necesidades y superficies del sistema. El marco deberá permitir, como mínimo:

- un rol ejecutivo o de supervisión;
- un rol operativo;
- un rol de atención o ejecución;
- una perspectiva de cliente o usuario final, cuando aplique;
- una perspectiva de dispositivo o aplicación móvil simulada, cuando aplique.

Cada rol definirá módulos visibles, acciones habilitadas, recorrido recomendado y estado inicial. El cambio de rol deberá ser explícito, trazable en analítica y seguro. No se utilizará el cambio de rol como sustituto de autorización real en futuros sistemas de producción.

### 10.5. Recorridos guiados

El marco permitirá definir recorridos declarativos compuestos por hitos, instrucciones y validaciones de acciones. Un recorrido podrá:

- destacar una región de interfaz;
- explicar el valor empresarial de una función;
- solicitar una interacción;
- cambiar de módulo o perspectiva;
- mostrar una consecuencia simulada;
- registrar avance y finalización;
- permitir pausa, omisión y reinicio.

Los recorridos no bloquearán la exploración libre y deberán ser accesibles mediante teclado.

### 10.6. Simulación y sincronización de interfaces

La plataforma podrá distribuir eventos simulados para crear actividad coherente. Deberá diferenciar:

- hora real de la sesión;
- hora o reloj de simulación;
- datos históricos semilla;
- eventos generados durante la interacción.

Las distintas interfaces visibles dentro de una misma experiencia —por ejemplo, un panel central y un dispositivo móvil simulado— compartirán el estado de la aplicación en la sesión del navegador. Las acciones se reflejarán inmediatamente en las superficies relacionadas y se persistirán en el backend cuando sea necesario conservarlas durante la hora de sesión.

La actividad autónoma podrá generarse en el navegador a partir del reloj de simulación y una semilla estable. Si alguna vista necesita consultar cambios del backend, se utilizará polling moderado. Server-Sent Events y WebSocket no forman parte de los requisitos de la plataforma base.

---

## 11. Temas e internacionalización

### 11.1. Theming

La plataforma soportará como mínimo:

- tema claro;
- tema oscuro;
- extensión de identidad por demo mediante tokens acotados.

En ausencia de una elección persistida, la primera visita podrá resolver el tema inicial desde la preferencia del sistema. La interfaz ofrecerá después un conmutador binario entre claro y oscuro, sin exponer una tercera opción de sistema. La preferencia explícita se almacenará en el navegador y, cuando exista una sesión de demo, podrá asociarse también a ella. La aplicación evitará destellos de tema incorrecto durante la carga inicial y no insertará scripts ejecutables durante renderizados cliente.

Los contrastes deberán cumplir WCAG 2.2 nivel AA. El color no será el único medio para comunicar estado.

### 11.2. Internacionalización

La primera versión contará al menos con español e inglés. El idioma base será español. La solución de i18n deberá soportar:

- rutas o metadatos localizados;
- pluralización;
- interpolación segura;
- formatos regionales de fecha, hora, moneda y número;
- contenido de derecha a izquierda como posibilidad futura, sin requerirlo en la primera versión;
- traducciones por espacio de nombres y por demo;
- carga diferida de diccionarios;
- detección inicial basada en preferencia explícita y, en ausencia de ella, navegador;
- persistencia del idioma elegido;
- control de claves faltantes en desarrollo y CI.

Los textos funcionales no se codificarán directamente en los componentes. Los datos ficticios que requieran localización deberán definir estrategia de traducción o representación neutral.

---

## 12. Arquitectura técnica

### 12.1. Enfoque general

Se propone un **monolito modular** para el backend y una aplicación frontend modular, con límites de dominio explícitos. Este enfoque reduce complejidad operativa en un único VPS, conserva transacciones simples y permite extraer servicios en el futuro si la carga o la evolución funcional lo justifican.

La arquitectura lógica será:

```text
Navegador
   │ HTTPS
   ▼
Caddy / Reverse proxy
   ├── Sitio y frontend de laboratorio
   ├── API de plataforma y demos
   └── Activos estáticos locales
          │
          ▼
Backend modular
   ├── Plataforma
   │   ├── Sesiones demo
   │   ├── Preferencias
   │   ├── Catálogo y configuración
   │   ├── Métricas y contactos
   │   ├── Documentos simples
   │   └── Integraciones simuladas
   ├── Dominio ACME Café
   └── Dominio ACME Logística
          │
          └── PostgreSQL
              ├── platform
              ├── demo_core
              ├── acme_cafe
              └── acme_logistica
```

### 12.2. Frontend

Se recomienda un framework web con renderizado híbrido o del lado del servidor para el contenido público y navegación cliente para las experiencias interactivas. La elección concreta deberá favorecer tipado estático, rutas declarativas, internacionalización, accesibilidad, pruebas y optimización de activos.

Responsabilidades del frontend:

- renderizado del sitio público y metadatos SEO;
- shell común del laboratorio;
- módulos de cada demo;
- gestión de preferencias y estado efímero;
- sincronización con la API y con el estado compartido de la experiencia;
- manejo consistente de carga y errores;
- simulación visual de dispositivos dentro del desktop;
- instrumentación analítica;
- accesibilidad y navegación por teclado.

No deberá contener secretos ni reglas críticas de autorización. Las respuestas de proveedores simulados se obtendrán mediante contratos internos o datos precargados.

### 12.3. Backend

El backend expondrá API versionada y módulos con fronteras claras. Sus responsabilidades serán:

- crear, restaurar, expirar y reiniciar sesiones demo;
- aplicar reglas de dominio de cada demo;
- persistir estado y eventos;
- ofrecer el estado necesario para sincronizar las interfaces de una sesión;
- preparar datos validados para vistas imprimibles cuando una demo lo requiera;
- servir o referenciar los pocos activos estáticos previstos;
- resolver integraciones simuladas mediante casos precalculados;
- registrar auditoría y métricas;
- ejecutar tareas programadas de mantenimiento;
- aplicar validación, límites y políticas de seguridad.

La API deberá documentarse mediante OpenAPI o especificación equivalente. Los contratos usados por frontend y backend deberán mantenerse sincronizados mediante generación de tipos o validación compartida.

### 12.4. Mantenimiento programado

La plataforma no requerirá una cola ni un worker permanentemente activo. Una tarea de mantenimiento se ejecutará una vez por día y eliminará las sesiones vencidas junto con sus datos transitorios.

La tarea podrá implementarse como un comando interno del backend ejecutado por un temporizador del servidor o como un contenedor de ejecución puntual dentro de Docker Compose. Deberá ser idempotente, registrar su resultado y no afectar las métricas, los contactos ni la configuración persistente.

### 12.5. Sincronización dentro de la demo

- Las superficies incluidas en una misma página compartirán estado en el frontend.
- Las acciones relevantes se persistirán mediante la API para admitir recarga durante la vigencia de la sesión.
- El movimiento, las alertas y otros eventos automáticos podrán simularse localmente con una semilla determinista.
- Cuando sea necesario consultar cambios del servidor se utilizará polling moderado.
- No se requerirán SSE, WebSocket ni procesos distribuidos para la plataforma base.

---

## 13. Persistencia y sesiones demo

### 13.1. PostgreSQL

Se utilizará un único contenedor PostgreSQL con separación lógica entre dos conjuntos de datos:

- **`platform`:** métricas de interacción, contactos, configuración y datos necesarios para conocer el estado e historial de la plataforma. Estos datos tendrán permanencia.
- **`demo_core`:** sesiones y progreso común de las demostraciones.
- **`acme_cafe` y `acme_logistica`:** operaciones simuladas de cada dominio. Sus datos serán prescindibles y podrán eliminarse sin proceso de recuperación.

La separación se implementará mediante esquemas dentro de una única base PostgreSQL, con permisos diferenciados cuando corresponda. Las migraciones serán versionadas, pero los esquemas de demostración podrán reconstruir por completo los datos de prueba y volver a aplicar las semillas.

### 13.2. Modelo de sesión

Cada visitante recibirá una sesión anónima con identificador aleatorio, no secuencial y no significativo. No será necesario registrarse ni iniciar sesión. Cada sesión tendrá una duración fija de una hora desde su creación.

Una sesión de demo incluirá como mínimo:

- demo y versión;
- escenario inicial;
- rol o perspectiva vigente;
- idioma y tema, si se sincronizan;
- fecha de creación y expiración fija;
- semilla de simulación;
- estado funcional mutable;
- versión de esquema;
- hitos del recorrido;
- estado: activa, expirada o reiniciada.

### 13.3. Aislamiento

- Las mutaciones de una sesión no afectarán a otras sesiones.
- Los datos base se copiarán lógicamente o se derivarán de una semilla inmutable.
- Las consultas deberán incluir el alcance de sesión o tenant de demo de forma obligatoria.
- Se crearán pruebas automatizadas contra fugas entre sesiones.
- Los eventos globales puramente visuales no deberán modificar datos funcionales compartidos.

### 13.4. Expiración y limpieza

La sesión vencerá una hora después de su creación y no se extenderá por actividad. Una vez vencida, el visitante deberá crear una nueva.

Una tarea diaria eliminará todas las sesiones vencidas de `demo_core` y los datos relacionados de `acme_cafe` y `acme_logistica`. Las métricas resumidas ya registradas en `platform` no se eliminarán. El reinicio de una demo reemplazará su estado transitorio sin afectar el historial analítico.

### 13.5. Continuidad en navegador

El navegador conservará un token opaco en cookie segura. Preferentemente será `HttpOnly`, `Secure` y `SameSite=Lax` o más restrictiva según topología. Si sitio y laboratorio usan subdominios, el alcance de cookies se definirá de manera mínima y explícita.

No se incluirá estado de negocio completo en almacenamiento local. Allí solo podrán guardarse preferencias, referencias no sensibles y la cola mínima de operaciones del escenario offline de ACME Logística. Esa cola estará aislada por sesión y se eliminará al sincronizar, reiniciar o vencer la sesión.

---

## 14. Impresión y guardado como PDF

La documentación será una capacidad auxiliar y acotada. Solo se utilizará cuando aporte valor visible a una demo.

### 14.1. Casos generales

- comprobantes o documentos ficticios;
- reportes breves;
- exportaciones puntuales de una vista.

### 14.2. Arquitectura

Se utilizarán vistas HTML/CSS versionadas, con datos validados, estilos `@media print` y soporte para los idiomas requeridos. El navegador abrirá la vista imprimible y ejecutará su diálogo nativo mediante `window.print()`. El visitante podrá imprimir o elegir **Guardar como PDF**.

La primera versión no generará archivos PDF en el backend ni incorporará Chromium headless, una biblioteca PDF, colas, catálogo documental, almacenamiento permanente o URLs firmadas. Si en el futuro apareciera un requisito real de descarga automática, se evaluará como una decisión nueva.

### 14.3. Seguridad y calidad documental

- Se sanitizarán datos interpolados.
- Los documentos deberán incluir una marca visible de demostración cuando simulen documentación empresarial.
- Se probarán el contenido mínimo, la presentación en pantalla y los estilos de impresión de las plantillas utilizadas.

---

## 15. Integraciones externas simuladas

Las demostraciones no establecerán conexiones reales con ARCA, Google Maps, Waze u otros proveedores. Su comportamiento se representará mediante casos precalculados, almacenados como datos semilla o archivos JSON versionados.

### 15.1. Contrato de simulación

Cada integración dispondrá de un contrato interno sencillo para que la lógica de la demo no dependa directamente del formato de los datos precalculados. El backend podrá aplicar una demora breve y devolver resultados realistas y deterministas.

Los conjuntos de casos contemplarán resultados satisfactorios, rechazos, demoras, indisponibilidad y alternativas previamente calculadas. Tendrán identificador y versión, datos iniciales validados, resultado esperado y prioridad. La selección será determinista a partir de la sesión y del escenario, salvo cuando el visitante elija explícitamente un caso.

No requerirán credenciales, cuotas, reintentos, circuit breakers ni monitoreo de proveedores reales. El catálogo aprobado se define en `docs/architecture/CATALOGO_ESCENARIOS_SIMULADOS.md`.

### 15.2. Presentación transparente

La experiencia podrá reproducir el flujo y la apariencia de una integración empresarial, pero deberá identificarse como demostración o simulación y no afirmar que existe una conexión activa con el proveedor mencionado.

---

## 16. Seguridad

La seguridad será proporcional a una plataforma pública de demostración. Se priorizarán los controles que protegen la disponibilidad, las métricas, los contactos y el aislamiento entre visitantes, sin incorporar mecanismos propios de una plataforma crítica.

### 16.1. Controles mínimos

- HTTPS obligatorio y redirección desde HTTP.
- TLS administrado por Caddy.
- cabeceras web esenciales, incluida una CSP adecuada;
- validación de entradas y consultas parametrizadas;
- cookies de sesión seguras;
- CORS restrictivo cuando corresponda;
- rate limiting básico para creación de sesiones y contacto;
- límites de payload y tiempo de ejecución;
- secretos fuera del repositorio, el frontend y los logs;
- actualización razonable de dependencias e imágenes base;
- PostgreSQL y servicios internos accesibles solo desde la red privada de Docker;
- autenticación segura para el panel interno de métricas;
- logs sin secretos ni contenido personal innecesario;
- pruebas del aislamiento entre sesiones.

### 16.2. Privacidad

La plataforma evitará recopilar datos personales innecesarios. El formulario de contacto solicitará solo información pertinente y deberá informar finalidad y tratamiento. La analítica priorizará anonimización, minimización y consentimiento conforme a la herramienta y jurisdicción aplicables.

Las demos no deberán aceptar información sensible real. La interfaz lo advertirá en puntos relevantes.

---

## 17. Analítica de producto

### 17.1. Principios

- medir objetivos concretos;
- no registrar secretos ni contenido introducido libremente;
- usar nombres de evento estables y documentados;
- separar analítica de negocio, auditoría y logs técnicos;
- respetar consentimiento y preferencias de privacidad;
- mantener una alternativa de medición propia o autocontenida cuando sea razonable.

### 17.2. Taxonomía mínima

```text
page_viewed
cta_clicked
lab_opened
demo_started
demo_resumed
demo_reset
demo_role_changed
demo_module_viewed
guided_tour_started
guided_tour_step_completed
guided_tour_completed
theme_changed
language_changed
document_print_requested
document_print_opened
simulated_integration_used
contact_started
contact_submitted
client_error_reported
```

Todo evento incluirá únicamente las dimensiones necesarias: versión de aplicación, demo, módulo, rol, idioma, tema, tipo de dispositivo, identificador anónimo rotativo y resultado. No se enviarán textos libres ni datos funcionales completos.

### 17.3. Embudo inicial

Se medirá al menos:

```text
Visita al sitio
  → interacción con propuesta de valor
  → apertura del laboratorio
  → inicio de demo
  → interacción significativa
  → finalización de recorrido o exploración múltiple
  → contacto
```

### 17.4. Panel interno de métricas

La plataforma incluirá un panel interno protegido que permita consultar visitantes, sesiones, demos iniciadas, módulos explorados, roles seleccionados, duración de interacción, recorridos completados, conversiones, errores y estado general del sitio. Este panel será una capacidad funcional visible del proyecto y una demostración reutilizable para soluciones similares.

El panel utilizará los datos permanentes de `platform` y no dependerá de conservar las operaciones internas de las demos.

---

## 18. Observabilidad

### 18.1. Pilares

La plataforma implementará logs estructurados y métricas suficientes para conocer el uso y el estado operativo sin incorporar una infraestructura de trazas distribuidas.

**Logs:** JSON, nivel, timestamp UTC, servicio, versión, ambiente, request ID, session ID anonimizado, módulo, operación y resultado.  
**Métricas:** disponibilidad, latencia, tasa de errores, uso de recursos, sesiones, tareas de limpieza, documentos e interacciones relevantes.  
Los logs compartirán un request ID que permita seguir una operación entre Caddy y el backend.

### 18.2. Indicadores operativos mínimos

- tasa de respuestas 2xx, 4xx y 5xx;
- latencia p50, p95 y p99 por endpoint;
- Core Web Vitals del frontend;
- sesiones demo activas y creadas;
- uso de CPU, memoria, disco e inodos;
- conexiones y tamaño de PostgreSQL;
- resultado y duración de la limpieza diaria;
- fecha y resultado del último respaldo local de datos permanentes;
- solicitudes de impresión y errores al preparar documentos;
- expiración de certificados;
- salud y reinicios de contenedores.

### 18.3. Alertas

Se configurarán alertas accionables para:

- indisponibilidad pública;
- aumento sostenido de errores 5xx;
- latencia por encima del objetivo;
- disco o memoria cerca del límite;
- PostgreSQL no disponible;
- expiración próxima de certificados;
- fallo reiterado de la tarea de limpieza.

Los endpoints de salud distinguirán `liveness` y `readiness`. No expondrán detalles internos al público.

---

## 19. Infraestructura y despliegue

### 19.1. Topología VPS

La primera versión se desplegará en un VPS único dimensionado según pruebas de carga.

Servicios propuestos:

```text
Internet
   │
   ▼
Caddy :80/:443
   ├── web
   └── api

Red interna Docker
   ├── api
   ├── postgres
   └── observability, según selección

Volúmenes persistentes
   ├── postgres-data
   ├── caddy-data
   └── /srv/nahuelmartinez/backups/platform

Tarea programada diaria
   └── limpieza de demo_core y datos ACME vencidos
```

Solo Caddy publicará puertos a Internet. PostgreSQL y los servicios internos permanecerán en la red privada de Docker. Los pocos activos estáticos previstos se incluirán con la aplicación y se servirán desde el frontend o Caddy.

### 19.2. Docker Compose

La definición de Compose deberá incluir:

- imágenes versionadas por tag inmutable o digest;
- healthchecks;
- dependencias condicionadas por salud cuando corresponda;
- redes públicas y privadas separadas;
- volúmenes nombrados;
- límites o reservas de recursos compatibles con el host;
- políticas de reinicio;
- secretos y configuración externa;
- logging con rotación;
- perfiles opcionales para observabilidad o herramientas de desarrollo;
- comandos separados para migraciones, limpieza diaria y respaldo local.

Los contenedores de aplicación serán inmutables. Los datos persistentes no se escribirán dentro de capas de imagen.

### 19.3. Caddy

Caddy actuará como reverse proxy y responsable de TLS. Configuración mínima:

- certificados automáticos;
- redirección a HTTPS;
- virtual hosts para dominio principal y laboratorio;
- compresión adecuada;
- cabeceras de seguridad;
- límites básicos y política de tamaños;
- caché larga para activos versionados;
- ausencia de caché pública para respuestas personalizadas;
- logs de acceso estructurados y rotados;
- página controlada para mantenimiento o indisponibilidad.

### 19.4. PostgreSQL

- volumen persistente dedicado;
- usuario de aplicación sin privilegios administrativos;
- credenciales separadas por ambiente;
- acceso solo desde la red interna;
- migraciones automáticas controladas, con bloqueo para evitar concurrencia;
- parámetros ajustados a recursos del VPS;
- separación lógica y de permisos entre `platform` y los esquemas descartables de demostración;
- monitoreo básico de conexiones, consultas lentas y crecimiento;
- respaldo lógico local únicamente de los datos permanentes.

### 19.5. Activos estáticos

No se utilizarán buckets, servicios S3 ni almacenamiento externo de objetos. La plataforma no permitirá cargas de multimedia realizadas por visitantes.

Las pocas imágenes necesarias serán activos conocidos, optimizados y versionados con la aplicación, o archivos locales simples del VPS cuando resulte más práctico. Serán reemplazables mediante despliegue y no requerirán políticas particulares de respaldo.

---

## 20. Entornos

Se definirán, como mínimo:

| Entorno | Propósito | Datos | Exposición |
|---|---|---|---|
| Local | Desarrollo individual | semillas locales | equipo de desarrollo |
| Integración / CI | pruebas automatizadas | efímeros | no pública |
| Staging | validación funcional y de despliegue | ficticios, persistencia controlada | acceso restringido |
| Producción | sitio y laboratorio públicos | ficticios de demo | pública |

Cada entorno tendrá configuración, secretos y base de datos independientes. Staging deberá asemejarse a producción en topología y versiones, aunque con menor capacidad.

Los datos no se copiarán desde producción hacia otros ambientes salvo que sean íntegramente ficticios y exista un procedimiento explícito.

---

## 21. CI/CD propuesto

### 21.1. Integración continua

Ante cada pull request o cambio relevante se ejecutará:

1. instalación reproducible de dependencias;
2. verificación de formato y lint;
3. comprobación de tipos;
4. pruebas unitarias;
5. pruebas de integración con servicios efímeros;
6. validación de migraciones;
7. pruebas de contratos de API;
8. pruebas de accesibilidad automatizadas;
9. pruebas end-to-end de recorridos críticos;
10. construcción de frontend y backend;
11. escaneo de secretos y dependencias;
12. escaneo de imágenes de contenedor;
13. publicación de artefactos solo si todas las verificaciones obligatorias son satisfactorias.

### 21.2. Entrega y despliegue

- Construir una única vez imágenes versionadas con SHA de commit y versión semántica cuando aplique.
- Publicar en un registro privado o de acceso controlado.
- Desplegar automáticamente en staging.
- Ejecutar smoke tests y validaciones de salud.
- Promover exactamente las mismas imágenes a producción mediante aprobación controlada.
- Generar un respaldo local de `platform` antes de migraciones destructivas que lo afecten.
- Aplicar migraciones compatibles con la estrategia de despliegue.
- Verificar salud, rutas principales, sesión demo y preparación de una vista imprimible.
- Registrar versión, actor, hora y resultado del despliegue.

### 21.3. Estrategia de actualización y rollback

En un VPS único se priorizarán despliegues simples y confiables. Se podrá aplicar reemplazo gradual cuando los recursos lo permitan. Como mínimo:

- mantener disponibles la imagen anterior y su configuración;
- usar migraciones expand/contract para cambios incompatibles;
- no depender de rollback de base de datos como procedimiento primario;
- disponer de un comando o workflow documentado para volver a la versión anterior;
- mostrar mantenimiento controlado si una migración requiere indisponibilidad;
- realizar smoke tests posteriores y rollback automático o manual rápido ante fallo crítico.

---

## 22. Respaldo local de datos permanentes

No se establecerá una política general de backups ni de recuperación para los datos de demostración. Las sesiones y operaciones de `demo_core`, `acme_cafe` y `acme_logistica` son prescindibles y podrán descartarse durante limpiezas, migraciones o reconstrucciones.

Se generará un volcado lógico local únicamente de `platform`, que contendrá métricas, contactos y configuración persistente. El archivo quedará en un directorio del VPS destinado a su descarga manual y podrá sobrescribirse o rotarse mediante una política sencilla para no consumir espacio indefinidamente.

Este mecanismo será una práctica operativa interna y no una característica comunicada de cara al cliente. No se utilizarán buckets, repositorios externos, replicación, recuperación a un punto en el tiempo ni objetivos formales de RPO/RTO.

---

## 23. Requisitos no funcionales

### 23.1. Disponibilidad y confiabilidad

- Objetivo inicial de disponibilidad mensual: **99,5 %**, excluyendo mantenimiento anunciado.
- Los casos de integración simulada deberán producir respuestas deterministas y controladas.
- Las operaciones de mutación deberán evitar duplicaciones ante reintentos del navegador.
- Las sesiones no deberán corromperse por actualizaciones simultáneas; se aplicará control transaccional u optimista.

### 23.2. Rendimiento

Objetivos iniciales para producción, medidos en condiciones definidas:

- LCP del sitio público: ≤ 2,5 s en percentil 75;
- INP: ≤ 200 ms en percentil 75;
- CLS: ≤ 0,1 en percentil 75;
- respuesta API de lectura común: p95 ≤ 400 ms;
- mutación común: p95 ≤ 700 ms;
- feedback visible de una acción: ≤ 100 ms;
- carga inicial de demo utilizable: objetivo ≤ 4 s en conexión de escritorio razonable;
- actualización perceptible entre interfaces de una misma demo: ≤ 300 ms;
- preparación de vista imprimible: objetivo ≤ 1 s, sin contar el diálogo nativo del navegador.

Se establecerá un presupuesto de JavaScript, CSS, fuentes e imágenes por ruta. Los módulos pesados, mapas, gráficos y simuladores se cargarán bajo demanda.

### 23.3. Escalabilidad

La plataforma priorizará el crecimiento vertical del VPS. Su diseño deberá mantener:

- frontend y API desacoplados de los datos persistentes;
- sesiones almacenadas en PostgreSQL para sobrevivir recargas durante su hora de vigencia;
- módulos de demo separados dentro del backend;
- posibilidad de ampliar recursos del VPS sin rediseñar la aplicación.

Las metas concretas de concurrencia se fijarán antes de producción y se validarán mediante prueba de carga. Como línea base, deberá tolerar al menos 50 sesiones demo simultáneas en el VPS seleccionado sin incumplir los objetivos de latencia acordados.

### 23.4. Mantenibilidad

- límites de módulos documentados;
- tipado estático y contratos validados;
- cobertura de pruebas basada en riesgo;
- dependencias actualizadas de forma regular;
- decisiones arquitectónicas relevantes registradas como ADR;
- scripts operativos reproducibles;
- ausencia de configuración específica codificada en la aplicación;
- documentación actualizada junto con cada cambio funcional relevante.

### 23.5. Compatibilidad

Se soportarán las dos últimas versiones estables de Chrome, Edge, Firefox y Safari disponibles al momento de cada release. La experiencia primaria se validará en Windows y macOS en escritorio. Linux deberá funcionar en navegadores soportados.

---

## 24. Accesibilidad

La plataforma apuntará a **WCAG 2.2 nivel AA**.

Requisitos mínimos:

- navegación completa por teclado;
- foco visible y orden lógico;
- landmarks y estructura semántica;
- etiquetas y descripciones accesibles;
- contraste suficiente en todos los temas;
- alternativas textuales para imágenes informativas;
- tablas y gráficos con equivalentes comprensibles;
- anuncios de cambios dinámicos mediante regiones accesibles cuando corresponda;
- formularios con errores asociados y sugerencias de corrección;
- controles con áreas de interacción suficientes;
- soporte de zoom al 200 % sin pérdida de contenido esencial;
- respeto por reducción de movimiento y preferencias de contraste cuando sea viable;
- recorridos guiados utilizables con lector de pantalla;
- simuladores de móvil operables sin depender de gestos exclusivos.

Se combinarán validaciones automáticas con pruebas manuales de teclado y lector de pantalla en flujos críticos.

---

## 25. SEO y descubrimiento

El SEO se concentrará en el sitio público. Las sesiones de laboratorio, páginas efímeras, archivos generados y estados internos no deberán indexarse.

La plataforma pública incluirá:

- HTML renderizado de forma indexable;
- títulos y descripciones únicos;
- URL canónica;
- `hreflang` para idiomas disponibles;
- sitemap XML;
- robots.txt;
- Open Graph y metadatos sociales;
- datos estructurados pertinentes para persona y servicios profesionales, sin información engañosa;
- jerarquía correcta de encabezados;
- enlaces internos descriptivos;
- páginas 404 y de error útiles;
- imágenes optimizadas con dimensiones explícitas;
- contenido estable y sin duplicaciones innecesarias.

Los fragmentos de la página comercial no se tratarán como documentos independientes: no aparecerán en el sitemap ni tendrán canonical o metadata propios. La home localizada concentrará la metadata y los datos estructurados de la narrativa comercial.

El laboratorio podrá permitir indexación solo de sus páginas narrativas o catálogo, y bloquear rutas de sesión y módulos interactivos mediante metadatos y cabeceras apropiadas.

---

## 26. Estrategia de pruebas

### 26.1. Capas

- **Unitarias:** reglas, utilidades, validadores, reducers y transformaciones.
- **Componentes:** comportamiento, estados, accesibilidad y variantes visuales.
- **Integración:** módulos con PostgreSQL y casos de integración simulada.
- **Contratos:** compatibilidad frontend/backend y contratos de simulación.
- **End-to-end:** recorridos comerciales, inicio de demo, cambio de rol, reinicio, sincronización de interfaces e impresión cuando corresponda.
- **Revisión visual manual:** páginas clave, temas, idiomas, movimiento y resoluciones soportadas; será realizada por el propietario fuera de la automatización de los agentes.
- **Seguridad:** análisis estático, dependencias, imágenes y pruebas focalizadas.
- **Rendimiento:** presupuestos de frontend, carga de API y concurrencia demo.
- **Mantenimiento:** expiración de sesiones, limpieza diaria y respaldo local de datos permanentes.

### 26.2. Datos de prueba

Los datos semilla deberán ser deterministas, versionados y libres de datos personales reales. Las fábricas permitirán producir variaciones coherentes. Cada prueba deberá aislar o limpiar su estado.

### 26.3. Flujos críticos mínimos

- navegación desde Inicio hacia Contacto;
- navegación desde Inicio hacia Laboratorio;
- enlace profundo a cada sección comercial y seguimiento de sección activa;
- historial Atrás/Adelante después de navegar entre secciones;
- creación y continuidad de una sesión demo vigente;
- aislamiento entre dos sesiones simultáneas;
- selección y cambio de perspectiva;
- reinicio de escenario;
- cambio de idioma y tema;
- sincronización entre interfaces de una misma demo;
- renderizado e impresión de documentos simples cuando corresponda;
- reproducción de casos precalculados de integración;
- envío válido e inválido del formulario de contacto;
- funcionamiento de páginas de error.

---

## 27. Estructura de repositorio sugerida

Se recomienda un monorepositorio para mantener contratos, componentes y herramientas coordinados:

```text
/
├── apps/
│   ├── web/                    # Sitio público y shell del laboratorio
│   └── api/                    # API y backend modular
├── packages/
│   ├── design-system/          # Componentes, tokens y estilos
│   ├── contracts/              # Esquemas, tipos y contratos de API
│   ├── i18n/                   # Configuración y diccionarios comunes
│   ├── analytics/              # Taxonomía e instrumentación
│   ├── demo-framework/         # Shell, SDK y contrato de demos
│   ├── print-templates/        # Vistas documentales imprimibles
│   ├── simulations/            # Casos precalculados de integraciones
│   ├── config/                 # Configuración compartida de herramientas
│   └── testing/                # Fixtures, fábricas y utilidades
├── domains/
│   ├── acme-cafe/              # Dominio independiente; detalle en otro documento
│   └── acme-logistica/         # Dominio independiente; detalle en otro documento
├── infrastructure/
│   ├── compose/
│   ├── caddy/
│   ├── monitoring/
│   ├── maintenance/
│   └── scripts/
├── docs/
│   ├── architecture/
│   ├── adr/
│   ├── operations/
│   ├── api/
│   └── product/
├── tests/
│   ├── e2e/
│   ├── performance/
│   └── security/
├── .env.example
├── compose.yaml
└── README.md
```

La ubicación exacta podrá adaptarse al stack elegido, manteniendo las fronteras conceptuales.

---

## 28. Convenciones de desarrollo

### 28.1. Código y módulos

- nombres técnicos en inglés para código y contratos; contenido de interfaz mediante i18n;
- módulos organizados por dominio y capacidad, no únicamente por tipo de archivo;
- dependencias dirigidas hacia contratos estables;
- prohibición de importaciones cruzadas no declaradas entre dominios;
- funciones y componentes pequeños con responsabilidades explícitas;
- manejo de errores tipado y códigos estables;
- fechas persistidas en UTC y presentadas según locale y zona configurada;
- identificadores opacos y no secuenciales en interfaces públicas;
- dinero representado con unidades mínimas y moneda explícita cuando aplique.

### 28.2. API

- prefijo de versión, por ejemplo `/api/v1`;
- nombres consistentes y recursos claros;
- paginación para colecciones;
- filtros y orden definidos por contrato;
- errores con código, mensaje seguro, detalles de validación y request ID;
- idempotency key para operaciones susceptibles de repetición;
- timestamps ISO 8601;
- documentación OpenAPI generada y verificada en CI.

### 28.3. Git y cambios

- rama principal protegida;
- cambios mediante pull request;
- commits claros y acotados;
- revisión obligatoria para infraestructura, seguridad y migraciones;
- versionado semántico para paquetes o releases cuando aporte valor;
- changelog de producto y operación;
- ADR para decisiones que condicionen evolución o infraestructura.

### 28.4. Configuración

- variables de entorno validadas al inicio;
- `.env.example` sin secretos y con descripción;
- fallar rápido ante configuración obligatoria ausente;
- flags de funcionalidad para entregas progresivas;
- configuración sensible fuera del repositorio;
- valores por ambiente documentados.

### 28.5. Definición de terminado

Una funcionalidad se considerará terminada cuando:

- cumpla criterios funcionales;
- incluya estados de carga, vacío y error;
- tenga traducciones completas;
- sea accesible en el alcance acordado;
- incluya pruebas proporcionales al riesgo;
- produzca analítica y observabilidad requeridas;
- no introduzca hallazgos críticos de seguridad;
- actualice documentación y contratos;
- sea validada en staging;
- permita una operación y un mantenimiento razonables.

---

## 29. Roadmap inicial

### Fase 0 — Descubrimiento y decisiones fundacionales

- confirmar identidad, contenido y dominio;
- elegir stack concreto;
- registrar ADR iniciales;
- definir métricas y presupuesto de rendimiento;
- definir controles básicos de seguridad y aislamiento;
- establecer repositorio, convenciones y ambientes;
- convertir esta especificación en backlog trazable.

**Salida:** decisiones base aprobadas y entorno de trabajo reproducible.

### Fase 1 — Fundaciones técnicas y sistema de diseño

- monorepositorio y herramientas;
- CI inicial;
- frontend, API y PostgreSQL mínimos;
- tokens, tipografía, temas y componentes base;
- i18n español/inglés;
- shell de navegación;
- configuración, logging y healthchecks;
- Compose local.

**Salida:** plataforma vacía operable, probada y consistente.

### Fase 2 — Sitio profesional público

- experiencia comercial continua con Inicio, Soluciones, Experiencia, Cómo trabajo, Sobre mí y Contacto;
- navegación persistente por anclas, escenas progresivas y tarjetas interactivas;
- narrativa y llamados a la acción;
- SEO y metadatos sociales;
- analítica del embudo;
- accesibilidad y rendimiento del contenido público;
- formulario de contacto seguro.

**Salida:** sitio comercial completo y publicable.

### Fase 3 — Marco del laboratorio

- catálogo y lanzador;
- contrato o SDK de demos;
- sesiones aisladas;
- selección de roles y escenarios;
- ayuda y recorridos guiados;
- sincronización de interfaces dentro de la sesión;
- reinicio y expiración fija de una hora;
- instrumentación común.

**Salida:** una demo mínima de referencia integrada de extremo a extremo.

### Fase 4 — Capacidades transversales

- vistas HTML imprimibles cuando sean necesarias;
- activos estáticos locales;
- tarea diaria de mantenimiento;
- casos precalculados de integraciones;
- panel interno de métricas;
- observabilidad y alertas básicas;
- controles de seguridad proporcionales.

**Salida:** plataforma preparada para los dominios completos.

### Fase 5 — Integración de dominios ACME

- incorporar ACME Café según su especificación independiente;
- incorporar ACME Logística según su especificación independiente;
- validar coherencia, aislamiento y rendimiento;
- completar recorridos cruzados y enlaces desde el sitio público.

**Salida:** portfolio interactivo funcional con ambas experiencias.

### Fase 6 — Producción y endurecimiento

- VPS, Caddy y Docker Compose de producción;
- respaldo local de datos permanentes;
- CI/CD y rollback;
- prueba de carga;
- revisión de seguridad;
- auditoría de accesibilidad;
- monitoreo, alertas y runbooks;
- lanzamiento controlado.

**Salida:** versión productiva operable y mantenible.

### Fase 7 — Evolución

- optimización basada en analítica;
- adaptación móvil progresiva;
- nuevas demos o casos;
- mayor personalización de recorridos;
- mejoras de contenido, SEO y conversión;
- escalado de infraestructura según uso real.

---

## 30. Criterios de aceptación de la plataforma base

La plataforma base se considerará aceptada cuando se cumplan todos los criterios obligatorios siguientes.

### 30.1. Producto y navegación

- [ ] El sitio comunica de forma visible el posicionamiento “Ingeniería de software para negocios”.
- [ ] Existen las secciones públicas definidas y su navegación funciona mediante teclado y mouse.
- [ ] Las secciones comerciales forman un recorrido continuo y admiten enlace profundo.
- [ ] La sección activa se refleja en la navegación sin saturar el historial.
- [ ] El acceso al laboratorio es visible desde el sitio público.
- [ ] El laboratorio dispone de catálogo, lanzador y contenedor común de demos.
- [ ] El usuario puede regresar del laboratorio al sitio principal sin perder orientación.
- [ ] Las rutas relevantes admiten enlace profundo y manejo de errores.
- [ ] Todas las demos se identifican inequívocamente como simulaciones con datos ficticios.

### 30.2. Experiencia y diseño

- [ ] La experiencia está optimizada para 1440 × 900 px y es completamente usable desde 1280 × 720 px.
- [ ] Los temas claro y oscuro funcionan sin pérdida de contraste ni destello inicial significativo; la primera visita puede tomar la preferencia del sistema.
- [ ] Idioma y tema utilizan controles compactos; densidad y movimiento no se exponen como preferencias públicas.
- [ ] La cabecera permanece fija sin ocultar el destino de las anclas y el pie utiliza únicamente el espacio necesario.
- [ ] Español e inglés están completos para el núcleo de plataforma.
- [ ] Los componentes críticos incluyen estados de carga, vacío, error y éxito.
- [ ] La reducción de movimiento es respetada.
- [ ] El contenido permanece completo y operable sin animaciones, hover o entrada de precisión.
- [ ] No existen errores de consola o hidratación durante carga, scroll, cambio de idioma o cambio de tema.
- [ ] Existe una experiencia de contingencia comprensible para viewports menores.
- [ ] Las demos pueden extender su identidad sin romper el sistema de diseño común.

### 30.3. Marco de demos

- [ ] Una demo de referencia puede registrarse mediante el contrato común sin modificar el shell.
- [ ] Puede seleccionar al menos dos perspectivas o roles de referencia.
- [ ] Puede iniciar, pausar o abandonar un recorrido guiado.
- [ ] Puede reiniciar la sesión con confirmación.
- [ ] Dos sesiones simultáneas mantienen estado aislado.
- [ ] Las interfaces relacionadas se actualizan de forma coherente dentro de una misma demo.
- [ ] Una sesión válida puede continuar durante una hora desde su creación.
- [ ] Una sesión vencida obliga a iniciar una nueva.
- [ ] La tarea diaria elimina las sesiones vencidas y sus datos transitorios sin borrar métricas permanentes.

### 30.4. Backend, datos y documentos

- [ ] La API está versionada y documentada.
- [ ] Las migraciones parten de una base vacía y se aplican en CI y staging.
- [ ] PostgreSQL separa lógicamente `platform` de `demo_core`, `acme_cafe` y `acme_logistica`.
- [ ] Un comando de mantenimiento idempotente ejecuta la limpieza diaria.
- [ ] Cuando una demo lo requiere, la plataforma renderiza una vista localizada y abre el diálogo de impresión sin crear archivos en el backend.
- [ ] Los activos estáticos se sirven localmente sin storage externo.
- [ ] Al menos una integración simulada reproduce casos precalculados sin conectarse al proveedor real.
- [ ] El panel interno permite consultar métricas de interacción y estado general.

### 30.5. Seguridad

- [ ] Todo el tráfico público utiliza HTTPS.
- [ ] Solo Caddy expone puertos públicos requeridos.
- [ ] PostgreSQL y servicios internos no son accesibles desde Internet.
- [ ] Se aplican cabeceras de seguridad y CSP verificadas.
- [ ] Las cookies de sesión usan atributos seguros.
- [ ] Existe rate limiting para creación de sesiones y contacto.
- [ ] Los inputs y documentos renderizados tienen validación y límites explícitos.
- [ ] No hay secretos en repositorio, frontend, imágenes o logs.
- [ ] CI no presenta hallazgos críticos conocidos en secretos, dependencias o imágenes.
- [ ] Se prueba automáticamente el aislamiento entre sesiones.

### 30.6. Calidad, accesibilidad y rendimiento

- [ ] Los flujos críticos cuentan con pruebas end-to-end estables.
- [ ] No existen errores de accesibilidad críticos en pruebas automáticas.
- [ ] Se completó una revisión manual de teclado y foco.
- [ ] Los objetivos de Core Web Vitals se verifican en el sitio público en condiciones acordadas.
- [ ] La API cumple los objetivos de latencia con la carga base acordada.
- [ ] La prueba de 50 sesiones demo simultáneas no produce errores o degradación por encima de los límites definidos.
- [ ] Los navegadores y resoluciones declarados fueron verificados.

### 30.7. Operación y despliegue

- [ ] Local, CI, staging y producción tienen configuración separada.
- [ ] Docker Compose levanta todos los servicios requeridos con healthchecks.
- [ ] El pipeline construye imágenes inmutables y despliega en staging.
- [ ] La promoción a producción utiliza las mismas imágenes verificadas.
- [ ] Existe procedimiento documentado y probado de rollback de aplicación.
- [ ] Se genera un respaldo local únicamente de `platform`.
- [ ] Los datos de `demo_core`, `acme_cafe` y `acme_logistica` pueden reconstruirse desde las semillas.
- [ ] Logs y métricas permiten correlacionar una solicitud relevante.
- [ ] Alertas esenciales están configuradas y se probó al menos un canal de notificación.
- [ ] Existen procedimientos para indisponibilidad, disco lleno, fallo de base de datos y descarga manual del respaldo local.

### 30.8. SEO y analítica

- [ ] Las páginas públicas incluyen títulos, descripciones, canonical, `hreflang` y metadatos sociales.
- [ ] Sitemap y robots.txt se generan correctamente.
- [ ] Las rutas de sesión y archivos generados no son indexables.
- [ ] La taxonomía analítica está documentada y validada.
- [ ] El embudo desde visita hasta contacto puede medirse sin almacenar contenido sensible.
- [ ] La política de privacidad y el mecanismo de consentimiento, cuando resulte aplicable, están publicados.

---

## 31. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Alcance excesivo de las demos | Retraso y falta de foco | Marco común, releases por capacidades y criterios independientes |
| Apariencia de prototipo sin profundidad | Menor credibilidad | Datos coherentes, estados persistentes, consecuencias y recorridos conectados |
| VPS insuficiente | Degradación o caídas | Pruebas de carga, límites, métricas y escalado vertical planificado |
| Casos simulados poco convincentes | Menor credibilidad | Respuestas variadas, demoras controladas y datos precalculados coherentes |
| Fuga de estado entre visitantes | Riesgo de seguridad y experiencia | Scope obligatorio por sesión y pruebas automáticas de aislamiento |
| Costo de renderizado y mapas | Mala performance | Carga diferida, presupuesto de activos y simplificación progresiva |
| Datos analíticos invasivos | Riesgo de privacidad | Minimización, anonimización y consentimiento |
| Documento imprimible incorrecto | Pérdida de credibilidad | Plantillas cerradas, datos validados y pruebas de impresión |
| Complejidad operativa prematura | Mayor mantenimiento | Monolito modular y servicios adicionales solo con necesidad comprobada |
| Diseño desktop que impida evolución móvil | Reescritura futura | Componentes adaptables, contratos desacoplados y contingencia responsive |

---

## 32. Decisiones de implementación

### 32.1. Ronda 1 — Fundaciones técnicas cerradas

Las siguientes decisiones quedan aprobadas y registradas en `docs/adr/`:

1. `www.nahuelmartinez.com.ar` será el dominio canónico; el laboratorio utilizará `/lab` y el panel privado `/admin`.
2. El frontend utilizará Next.js 16 Active LTS, App Router, React 19 y TypeScript estricto.
3. La interfaz utilizará Tailwind CSS, tokens mediante variables CSS, primitivas Radix UI y TanStack Query.
4. El backend utilizará Fastify 5, TypeScript, TypeBox y OpenAPI, organizado como monolito modular.
5. El repositorio será un monorepositorio administrado con pnpm 11 workspaces, sin Turborepo ni Nx en la etapa inicial.
6. El runtime será Node.js 24 LTS.
7. La persistencia utilizará PostgreSQL 18 y Drizzle ORM con migraciones SQL versionadas.
8. La base utilizará los esquemas `platform`, `demo_core`, `acme_cafe` y `acme_logistica` dentro de una única instancia PostgreSQL.
9. El desarrollo local ejecutará web y API en el host; Docker Compose ejecutará PostgreSQL y Mailpit.
10. Las pruebas utilizarán Vitest, Testing Library, Playwright y axe; las integraciones se validarán contra PostgreSQL real.

### 32.2. Ronda 2 — Datos permanentes y relación con visitantes cerrada

Las siguientes decisiones quedan aprobadas y registradas en `docs/adr/` y `docs/architecture/DATOS_PERMANENTES_ANALITICA_Y_PRIVACIDAD.md`:

1. La analítica será propia, first-party y se almacenará en el esquema `platform`; no se utilizarán Google Analytics, Meta Pixel ni productos equivalentes.
2. La analítica opcional solo se activará con consentimiento explícito. Las sesiones técnicas y cookies estrictamente necesarias funcionarán sin dicho consentimiento.
3. Los eventos no incluirán texto libre, mensajes, firmas, nombres, correos ni contenido funcional de las demos.
4. Los eventos analíticos crudos se conservarán 180 días; los resúmenes de sesión, 24 meses; los agregados diarios podrán conservarse sin vencimiento mientras sigan siendo útiles.
5. El panel `/admin` utilizará una única cuenta administrativa local, contraseña Argon2id y sesiones de ocho horas mediante cookie `HttpOnly`, `Secure` y `SameSite=Strict`.
6. El panel incluirá Resumen, Adquisición, Demos, Conversión, Contactos y Estado.
7. El formulario almacenará el contacto en PostgreSQL antes de intentar la notificación por correo.
8. Mailpit será el transporte local y Resend el proveedor de correo en producción, detrás de una interfaz interna.
9. Los contactos tendrán estados `NEW`, `READ`, `RESPONDED`, `ARCHIVED` y `SPAM`, y se conservarán hasta 24 meses desde la última interacción, salvo eliminación manual o solicitud del titular.
10. Existirá una página `/privacidad`, un panel de preferencias y consentimiento separado para analítica opcional.

### 32.3. Ronda 3 — Operación y despliegue futuro cerrada

Las siguientes decisiones quedan aprobadas y registradas en `docs/adr/` y `docs/operations/OPERACION_Y_DESPLIEGUE.md`:

1. Los logs de aplicación utilizarán Pino en JSON; Caddy emitirá access logs JSON y Docker aplicará rotación local.
2. La plataforma expondrá healthchecks de vida y disponibilidad. UptimeRobot realizará monitoreo externo y enviará alertas por correo.
3. No se desplegarán Prometheus, Grafana, Loki, OpenTelemetry ni Sentry en la primera versión.
4. GitHub Actions ejecutará CI desde el comienzo. El despliegue productivo será manual mediante `workflow_dispatch` hasta que exista suficiente madurez operativa.
5. GitHub Container Registry almacenará imágenes privadas e inmutables de `web` y `api`, etiquetadas por SHA de commit.
6. La imagen de `api` ejecutará también migraciones, limpieza y backup como comandos de una sola ejecución; no existirá una imagen worker.
7. Producción utilizará Docker Compose con Caddy, web, API y PostgreSQL. Solo Caddy expondrá los puertos 80 y 443.
8. Caddy administrará TLS, redirección del dominio raíz hacia `www`, compresión, cabeceras y reverse proxy.
9. El VPS inicial utilizará Ubuntu Server 24.04 LTS, 2 vCPU, 4 GB de RAM, 80 GB NVMe y 2 GB de swap.
10. El crecimiento será vertical. El primer escalado será a 4 vCPU y 8 GB de RAM al superar los umbrales documentados.
11. Se generará cada día un `pg_dump` únicamente del esquema `platform` en `/srv/nahuelmartinez/backups/platform`, conservando catorce copias diarias.
12. No habrá copia externa automática; los archivos podrán descargarse manualmente por SFTP.

### 32.4. Ronda 4 — Simulaciones cerrada

Las siguientes decisiones quedan aprobadas y registradas en `docs/adr/` y `docs/architecture/CATALOGO_ESCENARIOS_SIMULADOS.md`:

1. Todas las integraciones de las demos utilizarán adaptadores internos con respuestas deterministas y datos versionados; no existirán conexiones de red hacia proveedores externos.
2. Cada escenario tendrá identificador estable, versión, prioridad, estado inicial, pasos, resultados esperados y fixtures validados.
3. Los recorridos guiados fijarán el resultado. La exploración libre permitirá elegir casos o usará una secuencia estable derivada de la sesión.
4. ACME Café priorizará pago aprobado, rechazo recuperable, emisión ficticia, error fiscal recuperable, consulta de stock, creación de reserva y consulta de pedido.
5. El motor conversacional inicial será determinista, basado en intenciones, entidades, respuestas localizadas y funciones internas; no dependerá de IA generativa.
6. ACME Logística contará con seis rutas precalculadas que cubren operación normal, congestión, incidente mecánico, entrega fallida, cadena de frío y conectividad.
7. La posición y la telemetría se derivarán en el navegador desde polilíneas, keyframes y el reloj simulado; solo se persistirán hitos relevantes.
8. El modo offline utilizará una cola local acotada por sesión y sincronización por lote al reconectar; no se implementarán PWA, Service Worker ni protocolos distribuidos.
9. La prueba de entrega permitirá seleccionar una de cuatro fotografías estáticas locales. No habrá cámara, carga de archivos ni storage externo.
10. Las firmas se conservarán como trazos vectoriales temporales dentro de la sesión y se eliminarán con sus datos descartables.
11. Los comprobantes y pruebas de entrega utilizarán vistas HTML imprimibles y el diálogo nativo del navegador. No habrá generación de PDF en backend en la primera versión.
12. El orden de implementación será P0 para el recorrido principal, P1 para recuperación y profundidad, y P2 para variantes de exhibición.

Con esta ronda quedan cerradas las decisiones previas necesarias para iniciar la plataforma base. Los detalles visuales y contenidos finales de cada demo podrán precisarse durante su fase de implementación sin cambiar estos contratos.

---

## 33. Documentación complementaria prevista

Este documento deberá complementarse con:

- especificación funcional y técnica de ACME Café;
- especificación funcional y técnica de ACME Logística;
- arquitectura de datos y diccionario de entidades por dominio;
- sistema de diseño y catálogo de componentes;
- especificación OpenAPI;
- ADR de stack, sesiones, separación de datos, simulaciones e impresión documental;
- definición de controles básicos de seguridad;
- plan de pruebas y matriz de trazabilidad;
- manual de despliegue y rollback;
- runbooks operativos;
- procedimiento interno de respaldo local y descarga manual;
- política de privacidad y términos aplicables a las demos.

---

## 34. Aprobación y control de cambios

La versión 1.6 establece la línea base revisada de la plataforma general, incorpora el cierre de las Rondas 1, 2, 3 y 4 y adopta mediante ADR-020 la experiencia comercial continua, la navegación por secciones y el movimiento progresivo. Todo cambio que altere el posicionamiento, alcance, modelo de sesiones, arquitectura de despliegue, stack aprobado, tratamiento de datos, operación, simulaciones, objetivos no funcionales o criterios de aceptación deberá registrarse con:

- descripción del cambio;
- motivación;
- impacto funcional y técnico;
- riesgos;
- migración requerida;
- decisión y responsables;
- versión del documento.

Las especificaciones futuras de ACME Café y ACME Logística deberán cumplir este marco. Si un dominio requiere una excepción, deberá documentarse de forma explícita y no convertirse implícitamente en una regla general de plataforma.

---

**Fin del documento.**
