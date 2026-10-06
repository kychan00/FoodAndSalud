---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0011 — HashRouter para GitHub Pages

## Contexto

GitHub Pages no proporciona fallback automático para rutas de una SPA.

## Decisión

Utilizar HashRouter.

Ejemplo:

`/FoodAndSalud/#/login`

## Ventajas

- los refresh no generan 404;
- no requiere backend;
- funciona correctamente en GitHub Pages.

## Autenticación

Los callbacks de Supabase regresan primero al documento raíz.

Supabase procesa la sesión y posteriormente React Router administra la
navegación interna.
