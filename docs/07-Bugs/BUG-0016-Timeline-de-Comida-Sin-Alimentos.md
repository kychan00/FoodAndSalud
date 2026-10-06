---
tipo: bug
estado: cerrado
severidad: media
fecha: 2026-10-06
fase: "4.0"
---

# BUG-0016 — Timeline de Comida sin Alimentos

## Síntoma

Una comida registrada podía aparecer en Hoy o Calendario únicamente como:

`Desayuno`

`Comida`

`Cena`

sin indicar qué alimentos contenía.

## Causa

La vista:

`timeline_events`

contiene el evento de `food_entries`, pero no agrega los registros de
`food_entry_items` y `foods`.

## Consecuencia

El timeline era cronológicamente correcto, pero poco útil para revisar el día.

## Solución Fase 4.0

El servicio de timeline enriquece los eventos de comida mediante:

- `food_entry_items`;
- `foods`.

Después adjunta:

`food_names`

a cada evento de comida.

## Presentación

Ejemplo:

`Comida`

`Arroz · Pollo · Salsa`

## Base de datos

No se modifica `timeline_events`.

Patrones v1 permanece sin cambios.

## Escalabilidad

Esta estrategia añade consultas adicionales para los eventos de comida.

Si el volumen mensual crece significativamente podrá evaluarse una vista
dedicada o RPC.

Para v1 se prioriza evitar una migración innecesaria mientras se valida la
experiencia diaria.

## Estado

Cerrado.
