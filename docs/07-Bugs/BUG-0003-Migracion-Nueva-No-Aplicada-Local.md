---
tipo: bug
estado: cerrado
severidad: media
fecha: 2026-10-06
---

# BUG-0003 — Migración nueva no aplicada en la base local

## Contexto

Durante la Fase 2.2 se creó la migración:

`20261006190000_add_medicine_tracking.sql`

La migración agrega:

- medicines
- medicine_entries
- políticas RLS
- integración con timeline_events

Después se levantó PostgreSQL local mediante Supabase Native Runtime.

## Síntoma

La prueba inicial:

`001_schema_test.sql`

pasó correctamente.

Sin embargo:

`002_medicine_schema_test.sql`

falló porque:

`public.medicines`

no existía todavía en la base local.

## Causa

`supabase start` inició el runtime y reutilizó el estado existente de PostgreSQL.

La base local ya contenía la migración inicial de FoodAndSalud, pero todavía
no había sido reconstruida después de agregar la nueva migración de Medicina.

Por tanto:

`supabase start`

no debe interpretarse como equivalente a:

`supabase db reset`

## Segundo problema detectado

El test utilizaba un cast directo:

`'public.medicines'::regclass`

Cuando la tabla no existe, PostgreSQL lanza una excepción.

Eso provocó que pgTAP abortara antes de completar el plan de pruebas.

## Solución

Después de crear una migración nueva durante desarrollo local:

1. levantar PostgreSQL local;
2. ejecutar `supabase db reset`;
3. reconstruir el esquema desde todas las migraciones versionadas;
4. ejecutar pgTAP;
5. ejecutar db lint;
6. generar tipos TypeScript;
7. validar frontend;
8. hacer dry-run remoto.

## Regla permanente

`supabase start` no sustituye a `supabase db reset`.

Cada nueva migración debe comprobarse reconstruyendo la base local desde cero.

## Mejora de pruebas

Evitar casts directos a:

`::regclass`

cuando la inexistencia de la relación es precisamente una condición que el
test debe poder detectar sin abortar.

Para comprobar RLS se utilizarán:

- pg_class
- pg_namespace

Esto permite devolver false sin detener pgTAP.

## Producción

El fallo ocurrió únicamente en el entorno local.

La migración de Medicina todavía no ha sido aplicada al proyecto remoto.

## Estado

Cerrado.
