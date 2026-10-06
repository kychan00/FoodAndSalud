---
tipo: bug
estado: cerrado
severidad: baja
fecha: 2026-10-06
fase: "4.5C"
---

# BUG-0018 — Parche de Fixture Dependiente del Formato

## Síntoma

Durante Fase 4.5C:

- la migración lifecycle fue aplicada correctamente;
- database.types.ts fue regenerado;
- el motor de stoppedAt fue escrito;
- los nuevos tests fueron agregados.

El script se detuvo después con:

`ERROR: no pude agregar stoppedAt al fixture.`

## Causa

El script intentó encontrar un fragmento del fixture mediante un bloque textual
con saltos de línea específicos.

El archivo real había sido formateado por Prettier y representaba:

`intervalStartTime: null,`

en una disposición diferente.

La lógica dependía de presentación textual, no de estructura.

## Solución

El archivo de test se reemplazó como módulo completo.

El fixture ahora incluye explícitamente:

`stoppedAt: null`.

## Regla

Para modificaciones estructurales en TypeScript:

- preferir reemplazo completo de módulo pequeño;
- preferir AST o marcadores semánticos si el módulo es grande;
- no depender de saltos de línea generados por Prettier;
- no repetir scripts append-heavy después de un fallo parcial.

## Estado remoto

La migración ya había sido aplicada correctamente.

Por tanto la recuperación NO vuelve a ejecutar:

`supabase db push`.

## Estado

Cerrado.
