---
tipo: bug
estado: cerrado
severidad: baja
fecha: 2026-10-06
fase: "3.6"
---

# BUG-0011 — Parche dependiente del formato del import

## Síntoma

La automatización de Fase 3.6 terminó con:

`ERROR: no encontré import de association.engine en combination.engine.ts.`

## Causa

El script esperaba un import multilínea.

El archivo real contenía:

`import { isBathroomAdverse } from "./association.engine";`

en una sola línea.

La semántica era idéntica, pero la representación textual no coincidía.

## Riesgo adicional detectado

El cambio no consistía únicamente en añadir un import.

`getStats` y `buildWindowComparison` también debían recibir el mapa de fronteras
temporales.

Un parche parcial habría sido más frágil que reemplazar el engine completo.

## Solución

`combination.engine.ts` se reemplaza estructuralmente con la versión completa de
Fase 3.6.

## Regla

Cuando un cambio modifica la firma y el flujo de datos de varias funciones del
mismo módulo:

preferir reemplazo completo y validado

sobre múltiples sustituciones textuales dependientes de formato.

## Estado

Cerrado.
