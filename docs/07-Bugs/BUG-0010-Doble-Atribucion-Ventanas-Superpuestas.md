---
tipo: bug
estado: cerrado
severidad: media
fecha: 2026-10-06
fase: "3.6"
---

# BUG-0010 — Doble atribución por ventanas superpuestas

## Síntoma

Ejemplo:

08:00 Café

13:00 Arroz

15:00 Bristol 7

Con ventanas independientes de 24 horas, Bristol 7 podía contar tanto para Café
como para Arroz.

## Problema

Una sola observación podía fortalecer varias comidas sucesivas.

## Solución

La ventana anterior termina cuando comienza una nueva comida.

En el ejemplo:

Café:

08:00–13:00.

Arroz:

13:00–siguiente comida o límite temporal.

Bristol 7 a las 15:00:

ya no pertenece a la ventana de Café.

## Implementación

La regla común se centraliza en:

`mealWindow.ts`

## Cobertura

Se utiliza en:

- asociación;
- baseline;
- detalle;
- combinaciones;
- Medicina concurrente.

## QA

Escenario:

`Comidas superpuestas`

## Estado

Cerrado.
