---
tipo: bug
estado: cerrado
severidad: media
fecha: 2026-10-06
fase: "3.7"
---

# BUG-0012 — Primera Evacuación vs Respuesta Marcada

## Problema

El motor clasifica una exposición como marcada cuando:

cualquier evacuación dentro de la ventana

cumple los criterios.

El historial mostraba únicamente:

la primera evacuación.

## Caso

08:00 — alimento

12:00 — Bristol 4

18:00 — Bristol 7

El motor correctamente clasificaba la ventana como:

respuesta marcada.

Pero la explicación visual mostraba solamente:

Bristol 4.

## Consecuencia

La interfaz podía parecer contradictoria:

- señal marcada en el motor;
- evacuación normal en el historial.

## Solución

Cada exposición conserva ahora:

- número de evacuaciones de la ventana;
- primera evacuación;
- primera respuesta marcada;
- estado completo de la ventana.

## Interfaz

La gráfica mantiene como punto:

la primera evacuación.

Si una respuesta marcada aparece más tarde:

- el historial la muestra;
- el tooltip la muestra;
- el estado de la exposición se marca correctamente.

## Estado

Cerrado.
