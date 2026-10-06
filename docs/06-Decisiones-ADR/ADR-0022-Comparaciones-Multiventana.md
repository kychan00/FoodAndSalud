---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "3.4"
---

# ADR-0022 — Comparaciones multiventana

## Contexto

Una comparación única de 24 horas puede ocultar cuándo empieza a aparecer una
diferencia observada.

## Decisión

Los análisis de combinación utilizarán simultáneamente:

- 6 h;
- 12 h;
- 24 h.

## Ejemplo

Si:

Café + Leche a 6 h = 0%

pero:

Café + Leche a 12 h = 100%

el sistema debe conservar esta diferencia temporal.

## Unidad de análisis

Cada ventana tiene:

- exposiciones evaluables;
- respuestas marcadas;
- tasa;
- diferencia;
- estado.

## Ventana principal

La señal general de combinación continúa usando:

24 h

para mantener coherencia con el motor principal actual.

Las ventanas de 6 y 12 horas funcionan como explicación temporal adicional.

## Futuro

Si la evidencia demuestra que otra ventana es más útil para determinados
dominios, la arquitectura permite añadirla sin reemplazar las existentes.
