---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "4.2"
---

# ADR-0034 — Registros Históricos vs Catálogos Reutilizables

## Contexto

FoodAndSalud distingue entre:

catálogos reutilizables

y:

eventos históricos.

Ejemplos:

### Catálogo

`foods`

`medicines`.

### Eventos

`food_entries`

`bathroom_entries`

`medicine_entries`.

## Decisión

Editar o eliminar un evento histórico no elimina automáticamente el elemento de
catálogo reutilizable.

## Ejemplo

Eliminar:

`Omeprazol tomado hoy a las 08:00`

no significa eliminar:

`Omeprazol`

del catálogo personal.

## Comidas

Al editar una comida:

los `food_entry_items` se reemplazan conservando los alimentos reutilizables.

## Atomicidad

La edición de alimentos requiere modificar:

- `food_entry_items`;
- `food_entries`.

Supabase JS no abre una transacción SQL cliente.

La implementación v1:

1. resuelve nuevos alimentos antes de modificar;
2. guarda snapshot de items anteriores;
3. reemplaza items;
4. actualiza metadata al final;
5. ante error intenta restaurar el snapshot.

## Limitación

La restauración es compensatoria y no equivale a una transacción ACID.

Si esta operación se vuelve crítica o más compleja deberá migrarse a:

- RPC transaccional;
- función SQL;
- endpoint servidor.

## RLS

Toda lectura, actualización y eliminación incluye:

`user_id`

además del id de registro.
