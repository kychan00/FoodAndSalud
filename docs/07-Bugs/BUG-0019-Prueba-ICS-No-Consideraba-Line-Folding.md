---
tipo: bug
estado: cerrado
severidad: baja
fecha: 2026-10-06
fase: "4.5D"
---

# BUG-0019 — Prueba ICS no Consideraba Line Folding

## Síntoma

El test:

`does not export private reason or notes`

fallaba al buscar literalmente:

`Este evento no confirma que la toma haya ocurrido.`

## Evidencia

El archivo generado contenía lógicamente el texto correcto, pero la línea
DESCRIPTION había sido plegada:

`...\\nE`

seguido por:

` ste evento no confirma...`

## Causa

El exportador utiliza line folding de iCalendar para mantener las líneas dentro
del límite previsto.

Una línea plegada se representa físicamente mediante:

`CRLF + espacio`

pero semánticamente sigue siendo la misma línea.

El test comparaba la representación física como si fuera texto continuo.

## Solución

Se añadió:

`unfoldIcs()`.

Las comprobaciones semánticas reconstruyen primero las líneas lógicas eliminando:

`CRLF + espacio/tab`.

## Cobertura adicional

Se agregó una prueba que verifica explícitamente que:

- una línea larga sí se pliega;
- después del unfolding conserva el contenido original.

## Regla

En formatos serializados que admiten folding:

- probar estructura física cuando se valida el formato;
- probar contenido sobre la representación lógica reconstruida.

No debe modificarse una serialización válida únicamente para satisfacer una
assertion textual ingenua.

## Estado

Cerrado.
