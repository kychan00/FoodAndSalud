---
tipo: funcionalidad
estado: implementacion
fecha: 2026-10-06
fase: "3.4"
---

# Combinaciones por Ventana

## Objetivo

Añadir dimensión temporal al análisis de combinaciones.

Antes se comparaba solamente:

24 horas.

Ahora se comparan:

- 6 horas;
- 12 horas;
- 24 horas.

## Ejemplo

Café + Leche:

### 6 h

0%.

### 12 h

100%.

### 24 h

100%.

Café sin Leche:

### 6 h

0%.

### 12 h

0%.

### 24 h

0%.

## Interpretación

Este escenario sugiere que la diferencia observada no aparece durante las
primeras seis horas.

Empieza a ser visible al ampliar la ventana a doce horas.

## Importancia

Esto es más informativo que decir únicamente:

`Café + Leche = 100%`

porque permite conocer en qué escala temporal aparece la diferencia.

## Estados independientes por ventana

Cada ventana puede clasificarse como:

- no se puede separar;
- pocos datos;
- mayor con combinación;
- diferencia pequeña;
- menor con combinación.

## Evaluabilidad

Una exposición solamente cuenta como evaluable para una ventana si existe al
menos una evacuación dentro de esa ventana.

## Regla

Una respuesta observada a 10 horas:

- no pertenece a la ventana de 6 h;
- sí pertenece a 12 h;
- sí pertenece a 24 h.

## Causalidad

Las ventanas mejoran la descripción temporal.

No prueban causalidad.
