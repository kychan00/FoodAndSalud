---
tipo: funcionalidad
estado: implementacion
fecha: 2026-10-06
---

# Autenticación mediante correo y contraseña

## Decisión

FoodAndSalud utiliza Supabase Auth mediante correo electrónico y contraseña.

No se utilizará Google OAuth en la primera versión.

## Flujo de registro

```text
Crear cuenta
    ↓
email + contraseña
    ↓
Supabase Auth
    ↓
correo de confirmación
    ↓
usuario confirma
    ↓
sesión
    ↓
FoodAndSalud
```

## Rutas

```text
#/login
#/signup
#/check-email
#/forgot-password
#/reset-password
```

## Registro

Se utiliza:

`supabase.auth.signUp()`

El correo de confirmación redirige a la raíz de la aplicación.

## Inicio de sesión

Se utiliza:

`supabase.auth.signInWithPassword()`

## Recuperación

Primero:

`supabase.auth.resetPasswordForEmail()`

Después:

`supabase.auth.updateUser({ password })`

## Sesión

Se utiliza:

- persistSession
- autoRefreshToken
- detectSessionInUrl
- PKCE

## Perfil

La migración inicial contiene un trigger sobre `auth.users`.

Cuando se crea una cuenta también se genera automáticamente:

`public.profiles`

## Seguridad

El frontend únicamente utiliza:

- project URL
- publishable key

Nunca:

- secret key
- service_role
- database password
- JWT signing secret
