---
tipo: bug
estado: cerrado
severidad: baja
fecha: 2026-10-06
---

# BUG-0004 — Script de parche dependiente del formato del código

## Contexto

Durante la Fase 2.2 se intentó modificar automáticamente:

`FoodRegistrationForm.tsx`

mediante un script Python que buscaba un bloque de texto exacto.

## Síntoma

El proceso terminó con:

`ERROR: no encontré el bloque esperado de FoodRegistrationForm.`

## Causa

El script esperaba el formato multilínea original.

Sin embargo, Prettier ya había normalizado partes del componente a una forma
más compacta.

El código funcional era correcto, pero el parche dependía de que la
representación textual coincidiera exactamente.

## Impacto

Ningún dato fue afectado.

Antes del fallo ya se habían completado correctamente:

- `supabase db reset`;
- migración inicial;
- migración de Medicina;
- pgTAP;
- 18 pruebas;
- db lint;
- generación de tipos TypeScript.

El proceso se detuvo antes de terminar las modificaciones frontend.

## Solución

Para cambios estructurales importantes se reemplazarán archivos completos
cuando sea más seguro que realizar sustituciones exactas dependientes del
formato.

Los parches automáticos se reservarán para cambios pequeños y verificables.

## Regla derivada

No depender de bloques completos de código formateado para automatizaciones
de mantenimiento.

Preferir:

1. archivos completos;
2. transformaciones estructurales simples;
3. búsquedas con validaciones explícitas;
4. ejecución posterior de Prettier, ESLint y build.

## Estado

Cerrado.
