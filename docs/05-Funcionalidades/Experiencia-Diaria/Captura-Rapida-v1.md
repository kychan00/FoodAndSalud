---
tipo: funcionalidad
estado: implementada
fecha: 2026-10-06
fase: "4.1"
---

# Captura Rápida v1

## Objetivo

Reducir el trabajo repetitivo al registrar información cotidiana.

## Principio

Los atajos provienen únicamente de:

- historial del propio usuario;
- catálogo del propio usuario;
- favoritos del propio usuario.

No son recomendaciones médicas ni nutricionales.

## Alimentos

El formulario muestra:

`Atajos`

con alimentos usados recientemente.

También conserva alimentos marcados como favoritos.

Al tocar uno:

se agrega directamente a la comida.

## Búsqueda

Mientras el usuario escribe:

los atajos se filtran por nombre.

Los alimentos ya agregados:

desaparecen de la lista de atajos.

## Medicina

El formulario muestra medicamentos usados recientemente.

Al tocar uno:

- completa el nombre;
- recupera la última dosis cuando existe;
- recupera la última unidad cuando existe;
- usa la unidad predeterminada como fallback.

## Importante

Recuperar una dosis anterior no significa:

recomendar esa dosis.

Es únicamente una función de repetición de un registro previo.

El usuario puede modificarla antes de guardar.

## Ranking

Orden:

1. usados recientemente;
2. favoritos no incluidos anteriormente;
3. resto del catálogo activo.

## Recencia de alimentos

La recencia se basa en:

`food_entries.eaten_at`.

No:

`created_at`.

Esto evita que un registro histórico capturado hoy parezca haber sido consumido
hoy.

## Recencia de Medicina

Se basa en:

`medicine_entries.taken_at`.

## Caché

TanStack Query usa la familia:

`daily-suggestions`.

Después de guardar un registro:

esa familia se invalida.

## Base de datos

No se requiere migración.
