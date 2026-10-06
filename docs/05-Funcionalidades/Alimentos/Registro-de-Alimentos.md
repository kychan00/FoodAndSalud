---
tipo: funcionalidad
estado: implementacion
fecha: 2026-10-06
---

# Registro de Alimentos

## Modelo

Un evento de alimentación utiliza:

food_entries

y contiene uno o varios:

food_entry_items

Cada item referencia:

foods

## Flujo

El usuario escribe los alimentos individualmente.

Ejemplo:

Comida

- arroz
- pollo
- salsa
- tortilla

## Catálogo reutilizable

Antes de crear un alimento nuevo, la aplicación busca si ya existe en el
catálogo activo del usuario.

Si existe:

se reutiliza su food_id.

Si no existe:

se crea en foods.

## Importancia

La identidad estadística depende de food_id.

No se analizarán simplemente cadenas de texto de cada comida.

## Estado actual

No se registran todavía:

- cantidades;
- unidades;
- categorías.

Esos campos se agregarán posteriormente sin alterar el modelo principal.
