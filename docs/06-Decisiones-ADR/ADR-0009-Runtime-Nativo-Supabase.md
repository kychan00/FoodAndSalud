---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0009 — Runtime nativo de Supabase para desarrollo local

## Contexto

El stack completo de Supabase mediante Docker Desktop provocó presión excesiva
de memoria y errores internos de almacenamiento read-only.

Ver:

[[BUG-0001-Docker-Supabase-Read-Only-Memory]]

## Decisión

Utilizar el runtime nativo de Supabase en esta Mac como entorno de desarrollo
local predeterminado.

## Arquitectura

Producción:

```text
React
  ↓
Supabase hospedado
```

Desarrollo de base de datos:

```text
Migraciones
    ↓
Supabase CLI
    ↓
Runtime nativo
    ↓
PostgreSQL local
```

## Comando base

```bash
export SUPABASE_EXPERIMENTAL_STACK=1
```

Para pruebas exclusivamente de PostgreSQL:

```bash
npx supabase start \
  --runtime native \
  --preparation on-demand \
  --exclude rest,auth,realtime,storage,functions,studio,mail,analytics,pooler
```

## Motivos

- menor consumo de memoria;
- evita la VM de Docker;
- evita descargar servicios innecesarios;
- permite ejecutar migraciones;
- permite pgTAP;
- permite database lint;
- permite generar tipos TypeScript.

## Regla

No iniciar servicios que una tarea no necesite.

Para migraciones y tests SQL:

PostgreSQL solamente.

Para pruebas de autenticación futuras:

PostgreSQL + Auth + servicios estrictamente requeridos.

## Consecuencia

El runtime nativo es infraestructura exclusivamente local.

El entorno de producción continúa siendo Supabase hospedado.
