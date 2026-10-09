# Plantilla de corrección

Esta plantilla se utiliza después de una validación local rechazada o un fallo de GitHub Actions.

```text
Actuá como desarrollador/a senior responsable de corregir exclusivamente el fallo indicado en [MODXXX].

Repositorio: [RUTA]
Rama esperada: [modxxx]
Base ya implementada: [SHAS_EXISTENTES]

Evidencia del fallo:
[WORKFLOW_JOB_COMANDO_LOG]

Resultado esperado:
[RESULTADO]

Alcance permitido de la corrección:
[ALCANCE]

Fuera de alcance:
[EXCLUSIONES]

Antes de editar:
1. Leé AGENTS.md y MODXXX.md.
2. Verificá rama y estado del workspace.
3. Leé la evidencia y el código directamente afectado.
4. Reproducí el fallo solamente si la evidencia no determina suficientemente la causa o si hace falta una medición focalizada.
5. Determiná la causa raíz antes de modificar código.

El propietario ya garantiza la base, el runtime y la preparación del workspace. No compares contra ramas o remotos, no consultes GitHub, no ejecutes una batería base ni revises antecedentes ajenos al fallo.

No reescribas ni modifiques commits existentes. Creá un nuevo commit con el mensaje exacto:
[modxxx - Se corrige ...]

Pruebas focalizadas obligatorias:
[PRUEBAS]

Cuando todas las correcciones estén terminadas, ejecutá una única validación final proporcional al alcance. No repitas pruebas verdes ni ejecutes integración, auditoría o smoke si los componentes afectados no lo requieren.

No realices pruebas visuales. No hagas push, MR, merge, rebase, tag, fetch, amend ni force push.

En la respuesta final informá causa raíz, corrección aplicada, commit creado, pruebas y estado final de git status.
```
