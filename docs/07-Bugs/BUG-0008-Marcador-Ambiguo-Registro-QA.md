---
tipo: bug
estado: cerrado
severidad: baja
fecha: 2026-10-06
fase: "3.4"
---

# BUG-0008 — Marcador ambiguo al registrar escenario QA

## Síntoma

Durante Fase 3.4:

- los tests del motor pasaban;
- los tests directos del nuevo escenario pasaban;
- ESLint fallaba.

Error:

`delayedCombinationScenario is defined but never used`

## Causa

El escenario:

`delayedCombinationScenario`

fue importado correctamente en:

`association.fixtures.ts`

pero no quedó añadido a:

`patternQaScenarios`

## Causa de la automatización

El script buscaba el texto:

`combinationDiscriminationScenario,`

para insertar el nuevo escenario después.

Esa misma cadena aparecía en dos lugares:

1. el bloque de imports;
2. el arreglo `patternQaScenarios`.

La automatización encontró primero el import.

Después comprobó si:

`delayedCombinationScenario,`

existía en el texto posterior.

Como el mismo nombre también estaba en el bloque de imports, el script concluyó
incorrectamente que el escenario ya había sido registrado.

## Consecuencia

El escenario existía y sus tests directos funcionaban, pero:

- ESLint lo consideraba un import sin uso;
- el Laboratorio QA no podía mostrarlo en el selector.

## Solución

La modificación se limita ahora explícitamente al bloque:

`export const patternQaScenarios`

y solamente busca el marcador dentro del cuerpo de ese arreglo.

## Prueba de regresión

Se añadió:

`scenarioRegistry.test.ts`

que comprueba que están registrados:

- `coffee-milk-discrimination`;
- `coffee-milk-delayed`.

## Regla

Cuando una cadena puede aparecer en múltiples regiones del archivo:

no utilizar una búsqueda global como frontera estructural.

Primero se debe aislar explícitamente:

- función;
- objeto;
- arreglo;
- bloque;
- export concreto.

## Relación

Este bug continúa la línea de aprendizajes de:

- [[BUG-0004-Parche-Dependiente-de-Formato]]
- [[BUG-0006-Parche-PatternsPage-Dependiente-de-Formato]]

## Estado

Cerrado.
