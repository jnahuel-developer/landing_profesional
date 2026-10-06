# Operación y control de agentes Codex

**Versión:** 1.0  
**Estado:** Aprobado  
**Fecha:** 2026-10-06  

## 1. Propósito

Este procedimiento regula la implementación de las mods de la web base mediante una única instancia de Codex por mod, con control técnico centralizado y promoción Git bajo responsabilidad humana.

El objetivo es obtener cambios reproducibles, probados y auditables sin otorgar al agente autoridad para publicar, integrar o modificar el alcance aprobado.

## 2. Responsabilidades

### Propietario del proyecto

- crea `modxxx` desde el último `develop` aprobado;
- prepara un workspace limpio;
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

- verifica rama, limpieza y runtime;
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

## 5. Política de commits

### Regla predeterminada

Cada mod se implementará en un único commit.

### Uso de varios commits

El DevSecOps Senior podrá definir más de un commit cuando existan unidades que sean:

- coherentes por sí mismas;
- comprobables individualmente;
- reversibles sin dejar el repositorio inválido;
- útiles para revisar una migración, preparación o cambio conductual por separado.

No se dividirán commits únicamente por frontend, backend, tests o documentación si esas partes no funcionan de manera independiente. No se admitirá un commit deliberadamente roto a la espera de otro.

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

## 6. Pruebas locales

El prompt especificará la matriz exacta. Según el alcance, podrá incluir:

- `pnpm format:check`;
- `pnpm lint`;
- `pnpm typecheck`;
- unitarias;
- integración con PostgreSQL o Mailpit;
- Playwright funcional;
- axe;
- Lighthouse;
- migraciones desde base vacía;
- build de producción;
- validaciones de seguridad específicas.

No se realizarán pruebas visuales automatizadas, comparación de screenshots ni regresión visual. La evaluación estética y la comparación con mockups corresponden al propietario.

Una prueba no ejecutada deberá declararse con su motivo. Una prueba obligatoria fallida bloquea el commit final y la aprobación para push.

## 7. Validación posterior

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

## 8. Validación remota

El propietario realiza push y MR. La instancia local no afirmará que GitHub Actions está verde.

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

## 9. Autoridad y límites

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

## 10. Bloqueos

El agente deberá detenerse sin improvisar cuando:

- la rama activa no sea la indicada;
- el workspace no esté limpio al inicio;
- el runtime sea incompatible;
- aparezcan cambios externos durante la ejecución;
- falte una decisión que cambie el alcance;
- una operación pueda destruir o sobrescribir trabajo;
- una prueba obligatoria no pueda corregirse dentro del alcance.

El informe de bloqueo incluirá evidencia, impacto y la decisión mínima requerida.
