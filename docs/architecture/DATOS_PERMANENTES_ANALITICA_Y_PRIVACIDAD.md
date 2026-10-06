# Datos permanentes, analítica, contactos y privacidad

**Proyecto:** Web personal y laboratorio interactivo  
**Versión:** 1.0  
**Estado:** Aprobado  
**Fecha:** 2026-10-05  

---

## 1. Alcance

Este documento define la implementación de los datos permanentes y la relación con visitantes. Complementa los ADR-009 a ADR-012 y la especificación general de plataforma.

Comprende:

- analítica propia;
- consentimiento;
- panel administrativo;
- formulario de contacto;
- notificaciones por correo;
- retención y eliminación;
- modelo de datos del esquema `platform`.

No comprende las operaciones internas descartables de ACME Café o ACME Logística.

---

## 2. Clasificación de datos

```text
platform · permanente
├── analytics_sessions
├── analytics_events
├── analytics_daily
├── contacts
├── contact_history
├── admin_users
├── admin_sessions
├── admin_audit
└── operational_status

demo_core / ACME · descartable
├── demo_sessions
├── progreso guiado
└── operaciones ficticias
```

La tarea de limpieza de demos no tendrá permisos para eliminar tablas del esquema `platform`.

---

## 3. Analítica

### 3.1. Identidad analítica

Después del consentimiento se generará un identificador aleatorio pseudónimo, almacenado en una cookie first-party. No contendrá información derivada del correo, IP, nombre o sesión de contacto.

La sesión analítica se renovará después de treinta minutos de inactividad. El identificador del visitante y el de la sesión serán distintos.

Si el visitante rechaza analítica:

- no se crearán estos identificadores;
- no se enviarán eventos de comportamiento;
- las demos seguirán funcionando;
- los logs técnicos podrán registrar solicitudes de forma transitoria para operación y seguridad, sin incorporarlas al perfil analítico.

### 3.2. Flujo

```text
Interacción
   ↓
cola breve en navegador
   ↓
POST /api/v1/analytics/events
   ↓
validación de taxonomía y consentimiento
   ↓
platform.analytics_events
   ↓
agregación diaria
   ↓
platform.analytics_daily
```

El envío utilizará `sendBeacon` al abandonar la página cuando esté disponible y solicitudes normales durante la sesión. Un fallo analítico nunca bloqueará la experiencia.

### 3.3. Taxonomía

Los eventos tendrán nombres versionados y un conjunto de propiedades permitido. El backend rechazará propiedades desconocidas o texto libre.

Categorías:

- navegación;
- llamados a la acción;
- laboratorio;
- módulos de demo;
- recorridos guiados;
- personalización;
- generación documental;
- contacto;
- errores visibles para el visitante.

### 3.4. Agregación

Una tarea diaria calculará:

- visitas y sesiones;
- páginas de entrada;
- fuentes y campañas;
- acceso al laboratorio;
- inicio y finalización de demos;
- módulos, roles y escenarios utilizados;
- duración aproximada;
- recorridos completados;
- conversiones a contacto;
- errores por categoría;
- idioma, tema y clase de dispositivo.

La eliminación de eventos crudos no deberá afectar los agregados históricos.

---

## 4. Consentimiento

### 4.1. Categorías

**Necesarias:** sesión demo, preferencia de idioma/tema, seguridad y administración.  
**Analítica:** medición pseudónima del uso, desactivada inicialmente.

No se crearán categorías de publicidad o personalización comercial en la primera versión.

### 4.2. Interfaz

El aviso inicial ofrecerá con igual claridad:

- **Aceptar analítica**;
- **Solo necesarias**;
- enlace a **Configurar** y a la política de privacidad.

No habrá casillas preseleccionadas, bloqueo del contenido ni diseño que penalice el rechazo.

### 4.3. Cambio de preferencia

El pie de página incluirá **“Preferencias de privacidad”**. Al retirar consentimiento:

- dejarán de enviarse eventos;
- se eliminará el identificador analítico del navegador;
- los datos ya agregados no podrán relacionarse nuevamente con el visitante;
- podrá solicitarse la supresión de datos identificables por los canales publicados.

---

## 5. Formulario de contacto

### 5.1. Flujo

```text
Formulario
   ↓
validación y controles antiabuso
   ↓
INSERT platform.contacts
   ↓
registro de historial
   ↓
ContactNotifier
   ├── Mailpit · local
   └── Resend · producción
```

El visitante recibirá confirmación cuando el registro haya sido almacenado. Si falla Resend, el contacto quedará marcado con `notification_status = FAILED` para reintento o revisión administrativa.

### 5.2. Modelo mínimo

```text
Contact
├── id
├── createdAt
├── updatedAt
├── name
├── email
├── company?
├── projectType?
├── message
├── status
├── consentVersion
├── consentAt
├── notificationStatus
└── lastInteractionAt
```

No se utilizará el formulario para suscribir automáticamente a newsletters.

