# Plantilla de encargo de una mod

Esta plantilla será completada por el DevSecOps Senior. No debe enviarse con placeholders sin resolver.

```text
Actuá como desarrollador/a senior responsable de implementar exclusivamente [MODXXX].

Repositorio: [RUTA]
Rama esperada: [modxxx]
Documento de alcance: [RUTA_MOD]

Objetivo:
[OBJETIVO_CONCRETO]

Antes de editar:
1. Leé AGENTS.md y el documento de la mod.
2. Verificá que la rama activa sea exactamente [modxxx].
3. Verificá que git status esté limpio.
4. Inspeccioná solamente la implementación, los ADR y los contratos directamente afectados.
Si alguna verificación falla, detenete y reportalo sin modificar archivos.

El propietario ya garantiza la base, el runtime y la preparación del workspace. No compares con `develop` u `origin`, no consultes remotos, no ejecutes una batería base y no cuentes pruebas históricas.

Alcance obligatorio:
[ALCANCE]

Fuera de alcance:
[EXCLUSIONES]

Plan de commits:
[CANTIDAD_Y_DIVISION]

Mensajes exactos, en este orden:
1. [modxxx - Se ...]
[MENSAJES_ADICIONALES]

Si la validación final descubre un defecto corregible dentro del alcance después de crear los commits planificados, corregilo en la misma instancia y utilizá, cuando corresponda, este único commit adicional autorizado:
[modxxx - Se corrigen ...]

Pruebas locales obligatorias:
[COMANDOS_Y_VALIDACIONES]

Reglas particulares de seguridad y datos:
[CONTROLES]

No realices pruebas visuales, comparación de screenshots ni validación estética. No hagas push, MR, merge, rebase, tag, fetch ni cambies de rama.

Durante el desarrollo ejecutá únicamente controles focalizados al cerrar unidades lógicas. Cuando la implementación esté completa, ejecutá la matriz final una sola vez. No repitas pruebas verdes, no ejecutes integración sobre componentes no afectados y no hagas audit o smoke salvo que el alcance lo requiera. Al finalizar, dejá git status limpio.

En la respuesta final informá:
- rama verificada;
- alcance implementado;
- commits con SHA y mensaje;
- pruebas ejecutadas y resultado;
- pruebas no ejecutadas y motivo;
- archivos o módulos principales modificados;
- dependencias, migraciones y decisiones relevantes;
- riesgos o deuda;
- estado final de git status.

No afirmes que GitHub Actions pasó; la validación remota se realizará después del push.
```
