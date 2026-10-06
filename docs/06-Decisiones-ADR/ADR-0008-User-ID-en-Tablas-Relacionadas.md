---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0008 — user_id en tablas relacionadas

## Contexto

`food_entry_items` podría inferir al usuario consultando su `food_entry`.

## Decisión

Mantener explícitamente:

`user_id`

en la tabla relacionada.

## Motivos

- RLS más sencillo.
- Consultas más rápidas.
- Índices directos.
- Auditoría explícita.
- Validación de propiedad mediante FK compuesta.

## Integridad

La base de datos comprobará que:

- food_entry
- food
- food_entry_item

pertenecen al mismo usuario.
