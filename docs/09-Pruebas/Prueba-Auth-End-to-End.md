---
tipo: prueba
estado: aprobada
fecha: 2026-10-06
---

# Prueba End-to-End — Autenticación

## Objetivo

Validar el flujo completo de autenticación de FoodAndSalud contra
el Supabase remoto.

## Flujo probado

Crear cuenta
↓
Supabase Auth
↓
auth.users
↓
correo de confirmación
↓
usuario confirma
↓
sesión autenticada
↓
trigger private.handle_new_user()
↓
public.profiles
↓
ProtectedRoute
↓
Home

## Resultado

Prueba completada correctamente.

## Evidencias funcionales

Se verificó:

- creación de usuario;
- proveedor Email;
- envío del correo de confirmación;
- recepción real del correo;
- confirmación del correo;
- creación de sesión;
- restauración de sesión;
- acceso a ruta protegida;
- lectura del nombre desde metadata;
- visualización de la pantalla Home;
- creación automática del perfil.

## Base de datos

Se verificó manualmente que el trigger de alta creó una fila en:

public.profiles

con:

- id
- display_name
- avatar_url
- timezone
- created_at
- updated_at

## Perfil probado

El registro creado mostró:

display_name = Cristian
timezone = UTC

El id de public.profiles coincide con el UUID correspondiente en auth.users.

## Conclusión

La integración completa funciona:

React
→ Supabase Auth
→ Email verification
→ auth.users
→ trigger private.handle_new_user()
→ public.profiles
→ sesión
→ ProtectedRoute
→ Home
