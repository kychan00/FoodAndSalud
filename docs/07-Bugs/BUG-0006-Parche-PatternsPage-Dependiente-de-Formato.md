---
tipo: bug
estado: cerrado
severidad: baja
fecha: 2026-10-06
---

# BUG-0006 — Parche de PatternsPage dependiente del formato

## Contexto

Durante la Fase 3.1 se intentó añadir navegación desde:

Patrones
→ alimento
→ detalle

mediante una sustitución textual automática en:

`PatternsPage.tsx`

## Síntoma

El script terminó con:

`ERROR: no encontré inicio de PatternsPage.`

## Causa

El parche esperaba una representación multilínea distinta a la que realmente
tenía el archivo después de Prettier.

La lógica existente de `PatternsPage` era válida.

El problema estaba en la automatización utilizada para modificar el archivo.

## Solución

Se reemplaza `PatternsPage.tsx` de forma explícita utilizando como base el
archivo real versionado en GitHub.

## Regla reforzada

Para archivos React completos o cambios estructurales:

preferir reemplazo explícito del componente

en lugar de:

búsqueda + reemplazo dependiente del formato.

## Relación

Este bug refuerza la regla documentada previamente en:

[[BUG-0004-Parche-Dependiente-de-Formato]]

## Impacto

No hubo pérdida de datos.

No se modificó Supabase.

La Fase 3.0 ya había sido guardada correctamente antes del fallo.

## Estado

Cerrado.
