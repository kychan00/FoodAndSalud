---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "3.11"
---

# ADR-0029 — Ventana Previa de Medicina

## Contexto

Fases anteriores analizaban Medicina posterior a la comida.

Una toma previa podía estar registrada y no aparecer en el contexto del patrón.

## Decisión

Observar también:

6 horas previas a cada comida.

## Naturaleza

La ventana es descriptiva.

No representa duración farmacológica.

## Fronteras

Incluye:

exactamente -6 h.

Excluye:

eventos anteriores a -6 h.

La hora exacta de la comida no pertenece al grupo:

antes.

## Consulta real

El servicio solicita seis horas adicionales antes del inicio del periodo de
análisis.

Así la primera comida de los 90 días puede recuperar también contexto previo.

## Grupos

- antes solamente;
- después solamente;
- ambas;
- ninguna.

Los grupos son mutuamente excluyentes por exposición.

## Limitación

Una misma toma puede preceder a más de una comida cercana.

Esta fase no intenta resolver exposición farmacológica acumulativa.
