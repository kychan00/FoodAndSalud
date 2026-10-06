---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0001 — React + TypeScript + Vite

## Contexto

FoodAndSalud necesita una aplicación web rápida, mantenible y apta para
GitHub Pages.

## Opciones consideradas

- React + TypeScript + Vite
- Next.js
- React sin TypeScript
- Aplicación tradicional con backend propio

## Decisión

Utilizar React con TypeScript y Vite.

## Motivos

- Ecosistema maduro.
- Tipado estático.
- Excelente experiencia de desarrollo.
- Build estático.
- Compatible con GitHub Pages.
- Amplio ecosistema de testing.
- Adecuado para una SPA conectada a Supabase.

## Consecuencias positivas

- Arquitectura frontend sencilla.
- Deploy económico.
- Desarrollo rápido.
- Tipado consistente.

## Consecuencias negativas

La aplicación será una SPA.

La navegación y autenticación deberán considerar el hosting bajo un subpath.
