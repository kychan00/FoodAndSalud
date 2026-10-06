---
tipo: arquitectura
estado: aprobado
fecha: 2026-10-06
---

# Arquitectura General

## Visión

FoodAndSalud utiliza una SPA construida en React que consume Supabase
directamente desde el navegador.

```text
Usuario
   │
   ▼
React + TypeScript
   │
   ├── Auth
   ├── Foods
   ├── Bathroom
   ├── Timeline
   └── Insights
   │
   ▼
Supabase JS
   │
   ├── Auth
   ├── PostgreSQL
   ├── RLS
   └── RPC / Functions
```

## Frontend

Stack:

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- Recharts
- Lucide

## Backend

Supabase proporciona:

- PostgreSQL
- Auth
- Email/password authentication
- API
- Row Level Security
- funciones SQL
- RPC
- Edge Functions cuando sean necesarias

## Separación del código

### `src/components/`

Contiene elementos visuales genéricos.

Ejemplos:

- Button
- Card
- Modal
- Input
- Chip
- Slider
- Sheet
- MetricCard

Estos componentes no deben conocer conceptos como:

- alimento
- comida
- evacuación
- Bristol
- asociación

### `src/features/`

Contiene lógica y componentes específicos del dominio.

Dominios iniciales:

```text
auth/
foods/
bathroom/
timeline/
insights/
profile/
```

Ejemplos:

```text
features/foods/components/FoodEntryCard.tsx
features/bathroom/components/BristolSelector.tsx
features/insights/components/FoodAssociationCard.tsx
```

### `src/lib/`

Contiene infraestructura y lógica reutilizable.

Ejemplos:

```text
lib/supabase/
lib/analytics/
lib/validation/
```

### `src/styles/`

Contiene el Design System global.

```text
styles/
├── tokens.css
├── typography.css
├── animations.css
└── globals.css
```

## Regla de dependencias

Los componentes genéricos de `src/components/ui` no dependen de features.

Las features sí pueden utilizar componentes UI.

La lógica estadística no debe vivir dentro de componentes React.

Debe ubicarse en:

```text
src/lib/analytics/
```

o, cuando tenga sentido, ejecutarse directamente en PostgreSQL mediante:

- Views
- SQL Functions
- RPC

## Flujo de datos

```text
Página / Feature
       │
       ▼
TanStack Query
       │
       ▼
Servicio / Repository
       │
       ▼
Supabase JS
       │
       ▼
PostgreSQL
       │
       ▼
RLS
```

## Autenticación

```text
Usuario
   │
   ▼
Registro / Login
   │
   ▼
Email + contraseña
   │
   ▼
Supabase Auth
   │
   ▼
Sesión
   │
   ▼
Aplicación
```

## Seguridad

La aplicación cliente puede conocer:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

La aplicación cliente nunca puede contener:

```text
service_role
database password
JWT signing secret
```

La frontera real de seguridad será PostgreSQL mediante RLS.

## Hosting

Frontend:

GitHub Pages.

Backend:

Supabase.

## GitHub Pages

La aplicación vivirá bajo:

```text
/FoodAndSalud/
```

Por lo tanto Vite deberá utilizar ese `base` para producción.

## Documentación

El directorio:

```text
docs/
```

es un Vault de Obsidian versionado junto con el código.

La documentación es parte del proyecto y no un elemento externo.

## Filosofía del proyecto

Código, arquitectura, decisiones, errores, pruebas y conocimiento deben
evolucionar juntos.
