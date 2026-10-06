---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "4.5B"
---

# ADR-0038 — Ocurrencias Programadas Derivadas

## Contexto

Una programación puede generar muchas ocurrencias.

Ejemplo:

3 veces al día durante 90 días.

Materializar previamente 270 filas significaría almacenar eventos que todavía
no han ocurrido.

## Decisión

No crear una tabla de ocurrencias futuras.

Las ocurrencias se derivan al consultar un rango temporal.

## Fuente

Se utilizan:

- medicine_schedules;
- medicine_schedule_times;
- motor de recurrencia.

## Ventajas

1. no almacenar cientos de eventos futuros;
2. cambios posteriores en la programación no requieren regenerar filas;
3. programado sigue siendo distinto de realizado;
4. el calendario solicita únicamente el rango que necesita.

## Toma real

Cuando el usuario pulsa:

`Registrar como tomada`

se crea un:

`medicine_entry`.

El registro conserva:

- schedule_id;
- scheduled_for;
- taken_at.

## Identidad

Una ocurrencia se identifica funcionalmente mediante:

schedule_id + scheduled_for.

La base de datos evita que una misma ocurrencia programada se registre dos veces.

## Estado del calendario

Se combinan:

ocurrencias derivadas

con:

medicine_entries vinculados.

Resultado:

- scheduled;
- recorded.

## Patrones

El motor de Patrones no consulta ocurrencias derivadas.

Únicamente analiza `medicine_entries`.
