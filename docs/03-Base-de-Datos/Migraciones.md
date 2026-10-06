---
tipo: base-de-datos
estado: activo
---

# Migraciones

## Fuente de verdad

La estructura de la base de datos debe existir en:

`supabase/migrations/`

No debemos depender de recordar cambios hechos manualmente desde el Dashboard.

## Flujo

```text
Cambio
  ↓
Migración SQL
  ↓
Revisión
  ↓
Test local
  ↓
db push --dry-run
  ↓
db push
  ↓
Producción
```

## Regla

Nunca ejecutar directamente cambios destructivos en producción sin una
migración versionada.

## Comandos principales

```bash
npx supabase migration list

npx supabase db push --dry-run

npx supabase db push
```

## Tipos TypeScript

Después de modificar el esquema remoto:

```bash
npx supabase gen types \
  --lang typescript \
  --linked \
  > src/lib/supabase/database.types.ts
```

El frontend deberá utilizar estos tipos generados.
