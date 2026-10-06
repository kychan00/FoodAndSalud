---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "3.0"
---

# Prueba — Motor de Asociaciones

## Tipo

Pruebas unitarias mediante Vitest.

## Archivo

`src/features/patterns/association.engine.test.ts`

## Casos

### Clasificación de respuesta

Se valida que:

- Bristol 7 sea respuesta marcada;
- Bristol 4 sin dolor ni urgencia no lo sea;
- urgencia alta pueda marcar una respuesta aunque Bristol sea 4.

### Ranking

Datos sintéticos:

Café
→ respuestas marcadas repetidas

Arroz
→ respuestas normales repetidas

Resultado esperado:

Café se posiciona por encima de Arroz.

### Datos insuficientes

Una exposición sin respuesta posterior no debe considerarse evidencia de daño.

Resultado:

`insufficient`

### Medicina

El motor detecta Medicina dentro de la ventana posterior a un alimento.

El dato funciona como factor concurrente y no como explicación causal.

## Regla

El algoritmo puro debe probarse independientemente de Supabase.
