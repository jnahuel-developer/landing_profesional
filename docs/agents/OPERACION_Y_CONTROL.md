# Operación y control de agentes Codex

**Versión:** 1.1  
**Estado:** Aprobado  
**Fecha:** 2026-10-09  

## 1. Propósito

Este procedimiento regula la implementación de las mods de la web base mediante una única instancia de Codex por mod, con control técnico centralizado y promoción Git bajo responsabilidad humana.

El objetivo es obtener cambios reproducibles, probados y auditables sin otorgar al agente autoridad para publicar, integrar o modificar el alcance aprobado.

## 2. Responsabilidades

### Propietario del proyecto

- crea `modxxx` desde el último `develop` aprobado;
- prepara un workspace limpio;
- garantiza que la rama, la base y el entorno inicial son correctos;
- inicia la instancia de Codex con el prompt aprobado;
- realiza la aceptación visual;
- ejecuta push y crea el MR;
- verifica GitHub Actions;
- integra el MR y actualiza las ramas locales.

### DevSecOps Senior

- analiza el estado real previo a cada mod;
- define cantidad, contenido y mensajes de commits;
- genera el prompt de encargo;
- valida la ejecución, el diff, los commits y las pruebas locales;
- clasifica hallazgos y decide si el resultado está listo para push;
- genera prompts de corrección a partir de evidencias locales o remotas.

### Instancia Codex implementadora

- verifica únicamente la rama y la limpieza inicial, salvo evidencia concreta de un problema de entorno;
- implementa exclusivamente la mod asignada;
- ejecuta los controles locales exigidos;
- crea los commits locales autorizados;
- deja el workspace limpio;
- entrega evidencia concreta, sin push ni operaciones remotas.

## 3. Ciclo normal de una mod

1. El propietario actualiza `develop`.
2. El propietario crea y activa `modxxx` desde `develop`.
3. El propietario confirma que `git status` está limpio.
4. El DevSecOps Senior inspecciona el estado actual y prepara el prompt.
5. Codex ejecuta la mod en una única instancia.
6. Codex prueba y crea los commits locales definidos.
7. El DevSecOps Senior valida el resultado.
8. El propietario realiza la aceptación visual cuando corresponda.
9. El propietario hace push y abre el MR hacia `develop`.
10. GitHub Actions ejecuta la validación remota.
11. Si CI y revisión humana son satisfactorios, el propietario integra el MR.
12. El workspace de la mod se retira o reutiliza únicamente después de la integración.

## 4. Política de instancias

- Se utiliza una única instancia principal por mod.
- Una mod con varios commits continúa en la misma instancia.
- No se crean subagentes ni escritores concurrentes.
- Una nueva instancia solo se utiliza para una corrección posterior, una ejecución bloqueada que deba reiniciarse o una validación independiente solicitada expresamente.
- La instancia de corrección trabaja sobre la misma rama y no reescribe commits anteriores salvo autorización.

## 5. Selección de modelo y esfuerzo

Se utilizará el modelo y el nivel de razonamiento mínimos que permitan completar el trabajo con calidad suficiente:

| Tipo de trabajo | Modelo recomendado | Esfuerzo recomendado |
|---|---|---|
| documentación, ajustes localizados y pruebas simples | `gpt-6-luna` | `low` o `medium` |
| implementación normal en varios archivos | `gpt-6.1-sol` | `medium` |
| refactor transversal o decisión técnica compleja | `gpt-6.1-sol` | `high` |
| problema excepcionalmente ambiguo o de máxima exigencia | `gpt-6-astra` | definido expresamente |

No se utilizarán por defecto esfuerzos `xhigh`, `max` o `ultra`. El DevSecOps Senior justificará cualquier excepción en el encargo.

Los prompts referenciarán los documentos existentes y repetirán solamente decisiones, restricciones y criterios indispensables para la tarea. No exigirán leer especificaciones completas cuando basten la definición de la mod, los ADR directamente afectados y el código relevante.

## 6. Política de commits

### Regla predeterminada

Cada mod se implementará en un único commit.

### Uso de varios commits

El DevSecOps Senior podrá definir más de un commit cuando existan unidades que sean:

- coherentes por sí mismas;
- comprobables individualmente;
- reversibles sin dejar el repositorio inválido;
- útiles para revisar una migración, preparación o cambio conductual por separado.

No se dividirán commits únicamente por frontend, backend, tests o documentación si esas partes no funcionan de manera independiente. No se admitirá un commit deliberadamente roto a la espera de otro.

La cantidad se mantendrá al mínimo. Una mod sencilla tendrá un único commit final. En una mod amplia, los commits intermedios podrán recibir controles focalizados, pero la batería final se ejecutará una sola vez cuando la implementación esté completa.

Si la validación final descubre un defecto dentro del alcance, la misma instancia queda autorizada a corregirlo antes de finalizar. Cuando ya existan los commits planificados y no se autorice su reescritura, podrá crear un único commit correctivo adicional con el mensaje exacto definido en el prompt. Un fallo corregible no deberá convertirse en bloqueo por una restricción artificial de cantidad de commits.

### Mensajes

El prompt incluirá literalmente cada mensaje. Formato:

```text
modxxx - Se <acción técnica concreta>
```

Ejemplos válidos:

