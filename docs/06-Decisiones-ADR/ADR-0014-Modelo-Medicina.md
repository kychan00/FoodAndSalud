---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0014 — Catálogo y eventos separados para Medicina

## Contexto

Un medicamento puede utilizarse muchas veces.

Guardar el nombre como texto libre en cada evento dificultaría:

- estadísticas;
- agrupación;
- cambios de nombre;
- favoritos;
- búsquedas;
- asociaciones futuras.

## Decisión

Separar Medicina en dos entidades.

### medicines

Catálogo personal reutilizable.

### medicine_entries

Eventos de consumo.

## Razón

Es el mismo principio utilizado para:

foods
→ food_entries / food_entry_items

## Identidad estadística

Las estadísticas deberán utilizar:

`medicine_id`

y no únicamente el texto visible.

## Eliminación

Los elementos de `medicines` se archivan.

Los eventos individuales sí pueden eliminarse.

## Integración

medicine_entries participa en:

- Timeline
- Calendario
- Patrones

## Consecuencia

FoodAndSalud podrá estudiar posteriormente si un cambio digestivo ocurrió
después de:

- un alimento;
- un medicamento;
- ambos;
- o ninguno.

Esto ayuda a evitar atribuciones simplistas.
