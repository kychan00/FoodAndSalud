---
tipo: bug
estado: cerrado
severidad: baja
fecha: 2026-10-06
---

# BUG-0002 — setState síncrono dentro de useEffect

## Contexto

Durante la implementación del Bottom Sheet de registro se utilizó un efecto
para regresar el estado interno del componente a `choice` cuando la propiedad
`open` cambiaba a false.

La implementación inicial contenía:

`setMode("choice")`

dentro de un `useEffect`.

## Error

ESLint reportó:

`react-hooks/set-state-in-effect`

React advierte que realizar un setState síncrono dentro de un efecto puede
generar renders encadenados innecesarios.

## Implementación problemática

La lógica era conceptualmente:

open cambia
→ useEffect
→ setMode("choice")
→ nuevo render

## Causa

Se estaba utilizando un efecto para sincronizar dos estados controlados por
React.

No existía ningún sistema externo que justificara el efecto.

## Solución

Se eliminó por completo el `useEffect`.

Se creó una función explícita:

`handleClose()`

que ejecuta:

1. `setMode("choice")`
2. `onClose()`

Ahora el reset ocurre directamente como parte de la acción de cierre.

## Flujo corregido

Cerrar Bottom Sheet
→ handleClose()
→ mode = choice
→ cerrar sheet

## Ventajas

- elimina un render provocado por efecto;
- satisface las reglas actuales de React Hooks;
- hace explícita la transición de estado;
- evita sincronización innecesaria;
- simplifica el componente.

## Regla derivada

No utilizar `useEffect` únicamente para transformar o sincronizar estado React
que puede modificarse directamente durante una acción del usuario.

Antes de crear un efecto preguntar:

¿Estamos sincronizando React con un sistema externo?

Si la respuesta es no, probablemente el efecto no sea necesario.

## Estado

Cerrado.
