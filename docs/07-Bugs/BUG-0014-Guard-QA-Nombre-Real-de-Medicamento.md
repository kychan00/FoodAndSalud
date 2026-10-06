---
tipo: bug
estado: cerrado
severidad: baja
fecha: 2026-10-06
fase: "3.10"
---

# BUG-0014 — Guard QA usando un nombre real de medicamento

## Síntoma

El build de Fase 3.10 terminó correctamente, pero el chequeo final mostró:

`ERROR: fixture QA de Omeprazol entró a producción.`

## Contexto

Las pruebas, lint, TypeScript y build habían terminado correctamente.

El fallo ocurrió únicamente en el guard posterior al build.

## Problema

El guard utilizaba:

`Omeprazol`

como marcador de contenido QA.

Esto es demasiado amplio.

Omeprazol es un nombre válido de medicamento y puede aparecer legítimamente en
código o contenido de producción.

Por tanto:

su presencia por sí sola

no demuestra que un fixture del Laboratorio QA haya sido empaquetado.

## Solución

Los chequeos de aislamiento QA deben utilizar marcadores exclusivos del
laboratorio.

Ejemplos:

- `medicine-discrimination`;
- `Café con Medicina discriminable`;
- `Medicina QA`;
- identificadores ficticios exclusivos del fixture.

## Regla

Nunca utilizar como sentinel de QA:

- nombres reales de medicamentos;
- nombres reales de alimentos;
- términos comunes de la interfaz.

Los sentinels deben ser:

- exclusivos;
- inequívocos;
- imposibles de confundir con datos válidos de producción.

## Estado

Cerrado.
