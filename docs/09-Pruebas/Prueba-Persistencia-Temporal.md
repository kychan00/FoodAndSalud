---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "3.8"
---

# Prueba — Persistencia Temporal

## Motor

`temporal.engine.test.ts`

## QA

`temporal.qa.test.ts`

## Escenario persistente

Primera mitad:

Café 100%

Control 0%

Diferencia:

+100 pp.

Segunda mitad:

Café 100%

Control 0%

Diferencia:

+100 pp.

Resultado:

Persistente.

## Escenario reciente

Primera mitad:

Café 0%

Control 0%

Diferencia:

0 pp.

Segunda mitad:

Café 100%

Control 0%

Diferencia:

+100 pp.

Resultado:

Más reciente.

## Escenario debilitado

Primera mitad:

Café 100%

Control 0%

Diferencia:

+100 pp.

Segunda mitad:

Café 0%

Control 0%

Diferencia:

0 pp.

Resultado:

Se debilitó.

## Objetivo

Detectar cambios temporales que una tasa agregada puede ocultar.
