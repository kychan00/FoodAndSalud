---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "3.13"
---

# Auditoría — Patrones v1

## Quality gate

Comando:

`npm run check:patterns-v1`

Ejecuta:

1. todos los tests;
2. ESLint;
3. TypeScript + build;
4. presupuesto de bundles;
5. aislamiento QA.

## Contrato integral

Archivo:

`patternsV1.contract.test.ts`.

Todos los escenarios QA registrados se ejecutan por cada alimento esperado.

El detalle se procesa mediante:

- combinaciones;
- persistencia temporal;
- factores concurrentes;
- Medicina específica;
- timing de Medicina;
- latencia.

Ningún reporte puede producir:

- NaN;
- Infinity;
- -Infinity.

## Fronteras de ventana

Archivo:

`mealWindow.v1.contract.test.ts`.

Comprueba:

- 6 h exactas;
- 12 h exactas;
- 24 h exactas;
- evento exactamente en siguiente comida;
- eventos anteriores o simultáneos al inicio;
- comidas simultáneas.

## Múltiples evacuaciones

Archivo:

`foodDetail.v1.contract.test.ts`.

Comprueba:

- primera evacuación;
- primera respuesta marcada;
- múltiples evacuaciones;
- consistencia del estado de ventana.

## Medicina antes y después

Archivo:

`medicineTiming.both.test.ts`.

Comprueba que una exposición con el mismo medicamento antes y después:

- pertenece al grupo `both`;
- no aparece en `beforeOnly`;
- no aparece en `afterOnly`;
- no aparece en `none`.

## Performance

Límite Patrones v1:

500 kB por chunk JavaScript.

También se verifica:

bundle inicial menor a 500 kB.

## QA

Los IDs exclusivos del Laboratorio QA no pueden aparecer en:

`dist/assets`.
