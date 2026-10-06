---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0019 — Vista compartida entre producción y QA

## Problema

Crear una pantalla visual exclusiva para QA podría producir una situación donde:

QA funciona

pero:

la pantalla real funciona distinto.

## Decisión

La visualización del detalle de alimento se extrae a:

`FoodDetailContent`

## Producción

La fuente de datos es:

Supabase.

## QA

La fuente de datos son:

fixtures sintéticos.

## Contrato compartido

Ambas fuentes producen:

`FoodDetailReport`

## Resultado

Real:

FoodDetailReport
→ FoodDetailContent

QA:

FoodDetailReport
→ FoodDetailContent

## Ventaja

Las pruebas visuales validan el mismo componente utilizado por el usuario real.

## Regla

Cuando sea razonable:

QA debe cambiar la fuente de datos

y no duplicar la interfaz que pretende comprobar.
