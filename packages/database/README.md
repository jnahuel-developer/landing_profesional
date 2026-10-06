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
