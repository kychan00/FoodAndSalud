---
tipo: bug
estado: cerrado
severidad: baja
fecha: 2026-10-06
fase: "3.11"
---

# BUG-0015 — Parche startIso dependiente del formato

## Síntoma

La automatización de Fase 3.11 terminó con:

`ERROR: no encontré bloque startIso/endIso.`

## Momento

El fallo ocurrió después de cerrar correctamente Fase 3.10.

Fase 3.10 ya estaba guardada en:

`3dba1c4`.

## Causa

El parche esperaba una representación multilínea de:

- startIso;
- endIso.

El archivo real había sido formateado por Prettier como expresiones compactas:

`const startIso = start.toISOString();`

y:

`const endIso = end.toISOString();`

## Consecuencia

No existía un error funcional en:

`foodDetail.service.ts`.

Falló únicamente la búsqueda textual usada por la automatización.

## Solución

La recuperación utiliza la estructura real del archivo y valida por separado:

- import;
- creación de medicineStartIso;
- única query `taken_at`;
- sustitución exacta del límite inicial.

## Regla

No construir parches suponiendo cómo Prettier distribuirá una expresión entre
líneas.

Cuando sea posible:

buscar tokens semánticos pequeños y validar su cardinalidad.

## Estado

Cerrado.
