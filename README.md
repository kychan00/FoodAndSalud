# FoodAndSalud

Aplicación web personal para registrar alimentación, evacuaciones y estudiar
asociaciones temporales entre ambos tipos de eventos.

## Objetivo

FoodAndSalud busca detectar patrones personales mediante datos estructurados.

No pretende diagnosticar enfermedades ni atribuir causalidad médica.

## Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- Recharts
- Lucide

### Backend

- Supabase
- PostgreSQL
- Supabase Auth
- Row Level Security

### Calidad

- ESLint
- Prettier
- Vitest
- React Testing Library
- Playwright
- pgTAP

### Documentación

`docs/` es un Vault de Obsidian versionado junto con el proyecto.

## Arquitectura

```text
FoodAndSalud
│
├── src/
│   ├── components/
│   ├── features/
│   ├── lib/
│   ├── routes/
│   └── styles/
│
├── supabase/
│   ├── migrations/
│   └── tests/
│
└── docs/
    ├── MOCs
    ├── Arquitectura
    ├── Base de Datos
    ├── Design System
    ├── ADR
    ├── Bugs
    └── Releases
```

## Desarrollo local

La base de datos local utiliza preferentemente el runtime nativo de Supabase
en macOS Apple Silicon.

Consultar:

`docs/06-Decisiones-ADR/ADR-0009-Runtime-Nativo-Supabase.md`

## Seguridad

Todos los datos privados utilizan Row Level Security.

Un usuario solamente puede acceder a sus propios registros.

## Estado

En desarrollo.
