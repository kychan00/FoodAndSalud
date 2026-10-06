---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0010 — Autenticación mediante email y contraseña

## Contexto

FoodAndSalud necesita una autenticación sencilla que no requiera configurar
proveedores sociales externos.

## Decisión

Utilizar Supabase Auth mediante:

- correo electrónico;
- contraseña;
- confirmación de correo.

## Motivos

- menos infraestructura externa;
- flujo fácil de comprender;
- Supabase administra usuarios y sesiones;
- recuperación de contraseña integrada;
- compatible con RLS.

## Confirmación

Las cuentas deben verificar su correo antes de utilizar la aplicación.

## Recuperación

La recuperación utiliza los mecanismos de Supabase Auth.

## Futuro

Los proveedores sociales pueden agregarse posteriormente sin sustituir el
modelo actual.
