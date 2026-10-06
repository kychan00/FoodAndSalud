---
tipo: funcionalidad
estado: desplegada-para-validacion
fecha: 2026-10-06
fase: "4.5D"
---

# Exportar Programación de Medicina ICS v1

## Objetivo

Permitir llevar una programación de FoodAndSalud a un calendario externo
mediante un archivo estándar:

`.ics`.

## Acceso

Medicina → Administrar → Programación → Exportar calendario.

## Compatibilidad prevista

El archivo utiliza iCalendar y puede importarse en aplicaciones compatibles,
incluyendo calendarios de Apple y Google.

## Modelo

La exportación es una fotografía de la programación en el momento en que se
descarga.

No existe sincronización bidireccional.

Si la programación cambia posteriormente:

el calendario externo no se modifica automáticamente.

## Ocurrencias

FoodAndSalud utiliza el mismo motor de recurrencia interno para generar los
eventos exportados.

Por tanto respeta:

- fecha inicial;
- fecha final;
- zona horaria;
- horas específicas;
- intervalos;
- stopped_at.

## Finalización

Una programación finalizada sólo exporta las ocurrencias anteriores a:

`stopped_at`.

## Eventos

Cada ocurrencia genera un:

`VEVENT`.

El identificador UID es determinista mediante:

- schedule_id;
- scheduled_for.

## Disponibilidad

Los eventos se exportan como:

`TRANSP:TRANSPARENT`.

Así una toma programada no bloquea por defecto la disponibilidad del usuario en
su calendario.

## Privacidad

El archivo exporta:

- nombre del medicamento;
- dosis programada, si existe;
- fecha;
- hora.

No exporta:

- motivo;
- notas.

Estos campos pueden contener información privada que no necesita salir de
FoodAndSalud.

## Semántica

Cada evento incluye una aclaración:

`Este evento no confirma que la toma haya ocurrido.`

## Patrones

Exportar un calendario:

NO crea medicine_entries.

Por tanto:

NO modifica Patrones.
