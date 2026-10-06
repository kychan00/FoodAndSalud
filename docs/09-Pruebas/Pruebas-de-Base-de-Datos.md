---
tipo: pruebas
estado: activo
---

# Pruebas de Base de Datos

## Objetivos

Las pruebas de PostgreSQL deben verificar:

- estructura
- constraints
- índices críticos
- RLS
- aislamiento entre usuarios
- funciones SQL

## Herramienta

pgTAP mediante Supabase CLI.

## Ubicación

`supabase/tests/database/`

## Comando

```bash
npm run supabase:test
```

## Primera prueba

`001_schema_test.sql`

verifica:

- existencia de las cinco tablas principales;
- RLS habilitado en cada tabla privada.

## Siguiente fase

Agregar pruebas explícitas de:

- usuario A puede leer sus datos;
- usuario B no puede leer datos de A;
- usuario B no puede modificar datos de A;
- usuario anónimo no puede acceder;
- relaciones cruzadas entre usuarios fallan.
