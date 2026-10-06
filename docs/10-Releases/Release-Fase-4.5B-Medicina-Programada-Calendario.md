---
tipo: release
estado: completado
fecha: 2026-10-06
fase: "4.5B"
---

# Release — Fase 4.5B Medicina Programada en Calendario

## Estado

Completada.

## Calendario

Las ocurrencias programadas aparecen en los días correspondientes.

Se distinguen visualmente:

- Programado;
- Registrada.

## Registro real

Una ocurrencia programada puede convertirse explícitamente mediante:

`Registrar como tomada`.

El usuario puede corregir:

- hora real;
- dosis;
- unidad;
- motivo;
- notas.

## Trazabilidad

La toma conserva:

- schedule_id;
- scheduled_for;
- taken_at.

## Duplicados

Una ocurrencia programada sólo puede vincularse a una toma real.

## Eliminación de la toma

Si se elimina el medicine_entry real:

la ocurrencia reaparece como:

`Programado`.

## Patrones

Las ocurrencias pendientes no participan.

Sólo los medicine_entries reales pueden participar.

## Calidad

Se aprobaron:

- tests;
- lint;
- TypeScript;
- build;
- presupuesto de bundles;
- aislamiento QA;
- contract checks;
- regresión Patrones v1;
- validación visual de calendario;
- registro como tomada;
- no duplicación;
- regreso a Programado al eliminar;
- validación móvil.

## Documentación

- [[Medicina-Programada-en-Calendario-v1]]
- [[ADR-0038-Ocurrencias-Programadas-Derivadas]]
- [[Prueba-Medicina-Programada-en-Calendario-v1]]
