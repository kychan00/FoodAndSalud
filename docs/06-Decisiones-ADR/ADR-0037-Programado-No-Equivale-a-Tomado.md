---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "4.5A"
---

# ADR-0037 — Programado no Equivale a Tomado

## Contexto

Una agenda de Medicina representa una intención o pauta registrada.

Un evento:

`medicine_entries`

representa una toma que el usuario decidió registrar como realizada.

Confundir ambos conceptos contaminaría:

- timeline;
- estadísticas;
- Patrones.

## Decisión

Crear entidades separadas:

- `medicine_schedules`;
- `medicine_schedule_times`.

Y conservar:

- `medicine_entries`;

como hechos registrados.

## Regla principal

Crear una programación:

NO crea tomas futuras.

## Vinculación futura

`medicine_entries` incorpora opcionalmente:

- schedule_id;
- scheduled_for.

Esto permitirá en Fase 4.5B transformar una ocurrencia programada en una toma
real sin perder la referencia temporal.

## Duplicados

Existe un índice único por:

- user_id;
- schedule_id;
- scheduled_for.

Una ocurrencia programada sólo puede convertirse una vez en toma vinculada.

## Horarios específicos

Se almacenan como hora local:

`medicine_schedule_times.time_of_day`.

## Intervalos

Se almacenan como:

- interval_minutes;
- interval_start_time.

## Zona horaria

Cada programación conserva una zona IANA.

## Seguridad

RLS limita programaciones y horarios al propietario.

## Lenguaje

FoodAndSalud debe utilizar:

- programado;
- horario;
- toma registrada.

Debe evitar afirmar:

- debe tomar;
- dosis recomendada;
- pauta correcta.

El sistema almacena una pauta introducida por el usuario; no la prescribe.
