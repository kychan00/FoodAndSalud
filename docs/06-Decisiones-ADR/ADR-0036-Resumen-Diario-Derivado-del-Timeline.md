---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "4.4"
---

# ADR-0036 — Resumen Diario Derivado del Timeline

## Contexto

La pantalla Hoy mostraba principalmente:

cantidad total de registros.

Ese número es correcto pero aporta poca información para revisar rápidamente el
día.

## Decisión

Construir un resumen derivado exclusivamente de los eventos ya obtenidos por:

`useDayTimeline`.

## No crear endpoint adicional

No se crea:

- tabla;
- vista;
- RPC;
- consulta adicional.

## Razones

1. los datos ya están disponibles;
2. evita duplicar lógica;
3. evita otra petición de red;
4. garantiza consistencia con el timeline visible;
5. mantiene el resumen reactivo después de editar o eliminar.

## Orden temporal

Aunque el servicio devuelve eventos ordenados, el motor de resumen ordena por:

`occurred_at`.

Así no depende implícitamente del orden de entrada.

## Alcance

Se muestra únicamente:

- conteo;
- último registro de cada tipo;
- hora.

## No interpretar

El resumen no debe convertir:

`Bristol 6`

en:

`malo`

ni:

`Café`

en:

`problemático`.

La interpretación analítica continúa perteneciendo a Patrones.
