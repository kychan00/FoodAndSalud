---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "3.7"
---

# ADR-0025 — Medidas Descriptivas de Efecto

## Contexto

Una categoría como:

Señal media

resume información pero no comunica directamente la magnitud de la diferencia.

## Decisión

El detalle del alimento incluirá:

- diferencia absoluta;
- RR descriptivo;
- tamaño de muestra;
- estabilidad leave-one-out.

## Diferencia absoluta

Se expresa en:

puntos porcentuales.

## RR descriptivo

Se calcula únicamente cuando:

- existe un grupo separado sin el alimento;
- existen observaciones evaluables;
- la tasa comparadora es mayor que cero.

## División entre cero

No se mostrará:

`Infinity`.

Se mostrará:

`No estimable`.

## Estabilidad

Se retira una exposición evaluable a la vez y se comprueba si la categoría de
señal permanece igual.

## Ausencia de control

Si el motor necesita usar el baseline global porque no existe un grupo separado
de comidas sin el alimento:

no se declara RR ni estabilidad.

## Lenguaje

Estas métricas son:

descriptivas.

No son inferencia causal ni diagnóstico.
