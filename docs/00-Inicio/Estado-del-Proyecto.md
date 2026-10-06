---
tipo: estado
actualizado: 2026-10-06
---

# Estado del Proyecto

## Estado actual

Fase 2 — Núcleo de seguimiento en desarrollo.

## Fundamentos completados

- React
- TypeScript
- Vite
- Supabase
- PostgreSQL
- Supabase Auth
- RLS
- Obsidian
- Design System
- Mobile First

## Autenticación

Completada y probada End-to-End.

## Experiencia principal

La navegación móvil utiliza:

- Hoy
- Calendario
- Patrones

## Hoy

Incluye:

- fecha actual;
- selector horizontal de siete días;
- resumen digestivo;
- Registrar comida;
- Registrar Bristol;
- Medicina;
- timeline diario.

## Calendario

Implementación inicial:

- vista mensual;
- cambio de mes;
- indicadores de comida;
- indicadores de Bristol;
- timeline por día.

## Patrones

Implementación inicial basada en últimos 30 días:

- comidas;
- evacuaciones;
- Bristol promedio;
- Bristol 6–7.

## Medicina

Visible en interfaz.

Persistencia pendiente.

## Base de datos actual

- profiles
- foods
- food_entries
- food_entry_items
- bathroom_entries
- timeline_events

## Próximos pasos

1. probar registro real de alimentos;
2. probar registro real Bristol;
3. validar Calendar;
4. validar Patrones;
5. diseñar modelo de Medicina;
6. comenzar asociaciones alimento → respuesta digestiva.

## Fase 2.2 — Medicina

El tercer dominio de eventos ya está implementado localmente.

Arquitectura:

medicines
↓
medicine_entries
↓
timeline_events
├── Hoy
├── Calendario
└── Patrones

Validación de base realizada:

- db reset correcto;
- migración inicial aplicada;
- migración Medicina aplicada;
- 18 pruebas pgTAP aprobadas;
- db lint sin errores;
- tipos TypeScript generados.

Pendiente:

- dry-run remoto;
- deploy de migración;
- prueba End-to-End real de Medicina.

## Deploy Fase 2.2

La migración de Medicina fue aplicada al Supabase remoto.

Producción contiene ahora:

- profiles
- foods
- food_entries
- food_entry_items
- bathroom_entries
- medicines
- medicine_entries
- timeline_events

Pendiente antes de cerrar Fase 2.2:

- E2E Comida;
- E2E Bristol;
- E2E Medicina;
- Calendario;
- Patrones;
- persistencia;
- prueba de fecha histórica.