### 5.3. Panel

El administrador podrá:

- listar y filtrar contactos;
- leer el mensaje;
- cambiar estado;
- registrar que respondió;
- archivar o marcar spam;
- eliminar definitivamente;
- abrir el cliente de correo mediante `mailto`.

El panel no será un cliente de correo ni almacenará respuestas enviadas fuera de la aplicación.

---

## 6. Acceso administrativo

### 6.1. Cuenta

Existirá una única cuenta local. Se creará mediante un comando como:

```text
pnpm admin:create
```

El comando solicitará usuario y contraseña, generará un hash Argon2id y evitará que la contraseña aparezca en argumentos, archivos o logs.

### 6.2. Sesión

- cookie opaca;
- `HttpOnly`;
- `Secure` en producción;
- `SameSite=Strict`;
- máximo de ocho horas;
- invalidación explícita al cerrar sesión;
- rotación del identificador al autenticar;
- protección CSRF en mutaciones administrativas.

### 6.3. Antiabuso

- rate limit por origen;
- demora progresiva después de fallos;
- mensajes que no revelen si el usuario existe;
- auditoría de intentos;
- cierre de todas las sesiones mediante comando administrativo.

No se implementarán OAuth, recuperación por correo, múltiples administradores, roles ni MFA en la primera versión.

---

## 7. Panel `/admin`

### 7.1. Resumen

- visitas y sesiones con consentimiento;
- acceso al laboratorio;
- demos iniciadas;
- recorridos completados;
- contactos;
- conversión;
- errores relevantes;
- estado general.

### 7.2. Adquisición

- páginas de entrada;
- dominios de referencia;
- UTM permitidos;
- idioma;
- clase de dispositivo y navegador.

### 7.3. Demos

- empresa ficticia;
- rol o perspectiva;
- módulos visitados;
- escenarios utilizados;
- duración agregada;
- recorridos iniciados y completados;
- acciones representativas.

### 7.4. Conversión

```text
Visita
  → laboratorio
  → demo iniciada
  → interacción significativa
  → CTA
  → contacto
```

El panel deberá aclarar que las métricas reflejan únicamente visitantes que aceptaron analítica.

### 7.5. Contactos

Lista, detalle, historial de estados y acciones administrativas definidas en este documento.

### 7.6. Estado

- salud de web, API y PostgreSQL;
- última limpieza de sesiones;
- último agregado analítico;
- último respaldo local registrado, cuando se implemente;
- errores recientes agrupados.

---

## 8. Retención y eliminación

Una tarea diaria ejecutará:

1. eliminación de eventos analíticos mayores a 180 días;
2. eliminación de resúmenes mayores a 24 meses;
3. archivo o señalización de contactos que alcancen 24 meses sin interacción;
4. eliminación de sesiones administrativas vencidas;
5. eliminación de auditoría mayor a 180 días;
6. eliminación de logs técnicos según su mecanismo de rotación.

Los contactos no se eliminarán automáticamente sin permitir revisión administrativa, pero el panel mostrará los registros que superen la retención para resolverlos. Una solicitud válida de supresión deberá permitir eliminación inmediata del contacto y su historial asociado.

---

## 9. API de referencia

```text
POST   /api/v1/privacy/consent
DELETE /api/v1/privacy/consent
POST   /api/v1/analytics/events
POST   /api/v1/contacts

POST   /api/v1/admin/login
POST   /api/v1/admin/logout
GET    /api/v1/admin/overview
GET    /api/v1/admin/analytics
GET    /api/v1/admin/contacts
GET    /api/v1/admin/contacts/{id}
PATCH  /api/v1/admin/contacts/{id}
DELETE /api/v1/admin/contacts/{id}
GET    /api/v1/admin/status
```

Los contratos definitivos se describirán mediante TypeBox y OpenAPI.

---

## 10. Criterios de aceptación

- [ ] Rechazar analítica no impide navegar ni utilizar las demos.
- [ ] No se registra un evento opcional antes del consentimiento.
- [ ] Cambiar la preferencia detiene inmediatamente los nuevos eventos.
- [ ] Los eventos no aceptan texto libre ni propiedades desconocidas.
- [ ] El formulario guarda el contacto antes de notificar por correo.
- [ ] Un fallo de correo no pierde un contacto almacenado.
- [ ] Mailpit recibe notificaciones en local.
- [ ] Resend está encapsulado detrás de una interfaz.
- [ ] `/admin` requiere autenticación y no es indexable.
- [ ] La contraseña solo se almacena como Argon2id.
- [ ] La sesión administrativa vence a las ocho horas.
- [ ] El panel muestra analítica, contactos y estado.
- [ ] Los períodos de retención se ejecutan y prueban.
- [ ] Puede eliminarse definitivamente un contacto y su historial.
- [ ] Ningún dato descartable de las demos se incorpora a los respaldos permanentes.

---

**Fin del documento.**
