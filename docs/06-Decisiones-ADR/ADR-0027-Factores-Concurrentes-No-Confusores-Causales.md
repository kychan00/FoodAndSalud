---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "3.9"
---

# ADR-0027 — Factores Concurrentes, no Confusores Causales

## Contexto

Una respuesta digestiva posterior a un alimento puede coincidir con:

- Medicina;
- otros alimentos;
- factores no registrados.

Llamar automáticamente a estos elementos:

`confusores`

implicaría una interpretación causal que el sistema todavía no puede sostener.

## Decisión

La interfaz utilizará el término:

`factor concurrente`.

## Medicina

Se realiza una comparación descriptiva interna:

exposiciones con Medicina

vs

exposiciones sin Medicina.

## Alimentos

Se reutiliza:

análisis de combinaciones.

## Interpretación

Los resultados indican:

diferencias de contexto observadas.

No indican:

- causalidad;
- mediación;
- interacción farmacológica;
- ajuste estadístico de confusión.

## Inseparabilidad

Si un factor aparece en todas las exposiciones:

el sistema debe decir:

`No se puede separar`.

No debe asignar causalidad a ninguno.

## Umbrales

Para la comparación con Medicina se conservan los umbrales descriptivos de
combinaciones:

- > = +25 pp;
- <= -25 pp;
- diferencia pequeña entre ambos.

## Principio

La ausencia de información suficiente debe mostrarse explícitamente y no
resolverse mediante una inferencia artificial.
