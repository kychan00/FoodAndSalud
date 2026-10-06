---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "3.6"
---

# Prueba — Ventanas Superpuestas

## Motor temporal

`mealWindow.test.ts`

Comprueba:

- cierre por siguiente comida;
- evento anterior a la siguiente comida;
- evento posterior a la siguiente comida;
- ventana completa cuando no existe otra comida.

## Asociación

`association.overlap.test.ts`

Caso:

08:00 Café

13:00 Arroz

15:00 Bristol 7

Resultado:

Café:

- 0 exposiciones evaluables;
- 1 ventana interrumpida.

Arroz:

- 1 exposición evaluable;
- 1 respuesta marcada.

## QA

Escenario:

`Comidas superpuestas`

### Días 1–4

08:00 Café

13:00 Arroz

15:00 Bristol 7

### Días 5–8

08:00 Café

13:00 Pan

15:00 Bristol 4

## Resultado esperado

Café:

- 8 exposiciones;
- 0 evaluables;
- 8 ventanas interrumpidas;
- señal insuficiente;
- ventana efectiva de 5 h.

Arroz:

- 4 evaluables;
- 4 marcadas.

Pan:

- 4 evaluables;
- 0 marcadas.

## Objetivo

Impedir que una sola evacuación fortalezca simultáneamente varias comidas
sucesivas.
