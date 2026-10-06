---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "4.5D"
---

# ADR-0040 — Calendario Externo como Proyección

## Contexto

Una programación interna puede representarse también en:

- Apple Calendar;
- Google Calendar;
- otros clientes iCalendar.

Sin embargo un evento externo no demuestra que una toma ocurrió.

## Decisión

La exportación `.ics` es únicamente una proyección de:

`medicine_schedules`.

Nunca es fuente de verdad de:

`medicine_entries`.

## Consecuencia

Importar el archivo en un calendario externo:

NO crea tomas.

Eliminar un evento del calendario externo:

NO elimina datos en FoodAndSalud.

Marcar o editar un evento externo:

NO modifica Patrones.

## Snapshot

La exportación es un snapshot.

No se implementa sincronización automática.

## VEVENT por ocurrencia

Se decidió exportar una ocurrencia como un VEVENT individual en lugar de
traducir la programación a reglas RRULE externas.

## Razones

1. reutiliza exactamente el motor de recurrencia ya probado;
2. respeta stopped_at;
3. evita diferencias de interpretación de intervalos;
4. evita depender de la implementación RRULE de cada cliente;
5. preserva las conversiones de zona horaria calculadas por FoodAndSalud.

## Timestamps

Los DTSTART se escriben en UTC.

La hora local original se obtiene previamente usando la zona IANA guardada en la
programación.

## Privacidad

No se incluyen:

- reason;
- notes.

## Disponibilidad

Se usa:

`TRANSP:TRANSPARENT`.

La programación no debe ocupar la agenda como si fuera una reunión.

## Identidad

Los UIDs son deterministas.

Esto reduce duplicación en clientes que respetan identidad iCalendar al volver a
importar una misma versión de la programación.
