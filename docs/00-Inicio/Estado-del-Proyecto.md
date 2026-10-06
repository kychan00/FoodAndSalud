---
tipo: estado
actualizado: 2026-10-06
---

# Estado del Proyecto

## Estado actual

Fase 1 — Autenticación completada.

## Arquitectura

Frontend:

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod

Backend:

- Supabase
- PostgreSQL
- Supabase Auth
- Row Level Security

Documentación:

- Obsidian
- MOCs
- ADR
- Bugs
- Pruebas
- Releases

## Diseño

FoodAndSalud es Mobile First.

La aplicación está diseñada principalmente para utilizarse desde teléfono.

En escritorio el contenido permanecerá centrado y no se intentará llenar
innecesariamente todo el ancho disponible.

## Base de datos

Tablas:

- profiles
- foods
- food_entries
- food_entry_items
- bathroom_entries

Vista:

- timeline_events

## Autenticación completada

- registro mediante email;
- contraseña;
- confirmación de correo;
- login;
- persistencia de sesión;
- rutas protegidas;
- logout;
- recuperación de contraseña;
- creación automática de profile.

## Prueba End-to-End

Se realizó una prueba real utilizando Supabase remoto.

Resultado:

Aprobada.

Se confirmó:

- auth.users;
- correo recibido;
- correo confirmado;
- sesión creada;
- Home accesible;
- public.profiles creado mediante trigger.

## Próximo hito

Construcción de las funcionalidades principales:

1. navegación móvil;
2. acción Registrar;
3. registro de alimentos;
4. registro de baño;
5. timeline diario.
