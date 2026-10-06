---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0002 — Supabase

## Contexto

FoodAndSalud necesita:

- autenticación
- PostgreSQL
- API
- seguridad por usuario
- consultas estadísticas
- Google OAuth

## Decisión

Utilizar Supabase como plataforma backend.

## Responsabilidades

- PostgreSQL
- Auth
- Google OAuth
- API
- Row Level Security
- funciones de base de datos
- RPC

## Motivos

Permite mantener una arquitectura sencilla sin operar un servidor backend
tradicional durante las primeras etapas.

Además conserva PostgreSQL como fuente de datos estructurada y portable.

## Consecuencias

La seguridad deberá diseñarse principalmente mediante RLS y constraints,
no mediante confianza en el frontend.
