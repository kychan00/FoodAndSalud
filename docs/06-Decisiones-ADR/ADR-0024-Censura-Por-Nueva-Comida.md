---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "3.6"
---

# ADR-0024 — Censura por Nueva Comida

## Contexto

Las ventanas temporales podían solaparse.

Una evacuación posterior podía ser utilizada por varias comidas previas.

## Decisión

Cada comida inicia una ventana.

La ventana finaliza cuando ocurre primero:

- el límite temporal;
- la siguiente comida.

## Nombre metodológico

La estrategia se trata como:

censura por nueva exposición.

## Razón

Después de una nueva comida aparece otra exposición que vuelve más ambigua la
atribución temporal.

## Aplicación

La regla se utiliza en:

- motor general;
- baseline;
- detalle;
- ventanas 6 / 12 / 24;
- combinaciones;
- Medicina concurrente.

## Consecuencia

Una ventana nominal de 24 horas puede terminar mucho antes.

## Trade-off

Ventaja:

menos evidencia duplicada.

Costo:

menor sensibilidad a asociaciones de latencia larga.

## Principio

Se prioriza evitar doble atribución sobre capturar asociaciones largas con alta
ambigüedad.
