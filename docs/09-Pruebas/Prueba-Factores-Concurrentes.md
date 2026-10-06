---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "3.9"
---

# Prueba — Factores Concurrentes

## Motor

`concurrent.engine.test.ts`

## QA

`concurrent.qa.test.ts`

## Caso Medicina discriminable

Café:

10 exposiciones.

### Con Medicina

6 evaluables.

6 marcadas.

Tasa:

100%.

### Sin Medicina

4 evaluables.

0 marcadas.

Tasa:

0%.

### Diferencia

+100 pp.

### Resultado

Mayor con Medicina.

## Caso Medicina inseparable

Escenario:

`Café + Medicina`.

Medicina aparece en:

6 de 6 exposiciones.

Resultado:

No se puede separar.

## Caso alimento inseparable

Escenario:

`Café + Leche juntos`.

Al analizar Café:

Leche aparece en:

100% de las exposiciones.

Resultado:

No se puede separar.

## Caso sin Medicina

Escenario:

`Café con señal alta`.

Resultado:

Sin Medicina concurrente.

## Objetivo

Evitar que factores registrados junto al alimento queden ocultos detrás de una
sola tasa agregada.
