# @portfolio/database

Cliente Drizzle, esquemas PostgreSQL, migraciones y semillas. Solo la API y las tareas de mantenimiento podrán depender de este paquete; el frontend no lo importará directamente.

## Configuración y comandos

`DATABASE_URL` es obligatoria y debe usar el protocolo `postgresql:` o `postgres:`. Los mensajes de validación no incluyen el valor recibido.

Desde la raíz del repositorio:

```powershell
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

Las migraciones versionadas crean los esquemas de aplicación. La semilla técnica es idempotente y no inserta datos funcionales en MOD002.

MOD010 añade `platform.contacts` y `platform.contact_events` mediante
`0001_long_mister_fear.sql`. El repositorio de contactos usa el pool existente:
recepción y evento son atómicos; el resultado del correo se registra en otra
transacción. Los estados son enums PostgreSQL. El correo no es único; no se
guardan honeypot, tiempo de formulario, IP ni errores crudos del proveedor.
Las pruebas crean bases temporales independientes, migran desde vacío dos veces
y verifican rollback sin modificar datos del propietario.
