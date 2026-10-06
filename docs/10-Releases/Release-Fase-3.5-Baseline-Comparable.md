---
tipo: release
estado: completado
fecha: 2026-10-06
fase: "3.5"
---

# Release — Fase 3.5 Baseline Comparable

## Estado

Completada.

## Problema corregido

El motor original comparaba:

- exposiciones alimentarias;
- contra evacuaciones individuales.

Los denominadores no eran equivalentes.

## Nueva unidad

La comparación principal utiliza:

ventanas de comida.

## Comparador preferido

Para cada alimento:

comidas evaluables donde ese alimento no estuvo presente.

## Fallback

Si no existen suficientes comidas sin el alimento:

se utiliza la referencia global por ventanas de comida.

## Datos de baño

La tasa de evacuaciones individuales marcadas continúa disponible como
información descriptiva.

No funciona como baseline principal del alimento.

## Mejora adicional

Un mismo alimento repetido accidentalmente dentro de la misma comida se cuenta
una sola vez.

## Validación

Se aprobaron:

- tests;
- lint;
- TypeScript;
- build;
- bundle inicial por debajo de 500 kB;
- QA fuera de producción;
- validación visual.

## Documentación

- [[BUG-0009-Baseline-Denominadores-No-Comparables]]
- [[ADR-0023-Baseline-Por-Ventanas-de-Comida]]
- [[Prueba-Baseline-Comparable]]
