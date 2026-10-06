---
tipo: release
estado: completado
fecha: 2026-10-06
fase: "3.9"
---

# Release — Fase 3.9 Factores Concurrentes

## Estado

Completada.

## Objetivo

Mostrar contextos registrados que coinciden repetidamente con una asociación
alimentaria.

## Medicina

Las exposiciones de un alimento se comparan en:

- con Medicina;
- sin Medicina.

Se muestran:

- exposición;
- muestra evaluable;
- tasa;
- diferencia;
- inseparabilidad.

## Otros alimentos

El detalle resume también:

- alimentos acompañantes;
- porcentaje de coexistencia;
- diferencias observadas;
- alimentos inseparables;
- exposiciones del alimento sin acompañantes.

## Terminología

La interfaz utiliza:

`factor concurrente`

y no:

`confusor causal demostrado`.

## QA

Se validaron visualmente:

- Café con Medicina discriminable;
- Café + Medicina inseparable;
- Café + Leche inseparables.

## Calidad

Se aprobaron:

- 76 tests;
- lint;
- TypeScript;
- build;
- bundle inicial menor a 500 kB;
- QA fuera de producción;
- validación visual.

## Documentación

- [[Factores-Concurrentes]]
- [[ADR-0027-Factores-Concurrentes-No-Confusores-Causales]]
- [[Prueba-Factores-Concurrentes]]
