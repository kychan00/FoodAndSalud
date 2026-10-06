# Supabase — FoodAndSalud

## Directorios

```text
supabase/
├── config.toml
├── migrations/
├── seed.sql
├── functions/
└── tests/
```

## Regla

El Dashboard remoto no es la fuente de verdad del esquema.

La fuente de verdad son las migraciones versionadas.

## Desarrollo

```bash
npx supabase start
npx supabase db reset
npx supabase test db
```

El stack local requiere un runtime compatible con Docker.

## Remoto

```bash
npx supabase link --project-ref rqjeulnuomkowanmegpc
npx supabase db push --dry-run
npx supabase db push
```

Nunca ejecutar `db reset --linked` contra producción.
