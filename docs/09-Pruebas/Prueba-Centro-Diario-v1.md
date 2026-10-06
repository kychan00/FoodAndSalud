---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "4.0"
---

# Prueba — Centro Diario v1

## Día seleccionado

Archivo:

`date.registration.test.ts`.

Comprueba que:

fecha seleccionada

-

hora actual

produce un timestamp local de registro coherente.

## Timeline enriquecido

Archivo:

`timeline.enrichment.test.ts`.

Comprueba:

- nombres de alimentos;
- `sort_order`;
- eventos no alimentarios;
- ausencia de nombres inventados.

## Presentación

Archivo:

`timeline.presentation.test.ts`.

Comprueba:

### Comida

`Desayuno`

-

`Café · Pan`.

### Bristol

`Baño · Bristol 6`.

### Medicina

`Medicina · Omeprazol`.

## Regresión de Patrones

Después de Fase 4.0 debe seguir aprobando:

`npm run check:patterns-v1`.
