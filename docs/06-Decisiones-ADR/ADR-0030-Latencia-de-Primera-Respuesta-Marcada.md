---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "3.12"
---

# ADR-0030 — Latencia de Primera Respuesta Marcada

## Contexto

Una ventana de 24 horas puede agrupar respuestas con tiempos muy distintos.

Ejemplo:

- 2 h;
- 10 h;
- 20 h.

Tratar las tres como una sola categoría temporal oculta información relevante.

## Decisión

Analizar:

la primera respuesta marcada

de cada exposición.

## Por qué no la primera evacuación

Una exposición puede tener:

primero una evacuación normal

y:

más tarde una evacuación marcada.

La clasificación agregada ya considera cualquier respuesta marcada dentro de la
ventana.

La latencia debe utilizar la misma semántica.

## Intervalos

- 0–6 h;
- > 6–12 h;
- > 12–24 h.

## Dominancia

Se requiere:

> = 60%

de las respuestas marcadas en un mismo intervalo.

## Muestra mínima

Al menos:

3 respuestas marcadas.

## Mediana

La mediana se utiliza como resumen principal por ser menos sensible a valores
extremos que el promedio.

## Limitación

Los intervalos son descriptivos.

No representan mecanismos fisiológicos ni tiempos de digestión demostrados.
