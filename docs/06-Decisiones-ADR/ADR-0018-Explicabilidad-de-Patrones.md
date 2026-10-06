---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0018 — Explicabilidad de Patrones

## Problema

Una etiqueta como:

`Señal alta`

no explica por qué el motor obtuvo ese resultado.

## Decisión

Cada alimento analizado tendrá una vista de detalle.

## La vista debe permitir inspeccionar

- exposiciones;
- exposiciones evaluables;
- respuesta posterior;
- fecha;
- tiempo transcurrido;
- Bristol;
- urgencia;
- dolor;
- Medicina;
- alimentos concurrentes;
- ventanas 6 / 12 / 24 horas.

## Principio

FoodAndSalud no debe funcionar como una caja negra.

## Motivo

Los datos son observacionales.

El usuario debe poder reconocer:

- información faltante;
- factores concurrentes;
- combinaciones;
- coincidencias;
- límites de la evidencia.

## Consecuencia

La explicabilidad se desarrolla antes de añadir modelos analíticos más
complejos.
