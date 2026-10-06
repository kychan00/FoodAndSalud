---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0007 — Archivar alimentos

## Problema

Eliminar un alimento que ya participa en registros históricos puede destruir
la continuidad de los análisis.

## Decisión

Los alimentos se archivan utilizando:

`archived_at`

## Consecuencia

La API autenticada no tendrá DELETE sobre `foods`.

Un alimento archivado:

- desaparece del selector normal;
- sigue existiendo en registros históricos;
- conserva su identidad estadística.
