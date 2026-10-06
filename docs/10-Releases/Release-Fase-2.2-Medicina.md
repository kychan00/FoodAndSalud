---
tipo: release
estado: desplegado
fecha: 2026-10-06
fase: "2.2"
---

# Release — Fase 2.2 Medicina

## Estado

Desplegado a Supabase remoto.

## Migración

`20261006190000_add_medicine_tracking.sql`

## Base de datos

Se agregaron:

- `public.medicines`
- `public.medicine_entries`

También se actualizó:

- `public.timeline_events`

## Seguridad

Las tablas de Medicina utilizan Row Level Security.

El acceso se limita al propietario mediante:

`auth.uid() = user_id`

## Modelo

La arquitectura separa:

medicines
→ catálogo reutilizable

medicine_entries
→ eventos reales de consumo

## Integraciones

Medicina participa en:

- Hoy
- Timeline
- Calendario
- Patrones

## Calendario

Los días con eventos de Medicina utilizan un marcador lila.

## Patrones

La ventana inicial de 30 días incluye:

- comidas;
- Bristol;
- Medicina.

## Validación previa

Antes del despliegue se comprobó:

- db reset local;
- migración inicial;
- migración Medicina;
- 18 pruebas pgTAP;
- db lint;
- TypeScript;
- ESLint;
- build;
- git diff --check;
- db push --dry-run.

## Bugs documentados durante la fase

- [[BUG-0003-Migracion-Nueva-No-Aplicada-Local]]
- [[BUG-0004-Parche-Dependiente-de-Formato]]

## Pendiente

Prueba End-to-End real desde la interfaz.
