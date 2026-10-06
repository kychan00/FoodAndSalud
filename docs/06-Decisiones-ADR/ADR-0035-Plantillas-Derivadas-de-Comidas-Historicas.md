---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "4.3"
---

# ADR-0035 — Plantillas Derivadas de Comidas Históricas

## Contexto

Fase 4.1 acelera la captura de alimentos individuales.

Sin embargo, muchas comidas se repiten como combinación.

Ejemplo:

- Café;
- Pan;
- Huevo.

Seleccionar tres atajos sigue requiriendo tres acciones.

## Decisión

Derivar plantillas completas desde las comidas recientes.

## Sin tabla nueva

No se crea una tabla:

`meal_templates`.

Las plantillas se calculan a partir de:

- food_entries;
- food_entry_items;
- foods.

## Razones

1. evita gestión manual adicional;
2. no requiere migración;
3. refleja el comportamiento real;
4. desaparece naturalmente una combinación que deja de utilizarse;
5. permite validar primero la utilidad de la función.

## Identidad de plantilla

Firma:

tipo de comida

-

conjunto normalizado de alimentos.

## Orden

Para deduplicación se ignora el orden.

Para mostrar y reutilizar:

se conserva el orden de la comida más reciente.

## Datos que no se copian

No copiar:

- eaten_at;
- notes.

Esos valores pertenecen al evento original.

## Futuro

Si el usuario necesita plantillas permanentes independientes del historial podrá
evaluarse una entidad explícita en una fase posterior.
