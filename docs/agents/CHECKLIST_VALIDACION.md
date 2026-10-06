# Checklist de validación de una mod

## 1. Precondiciones

- [ ] La rama corresponde a `modxxx`.
- [ ] La rama parte del `develop` esperado.
- [ ] No se modificaron `main` ni `develop`.
- [ ] No existen cambios ajenos mezclados.

## 2. Commits

- [ ] La cantidad coincide con el prompt.
- [ ] El orden coincide con el plan.
- [ ] Los mensajes fueron utilizados literalmente.
- [ ] Los mensajes están en español, voz pasiva refleja y tono técnico.
- [ ] No se reescribieron commits sin autorización.
- [ ] Cada commit representa una unidad válida y revisable.

## 3. Alcance

- [ ] Se implementaron todos los criterios obligatorios de `MODxxx.md`.
- [ ] No se adelantó trabajo de otra mod.
- [ ] No se alteraron ADR o especificaciones sin autorización.
- [ ] Las exclusiones fueron respetadas.
- [ ] La documentación afectada fue actualizada.

## 4. Arquitectura y calidad

- [ ] Se respetaron las fronteras entre workspaces.
- [ ] No existen duplicaciones o abstracciones innecesarias evidentes.
- [ ] TypeScript estricto permanece vigente.
- [ ] Los errores no se silencian ni se convierten en éxitos falsos.
- [ ] Las dependencias nuevas están justificadas.
- [ ] Migraciones y contratos son compatibles con el alcance.

## 5. Seguridad

- [ ] No se versionaron secretos ni datos personales.
- [ ] Logs y errores no exponen contenido sensible.
- [ ] Entradas y payloads poseen validación y límites adecuados.
- [ ] Autenticación, sesiones y cookies cumplen sus ADR cuando aplican.
- [ ] No se introdujeron conexiones externas no aprobadas.
- [ ] No se ejecutaron operaciones destructivas sobre datos relevantes.

## 6. Pruebas locales

- [ ] Formato.
- [ ] Lint.
- [ ] Typecheck.
- [ ] Unitarias aplicables.
- [ ] Integración aplicable.
- [ ] Playwright funcional aplicable.
- [ ] Axe aplicable.
- [ ] Lighthouse aplicable.
- [ ] Migraciones desde base limpia cuando corresponda.
- [ ] Build de producción.
- [ ] Toda prueba omitida fue declarada y justificada.

Las pruebas visuales y la comparación con mockups no forman parte de esta checklist. La aceptación visual corresponde al propietario.

## 7. Estado final

- [ ] `git status` está limpio.
- [ ] El informe final contiene SHAs y mensajes.
- [ ] Los riesgos y deuda están declarados.
- [ ] No se afirmó que GitHub Actions pasó antes del push.
- [ ] El resultado puede clasificarse como aprobado, aprobado con observaciones, corrección requerida o rechazado.
