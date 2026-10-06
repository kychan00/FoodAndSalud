---
tipo: funcionalidad
estado: implementacion
fecha: 2026-10-06
fase: "3.6"
---

# Ventanas Interrumpidas por Nueva Comida

## Problema

Una ventana de 24 horas puede contener varias comidas.

Ejemplo:

08:00 — Café

13:00 — Arroz

15:00 — Bristol 7

Sin control de superposición, la misma evacuación podía fortalecer ambas
comidas.

## Regla

La ventana termina cuando ocurre primero:

1. el límite temporal seleccionado;
2. una nueva comida.

## Ejemplo

Café:

08:00.

Siguiente comida:

13:00.

Ventana efectiva:

5 horas.

Una evacuación a las 12:00:

sí pertenece a la ventana.

Una evacuación a las 15:00:

ya no pertenece al Café de las 08:00.

## Ventanas

La misma regla se aplica a:

- 6 h;
- 12 h;
- 24 h.

## No evaluable

Si no existe evacuación antes de la siguiente comida:

la exposición permanece no evaluable.

No se interpreta como una respuesta normal.

## Medicina

La Medicina concurrente utiliza también la ventana efectiva.

## Transparencia

La interfaz muestra:

- número de ventanas interrumpidas;
- ventana efectiva en el historial;
- explicación de por qué terminó antes.

## Limitación

La estrategia es conservadora.

Puede reducir sensibilidad a respuestas realmente tardías cuando existen varias
comidas intermedias.

Su propósito es controlar ambigüedad, no afirmar que una comida posterior
elimina cualquier efecto de una anterior.
