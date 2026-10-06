---
tipo: release
estado: completado
fecha: 2026-10-06
fase: "4.0"
---

# Release — Fase 4.0 Centro Diario v1

## Estado

Completada.

## Objetivo

Mejorar el uso cotidiano de:

- Hoy;
- Timeline;
- Calendario;
- captura.

## Timeline

Las comidas muestran ahora:

- tipo de comida;
- alimentos;
- notas;
- hora.

Ejemplo:

`Comida`

`Arroz · Pollo · Salsa`

## Calendario

El día seleccionado permite registrar directamente:

- comida;
- Bristol;
- Medicina.

## Fecha

La captura desde un día histórico utiliza:

día seleccionado + hora local actual.

## Arquitectura

Los nombres de alimentos se enriquecen en el servicio de timeline.

No fue necesario modificar:

`timeline_events`.

## Calidad

Se aprobaron:

- 32 archivos de test;
- 137 tests;
- lint;
- TypeScript;
- build;
- quality gate de Patrones v1;
- validación visual en Hoy;
- validación visual en Calendario;
- validación móvil.

## Patrones

Patrones v1 permaneció congelado y sin regresiones.

## Documentación

- [[Centro-Diario-v1]]
- [[ADR-0032-Enriquecimiento-de-Timeline-en-Cliente]]
- [[BUG-0016-Timeline-de-Comida-Sin-Alimentos]]
- [[Prueba-Centro-Diario-v1]]
