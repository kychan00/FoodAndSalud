---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "3.5"
---

# Prueba — Baseline Comparable

## Archivo

`association.baseline.test.ts`

## Casos

### Evento vs ventana

Dos comidas:

- una con respuesta marcada;
- una sin respuesta marcada.

La segunda tiene dos evacuaciones normales.

Resultado:

baseline por comidas:

50%.

Baseline descriptivo por evacuaciones:

33.3%.

Esto demuestra que una evacuación adicional no cambia el número de ventanas de
comida.

### Comidas sin alimento

Café se compara contra comidas donde Café no estuvo presente.

### Sin control interno

Si Café está presente en todas las comidas:

el motor utiliza la referencia global de comidas.

### Duplicado accidental

Dos rows del mismo alimento dentro de una misma comida:

cuentan como una sola exposición.

## Objetivo

Mantener numerador y denominador conceptualmente comparables.
