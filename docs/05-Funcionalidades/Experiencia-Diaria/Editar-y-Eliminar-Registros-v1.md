---
tipo: funcionalidad
estado: implementada
fecha: 2026-10-06
fase: "4.2"
---

# Editar y Eliminar Registros v1

## Objetivo

Permitir corregir errores de captura sin tener que crear un segundo registro.

## Acceso

Cada evento del timeline dispone de:

`…`

Desde ahí:

- Editar;
- Eliminar.

Disponible en:

- Hoy;
- Calendario.

## Comida

Se puede editar:

- fecha y hora;
- tipo de comida;
- alimentos;
- notas.

Los atajos de Fase 4.1 permanecen disponibles durante la edición.

## Bristol

Se puede editar:

- fecha y hora;
- tipo Bristol;
- urgencia;
- dolor;
- notas.

## Medicina

Se puede editar:

- medicamento;
- fecha y hora;
- dosis;
- unidad;
- motivo;
- notas.

Los atajos personales permanecen disponibles.

## Eliminación

Eliminar afecta únicamente al registro histórico seleccionado.

### Comida

Eliminar `food_entries` elimina automáticamente sus `food_entry_items` mediante
la FK con `ON DELETE CASCADE`.

No elimina alimentos del catálogo.

### Medicina

Eliminar `medicine_entries` no elimina `medicines`.

### Bristol

Elimina únicamente `bathroom_entries`.

## Actualización

Después de editar o eliminar se invalidan:

- timeline;
- patterns;
- daily-suggestions;
- entry-editor.

## Confirmación

Eliminar requiere una pantalla explícita de confirmación.

No se elimina desde el primer toque.

## Base de datos

No requiere migración.

Las políticas RLS existentes ya permiten:

- UPDATE;
- DELETE;

sobre los registros históricos propios.
