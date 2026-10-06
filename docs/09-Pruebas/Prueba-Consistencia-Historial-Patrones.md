---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "3.7"
---

# Prueba — Consistencia del Historial de Patrones

## Archivo

`foodDetail.explainability.test.ts`

## Caso

08:00 — alimento

12:00 — Bristol 4

18:00 — Bristol 7

## Esperado

Primera evacuación:

Bristol 4.

Primera respuesta marcada:

Bristol 7.

Estado de la ventana:

marcada.

## Objetivo

Evitar que el historial contradiga al motor cuando una respuesta marcada ocurre
después de una primera evacuación normal.
