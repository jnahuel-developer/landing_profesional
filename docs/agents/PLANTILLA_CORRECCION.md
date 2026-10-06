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
3. Reproducí el fallo cuando sea posible.
4. Determiná la causa raíz antes de modificar código.

No reescribas ni modifiques commits existentes. Creá un nuevo commit con el mensaje exacto:
[modxxx - Se corrige ...]

Pruebas obligatorias:
[PRUEBAS]

No realices pruebas visuales. No hagas push, MR, merge, rebase, tag, amend ni force push.

En la respuesta final informá causa raíz, corrección aplicada, commit creado, pruebas y estado final de git status.
```
