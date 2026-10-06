---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "4.5C"
---

# ADR-0039 — Ciclo de Vida de Programaciones de Medicina

## Problema

Una programación puede:

- modificarse;
- terminar antes de la fecha prevista;
- dejar de utilizarse.

Eliminarla físicamente puede destruir el contexto de:

`medicine_entries.schedule_id`.

## Decisión

Agregar:

- stopped_at;
- archived_at.

## stopped_at

Representa la finalización exacta.

Las ocurrencias iguales o posteriores a ese instante ya no se generan.

## archived_at

Representa eliminación lógica.

La fila permanece almacenada para conservar identidad histórica.

## Historia real

Editar, finalizar o archivar una programación:

NO elimina medicine_entries.

## Edición

La actualización de:

- medicine_schedules;
- medicine_schedule_times;

utiliza compensación de rollback desde cliente.

Si esta operación se hace más compleja deberá migrarse a una RPC SQL
transaccional.

## Patrones

Sin cambios metodológicos.

Sólo medicine_entries representa exposición registrada.