```text
mod001 - Se inicializan las aplicaciones web y API
mod010 - Se implementa el flujo persistente de contacto
mod014 - Se incorporan las sesiones temporales de demostración
```

Los mensajes serán breves, formales, técnicos, en español, en voz pasiva refleja y sin punto final.

## 7. Preflight

El propietario garantiza el punto de partida. El preflight ordinario del agente se limita a:

```text
git branch --show-current
git status --porcelain
```

La instancia se detendrá si la rama no coincide o si aparecen cambios no informados. No realizará por defecto:

- comparación con ramas locales o remotas;
- `fetch`, consultas a GitHub, inspección de MR o validación de Actions;
- instalación congelada ni batería base de pruebas;
- recuentos históricos de pruebas;
- comprobaciones de versiones de Node.js o pnpm cuando el propietario ya confirmó el entorno.

El runtime, la instalación o la base podrán comprobarse únicamente al iniciar un bloque, después de un cambio de entorno o ante evidencia concreta de incompatibilidad.

## 8. Estrategia de pruebas locales

El prompt especificará una matriz proporcional al riesgo y a los componentes afectados. No se ejecutarán suites completas por cambios parciales ni se repetirá una prueba verde sin una causa técnica.

Durante el desarrollo se utilizarán solamente controles focalizados al completar una unidad lógica, por ejemplo typecheck del workspace afectado o la prueba directamente relacionada. Al terminar la implementación se ejecutarán, en este orden y una sola vez:

1. formato, lint y typecheck aplicables;
2. pruebas unitarias o de componente afectadas;
3. pruebas E2E afectadas;
4. suite completa y build cuando el alcance de la mod o el cierre de un bloque lo justifiquen.

La matriz ampliada se seleccionará por impacto:

- integración con PostgreSQL o Mailpit únicamente ante cambios de API, persistencia, migraciones o correo;
- Playwright y axe para comportamiento o accesibilidad web afectados;
- Lighthouse cuando la mod tenga objetivos explícitos de rendimiento;
- migraciones desde base vacía cuando cambie el esquema;
- auditoría de dependencias cuando cambie el lockfile o al cerrar un bloque o una entrega;
- smoke de producción cuando cambien arranque, configuración, build o runtime.

No se realizarán pruebas visuales automatizadas, comparación de screenshots ni regresión visual. La evaluación estética y la comparación con mockups corresponden al propietario.

Una prueba no aplicable no necesita ejecutarse. Una prueba requerida que falle deberá corregirse dentro del alcance y volver a ejecutarse de forma focalizada; después se realizará una sola pasada final. Solo bloqueará la entrega si no existe una solución defendible dentro del alcance.

## 9. Validación posterior

El DevSecOps Senior revisará:

- rama y limpieza final;
- cantidad, orden y mensajes de commits;
- diff completo contra `develop`;
- cumplimiento del alcance y exclusiones;
- arquitectura y fronteras de workspaces;
- dependencias nuevas;
- migraciones y compatibilidad;
- secretos, datos sensibles y logs;
- pruebas ejecutadas;
- documentación afectada;
- riesgos y deuda.

El resultado se clasificará como:

- **Aprobado:** listo para push.
- **Aprobado con observaciones:** listo para push con deuda no bloqueante explícita.
- **Corrección requerida:** debe agregarse un commit correctivo antes del push.
- **Rechazado:** la implementación debe rehacerse parcial o totalmente.

## 10. Validación remota

El propietario realiza push, MR y revisión de Actions. La instancia implementadora no consulta remotos ni afirma que GitHub Actions está verde. Al finalizar solo comprobará la coherencia de los comandos definidos en los workflows cuando haya modificado scripts, dependencias, configuración de pruebas o los propios workflows.

Si Actions falla, el propietario conservará:

- nombre del workflow y job;
- comando fallido;
- log relevante completo;
- SHA evaluado;
- diferencias entre entorno local y remoto;
- cualquier artefacto útil.

Con esa evidencia se generará un prompt de corrección. Por defecto, la corrección se añadirá como un nuevo commit:

```text
modxxx - Se corrige <causa técnica concreta>
```

No se utilizará `--amend`, rebase o force push salvo decisión explícita del propietario.

## 11. Autoridad y límites

Codex puede:

- leer el repositorio;
- editar archivos dentro del alcance;
- instalar dependencias justificadas;
- ejecutar servicios locales y pruebas;
- aplicar migraciones sobre datos locales descartables;
- crear los commits locales autorizados.

Codex no puede:

- cambiar de rama;
- hacer push, MR, merge, rebase o tag;
- modificar ramas permanentes;
- desplegar;
- utilizar secretos reales;
- alterar decisiones aprobadas;
- aprobar visualmente la implementación;
- ampliar la mod por iniciativa propia.
- consultar o modificar remotos salvo una autorización expresa para analizar evidencia remota.

## 12. Bloqueos

El agente deberá detenerse sin improvisar cuando:

- la rama activa no sea la indicada;
- el workspace no esté limpio al inicio;
- exista evidencia concreta de que el runtime es incompatible;
- aparezcan cambios externos durante la ejecución;
- falte una decisión que cambie el alcance;
- una operación pueda destruir o sobrescribir trabajo;
- una prueba obligatoria no pueda corregirse dentro del alcance.

El informe de bloqueo incluirá evidencia, impacto y la decisión mínima requerida.
