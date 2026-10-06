---
tipo: funcionalidad
estado: implementacion
fecha: 2026-10-06
fase: "3.2"
---

# Análisis de Combinaciones

## Objetivo

Distinguir si una asociación observada cambia según los alimentos que aparecen
junto con el alimento estudiado.

## Ejemplo

Café:

8 exposiciones.

### Con Leche

4 exposiciones.

4 respuestas marcadas.

100%.

### Sin Leche

4 exposiciones.

0 respuestas marcadas.

0%.

La lectura correcta es:

la coincidencia observada es mayor cuando Café aparece junto con Leche.

No:

Leche causa el problema.

## Comparación

Para cada alimento concurrente se calcula:

- exposiciones con el alimento;
- exposiciones sin el alimento;
- exposiciones evaluables;
- respuestas marcadas;
- porcentaje;
- diferencia porcentual.

## Estados

### No se puede separar

El alimento concurrente aparece en todas las exposiciones.

Ejemplo:

Café siempre aparece con Leche.

Con los datos disponibles no es posible separar sus patrones.

### Pocos datos

Uno de los dos contextos tiene menos de dos exposiciones evaluables.

### Mayor con la combinación

La diferencia observada es al menos:

25 puntos porcentuales

a favor de la combinación.

### Diferencia pequeña

Las tasas son relativamente parecidas.

### Menor con la combinación

La coincidencia observada es al menos 25 puntos porcentuales menor cuando el
otro alimento está presente.

Esto no debe interpretarse automáticamente como un efecto protector.

## Alimento sin acompañantes

También se calcula el subconjunto donde el alimento objetivo fue registrado sin
otros alimentos en esa comida.

## Limitación

La comparación continúa siendo observacional.

Otros factores pueden explicar las diferencias.
