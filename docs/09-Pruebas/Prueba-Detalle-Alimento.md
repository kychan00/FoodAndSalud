---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "3.1"
---

# Prueba — Detalle de Alimento

## Archivo

`src/features/patterns/foodDetail.engine.test.ts`

## Casos

### 6 / 12 / 24 horas

Una evacuación 10 horas después:

- no pertenece a 6 h;
- sí pertenece a 12 h;
- sí pertenece a 24 h.

### Evento no evaluable

Una exposición sin evacuación posterior:

- no debe convertirse en resultado normal;
- permanece no evaluable.

### Co-ocurrencia

Si Café aparece dos veces con Leche:

Leche:

- 2 apariciones;
- 100% co-ocurrencia.

### Tiempo transcurrido

08:00 alimento
11:30 evacuación

Resultado:

3.5 horas.

## Propósito

La lógica se prueba independientemente de React y Supabase.
