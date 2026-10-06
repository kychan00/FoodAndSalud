---
tipo: pruebas
estado: activo
actualizado: 2026-10-06
---

# Pruebas de Base de Datos

## Objetivo

Validar que el esquema PostgreSQL de FoodAndSalud puede reconstruirse desde
cero únicamente mediante las migraciones versionadas.

## Flujo obligatorio

Después de crear una nueva migración:

    supabase start
        ↓
    supabase db reset
        ↓
    aplicar todas las migraciones
        ↓
    pgTAP
        ↓
    db lint
        ↓
    generar database.types.ts
        ↓
    lint frontend
        ↓
    build frontend
        ↓
    db push --dry-run

## pgTAP

Los archivos se encuentran en:

`supabase/tests/database/`

Actualmente:

- 001_schema_test.sql
- 002_medicine_schema_test.sql

## Regla

Un test de existencia de objetos no debe provocar una excepción antes de que
pgTAP pueda informar el fallo.

Evitar casts `::regclass` cuando el objeto podría no existir.

## Producción

Las migraciones no se aplican al Supabase remoto hasta que:

- db reset local pase;
- pgTAP pase;
- db lint pase;
- TypeScript compile;
- ESLint pase;
- build pase;
- dry-run remoto muestre únicamente las migraciones esperadas.
