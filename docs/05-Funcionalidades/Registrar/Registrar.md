---
tipo: funcionalidad
estado: implementacion
fecha: 2026-10-06
---

# Registrar

## Objetivo

Permitir registrar un evento desde Home con el menor número posible de pasos.

## Flujo

Home
→ Registrar
→ Bottom Sheet
→ Alimento o Baño

## Alimento

Permite registrar:

- tipo de comida;
- fecha y hora;
- uno o varios alimentos;
- notas.

## Baño

Permite registrar:

- fecha y hora;
- Bristol 1–7;
- urgencia 0–4;
- dolor 0–4;
- notas.

## Resultado

Después de guardar:

- el Bottom Sheet se cierra;
- TanStack Query invalida el timeline;
- Home se actualiza;
- los contadores cambian;
- el evento aparece en Su día.
