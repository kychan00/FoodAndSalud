---
tipo: base-de-datos
estado: activo
fecha: 2026-10-06
---

# Modelo de Datos — Medicina

## Objetivo

Registrar medicamentos, suplementos y remedios sin repetir nombres en cada
evento.

## Catálogo

Tabla:

`public.medicines`

Representa una entidad reutilizable.

Ejemplos:

- Omeprazol
- Paracetamol
- Probiótico
- Suero oral

## Evento

Tabla:

`public.medicine_entries`

Representa el momento en que el usuario tomó algo.

Campos principales:

- medicine_id
- taken_at
- dose
- unit
- reason
- notes

## Relación

medicines
↓
medicine_entries

Un medicamento puede aparecer en muchos eventos.

## Archivar

Los elementos del catálogo no se eliminan desde la aplicación.

Se utiliza:

`archived_at`

Esto protege la historia y las futuras estadísticas.

## Timeline

Los eventos de medicina se incorporan a:

`public.timeline_events`

Tipos actuales:

- food
- bathroom
- medicine

## Seguridad

Ambas tablas usan Row Level Security.

Cada usuario únicamente puede acceder a sus propios registros.
