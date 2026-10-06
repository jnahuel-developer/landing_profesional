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
4. Comprobá Node.js 24 y pnpm 11.
5. Inspeccioná la implementación y los contratos afectados.
Si alguna verificación falla, detenete y reportalo sin modificar archivos.

Alcance obligatorio:
[ALCANCE]

Fuera de alcance:
[EXCLUSIONES]

Plan de commits:
[CANTIDAD_Y_DIVISION]

Mensajes exactos, en este orden:
1. [modxxx - Se ...]
[MENSAJES_ADICIONALES]

Pruebas locales obligatorias:
[COMANDOS_Y_VALIDACIONES]

Reglas particulares de seguridad y datos:
[CONTROLES]

No realices pruebas visuales, comparación de screenshots ni validación estética. No hagas push, MR, merge, rebase, tag ni cambies de rama.

Solo creá cada commit cuando las pruebas que le correspondan estén verdes. Al finalizar, dejá git status limpio.

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
