---
tipo: release
estado: completado
fecha: 2026-10-06
fase: "3.4"
---

# Release — Fase 3.4 Combinaciones Multiventana

## Estado

Completada.

## Funcionalidad

El análisis de combinaciones compara ahora simultáneamente:

- 6 horas;
- 12 horas;
- 24 horas.

## Información

Cada ventana calcula:

- exposiciones evaluables;
- respuestas marcadas;
- porcentaje;
- diferencia;
- estado.

## Caso QA temprano

Café + Leche:

- 6 h → diferencia presente;
- 12 h → diferencia presente;
- 24 h → diferencia presente.

## Caso QA tardío

Café + Leche:

- 6 h → 0%;
- 12 h → 100%;
- 24 h → 100%.

Café sin Leche:

- 6 h → 0%;
- 12 h → 0%;
- 24 h → 0%.

Esto permite observar cuándo empieza a aparecer una diferencia temporal.

## Bug cerrado

[[BUG-0008-Marcador-Ambiguo-Registro-QA]]

## Validación

Se comprobó visualmente el escenario tardío en el Laboratorio QA.

## Principio

La dimensión temporal mejora la descripción observacional.

No demuestra causalidad.
