# Reglas de trabajo para agentes

## Alcance y autoridad

- Trabajá exclusivamente sobre la mod indicada en el encargo.
- No amplíes el alcance, adelantes mods posteriores ni alteres decisiones aprobadas.
- Leé el archivo `docs/product/mods/MODxxx.md` asignado y solo los ADR o documentos vinculados con ese trabajo.
- No delegues ni crees subagentes. Cada mod es responsabilidad de una única instancia de Codex.
- Si una decisión necesaria contradice o excede la documentación, detenete y reportá el bloqueo.

## Verificación previa obligatoria

Antes de editar:

1. verificá que la rama activa sea exactamente la `modxxx` indicada;
2. verificá que el workspace esté limpio;
3. comprobá Node.js 24 y pnpm 11;
4. inspeccioná la implementación existente y los contratos afectados.

Si la rama es incorrecta, existen cambios previos o el entorno no cumple los requisitos, no edites ni intentes corregirlo: reportá el problema.

## Implementación

- Respetá TypeScript estricto, las fronteras entre workspaces y las convenciones existentes.
- Buscá implementaciones previas antes de agregar helpers o dependencias.
- No incorpores servicios, abstracciones o infraestructura no exigidos por la mod.
- Toda dependencia nueva debe ser necesaria, mantenida y quedar justificada en el informe final.
- No modifiques ADR, especificaciones funcionales ni el alcance de la mod salvo autorización explícita.
- `docs previos de ChatGPT/`, cuando exista localmente, es material histórico de solo lectura.
- No expongas ni versiones secretos, credenciales, tokens, cookies o datos personales.

## Pruebas

- Ejecutá todas las pruebas exigidas por el encargo y por la mod.
- Como mínimo, ejecutá los controles aplicables de formato, lint, tipos, pruebas y build.
- Las pruebas funcionales de interfaz, Playwright, axe y Lighthouse están permitidas cuando correspondan.
- No realices pruebas visuales, comparación de screenshots, regresión visual ni aprobación estética.
- No generes capturas para validar mockups salvo solicitud explícita del propietario.
- La aceptación visual siempre corresponde al propietario del proyecto.
- No declares éxito para una prueba que no ejecutaste.

## Git y commits

- No cambies de rama ni crees otras ramas.
- No hagas push, MR, merge, rebase, tag, force push ni operaciones sobre remotos.
- No uses comandos destructivos ni descartes cambios ajenos.
- No modifiques commits existentes ni uses `--amend` salvo autorización explícita.
- Creá exactamente la cantidad de commits indicada en el encargo y utilizá literalmente los mensajes suministrados.
- Los mensajes tendrán el formato `modxxx - Se <acción técnica>`, en español, voz pasiva refleja, tono formal y sin punto final.
- Cada commit debe dejar el repositorio en un estado válido y comprobable.
- Si una prueba obligatoria continúa fallando, no crees el commit final: reportá el bloqueo con evidencia.
- Al terminar correctamente, `git status` debe quedar limpio.

## Informe final

Informá de manera concreta:

1. rama verificada;
2. alcance implementado;
3. commits creados, con SHA y mensaje;
4. pruebas ejecutadas y resultado;
5. pruebas no ejecutadas y motivo;
6. archivos o módulos principales modificados;
7. dependencias, migraciones y decisiones relevantes;
8. riesgos o deuda detectada;
9. estado final de `git status`.

No afirmes que GitHub Actions pasó: la validación remota ocurre después del push y es responsabilidad del propietario.

## Referencias operativas

- Proceso completo: `docs/agents/OPERACION_Y_CONTROL.md`.
- Definición de mods: `docs/product/mods/README.md`.
- Jerarquía documental: `docs/README.md`.
