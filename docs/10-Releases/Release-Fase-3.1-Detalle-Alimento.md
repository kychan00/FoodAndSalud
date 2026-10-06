---
tipo: release
estado: completado
fecha: 2026-10-06
fase: "3.1"
---

# Release — Fase 3.1 Detalle de Alimento

## Estado

Completada.

## Funcionalidad

Desde Patrones es posible abrir cada alimento y examinar por qué recibió una
determinada señal.

## Ventanas temporales

- 6 horas
- 12 horas
- 24 horas

## Información

El detalle muestra:

- exposiciones;
- exposiciones evaluables;
- coincidencia;
- Bristol;
- urgencia;
- dolor;
- tiempo hasta la evacuación;
- Medicina concurrente;
- otros alimentos;
- historial.

## QA

La misma interfaz puede probarse desde el Laboratorio QA mediante fixtures
sintéticos.

Producción y QA comparten:

`FoodDetailContent`

## Principio

La señal debe ser explicable.

FoodAndSalud no debe comportarse como una caja negra.
