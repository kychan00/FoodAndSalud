---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "3.4"
---

# Prueba — Combinaciones Multiventana

## Motor

`combination.engine.test.ts`

## Ventanas

- 6 h;
- 12 h;
- 24 h.

## Caso temprano

Café + Leche:

respuesta marcada a 4 horas.

Resultado:

- 6 h → mayor con combinación;
- 12 h → mayor con combinación;
- 24 h → mayor con combinación.

## Caso tardío

Café + Leche:

- Bristol 4 a 4 h;
- Bristol 6–7 a 10 h.

Café sin Leche:

- Bristol 4 a 4 h.

Resultado:

### 6 h

Ambos contextos:

0%.

Estado:

diferencia pequeña.

### 12 h

Café + Leche:

100%.

Café sin Leche:

0%.

Estado:

mayor con combinación.

### 24 h

Se mantiene la diferencia.

## QA

Escenario:

`Café + Leche con patrón tardío`

## Propósito

Detectar errores donde eventos posteriores sean asignados incorrectamente a
ventanas más pequeñas.
