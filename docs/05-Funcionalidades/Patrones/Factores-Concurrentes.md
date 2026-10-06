---
tipo: funcionalidad
estado: implementacion
fecha: 2026-10-06
fase: "3.9"
---

# Factores Concurrentes

## Objetivo

Mostrar cuándo una asociación alimentaria aparece repetidamente junto con otros
factores registrados.

Los primeros factores analizados son:

- Medicina;
- otros alimentos de la misma comida.

## Terminología

FoodAndSalud utiliza:

`factor concurrente`

y no:

`confusor demostrado`.

Un verdadero análisis de confusión causal requeriría supuestos y métodos
adicionales.

## Medicina

Las exposiciones del alimento se dividen en:

- con Medicina;
- sin Medicina.

## Definición actual

Una exposición se considera:

`con Medicina`

si existe una toma registrada:

después de la comida

y:

antes del cierre de su ventana efectiva.

## Estadísticas

Para cada contexto se muestran:

- exposiciones;
- evaluables;
- respuestas marcadas;
- tasa.

## Estados

### Sin Medicina concurrente

No existe ninguna toma dentro de las ventanas.

### No se puede separar

Medicina aparece en todas las exposiciones.

### Pocos datos

Uno de los dos contextos tiene menos de dos exposiciones evaluables.

### Mayor con Medicina

La diferencia es:

> = +25 pp.

### Menor con Medicina

La diferencia es:

<= -25 pp.

### Diferencia pequeña

La diferencia queda entre ambos umbrales.

## Alimentos acompañantes

Se reutiliza el motor de combinaciones.

La sección resume:

- frecuencia de acompañamiento;
- exposiciones evaluables;
- diferencia;
- alimentos inseparables.

## Alimento solo

También se muestra cuántas exposiciones fueron registradas sin otros alimentos.

## Limitación importante

El análisis de Medicina todavía no modela:

- dosis;
- vida media;
- efecto farmacológico esperado;
- indicación;
- tomas anteriores a la comida;
- adherencia.

Por tanto:

una diferencia con Medicina no demuestra que el medicamento explique el patrón.
