---
tipo: prueba
estado: pendiente
fecha: 2026-10-06
fase: "2.2"
---

# Prueba E2E — Fase 2.2

## Objetivo

Validar el ciclo completo:

UI
→ Supabase
→ Timeline
→ Calendario
→ Patrones

para los tres dominios principales.

## Prueba 1 — Comida

Registrar:

- tipo: Comida
- alimentos:
  - Café
  - Pan
- fecha/hora: actual

### Resultado esperado

- se crea food_entry;
- se crean/reutilizan foods;
- se crean food_entry_items;
- aparece en Hoy;
- aparece en Timeline;
- aparece punto comida en Calendario;
- Patrones incrementa Comidas.

## Prueba 2 — Bristol

Registrar:

- Bristol 4
- urgencia 0
- dolor 0
- fecha/hora actual

### Resultado esperado

- se crea bathroom_entry;
- aparece en Hoy;
- aparece en Timeline;
- aparece punto Bristol en Calendario;
- Patrones incrementa Bristol;
- Bristol promedio se actualiza.

## Prueba 3 — Medicina

Registrar:

- nombre: Omeprazol
- dosis: 20
- unidad: mg
- motivo: Acidez
- fecha/hora actual

### Resultado esperado

- se crea/reutiliza medicine;
- se crea medicine_entry;
- aparece en Hoy;
- aparece como Medicina · Omeprazol;
- aparece dosis/motivo en Timeline;
- aparece punto lila en Calendario;
- Patrones incrementa Medicina.

## Prueba 4 — Reutilización de Medicina

Registrar otra vez:

- Omeprazol
- 20 mg

### Resultado esperado

No debe crear otro elemento duplicado en `medicines`.

Debe reutilizar el mismo `medicine_id`.

## Prueba 5 — Fecha histórica

Desde Hoy seleccionar un día anterior.

Registrar una comida.

### Resultado esperado

La fecha precargada debe corresponder al día seleccionado.

El registro debe aparecer:

- en ese día;
- no en el día actual.

## Prueba 6 — Persistencia

Recargar completamente el navegador.

### Resultado esperado

Todos los registros siguen presentes porque provienen de Supabase.

## Estado

Pendiente de ejecución manual.
