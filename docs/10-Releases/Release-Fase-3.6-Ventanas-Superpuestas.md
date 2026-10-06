---
tipo: release
estado: completado
fecha: 2026-10-06
fase: "3.6"
---

# Release — Fase 3.6 Ventanas Superpuestas

## Estado

Completada.

## Problema

Una evacuación podía quedar asociada simultáneamente a varias comidas previas
cuando sus ventanas temporales se superponían.

## Regla implementada

Cada comida inicia una ventana.

La ventana termina cuando ocurre primero:

- el límite temporal;
- una nueva comida.

## Ejemplo

08:00 Café

13:00 Arroz

15:00 Bristol 7

Resultado:

Café:

08:00–13:00.

Arroz:

13:00–siguiente comida o límite.

La evacuación de las 15:00 no fortalece también el Café de las 08:00.

## Cobertura

La regla se aplica a:

- asociaciones;
- baseline;
- detalle;
- combinaciones;
- ventanas 6 / 12 / 24 h;
- Medicina concurrente.

## Transparencia

La interfaz muestra:

- ventanas interrumpidas;
- duración efectiva;
- razón del cierre anticipado.

## Validación

Se aprobaron:

- 50 tests;
- lint;
- TypeScript;
- build;
- bundle inicial menor a 500 kB;
- QA fuera de producción;
- validación visual del escenario `Comidas superpuestas`.

## Documentación

- [[BUG-0010-Doble-Atribucion-Ventanas-Superpuestas]]
- [[BUG-0011-Parche-Import-Combination-Engine]]
- [[ADR-0024-Censura-Por-Nueva-Comida]]
- [[Prueba-Ventanas-Superpuestas]]
