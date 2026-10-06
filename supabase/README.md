# Supabase — FoodAndSalud

## Directorios

supabase/
├── config.toml
├── migrations/
├── seed.sql
├── functions/
└── tests/

## Fuente de verdad

El Dashboard remoto no es la fuente de verdad del esquema.

La fuente de verdad son las migraciones versionadas.

## Desarrollo local

Flujo obligatorio después de crear una migración nueva:

1. iniciar PostgreSQL local;
2. reconstruir la base;
3. ejecutar pruebas;
4. ejecutar lint de base de datos;
5. generar tipos TypeScript.

Comandos:

    npx supabase start
    npx supabase db reset
    npx supabase test db
    npx supabase db lint --local

## Regla importante

`supabase start` inicia el runtime y la base local.

No debe asumirse que aplica automáticamente una migración nueva sobre una
base local que ya existía.

Después de crear una nueva migración se debe ejecutar:

    npx supabase db reset

Esto reconstruye la base local utilizando todas las migraciones versionadas.

## Runtime

FoodAndSalud utiliza preferentemente Native Runtime para las validaciones
locales de PostgreSQL debido a su menor consumo de memoria.

## Remoto

Para revisar cambios:

    npx supabase migration list
    npx supabase db push --dry-run

Para aplicar cambios después de validarlos:

    npx supabase db push

## Regla crítica

Nunca ejecutar:

    npx supabase db reset --linked

contra producción.
