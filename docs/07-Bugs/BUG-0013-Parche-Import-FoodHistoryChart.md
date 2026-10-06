---
tipo: bug
estado: cerrado
severidad: baja
fecha: 2026-10-06
fase: "3.7"
---

# BUG-0013 — Parche del Import de FoodHistoryChart

## Síntoma

La automatización de Fase 3.7 terminó con:

`ERROR: no encontré import de FoodHistoryChart.`

## Archivo

`FoodDetailContent.tsx`

## Causa

El script esperaba una representación textual equivalente a:

`import { FoodHistoryChart, } ...`

mientras el archivo real contenía:

`import { FoodHistoryChart } from "./FoodHistoryChart";`

La semántica era idéntica.

El parche dependía del formato exacto producido por Prettier.

## Solución

En lugar de seguir modificando imports mediante expresiones regulares:

`FoodDetailContent.tsx`

se reemplaza como módulo completo y validado.

## Regla

Cuando una modificación afecta simultáneamente:

- imports;
- propiedades;
- estados;
- bloques visuales;

preferir una sustitución estructural del módulo completo sobre búsqueda textual
frágil.

## Relación

Este bug continúa los aprendizajes de:

- [[BUG-0006-Parche-PatternsPage-Dependiente-de-Formato]]
- [[BUG-0008-Marcador-Ambiguo-Registro-QA]]
- [[BUG-0011-Parche-Import-Combination-Engine]]

## Estado

Cerrado.
