---
tipo: prueba
estado: automatizada-y-visual
fecha: 2026-10-06
fase: "4.5D"
---

# Prueba — Exportar Programación de Medicina ICS v1

## Automatizada

Archivo:

`medicineSchedule.ics.test.ts`.

Comprueba:

- VEVENT por ocurrencia;
- DTSTART UTC;
- conversión desde timezone;
- stopped_at;
- TRANSP:TRANSPARENT;
- escape de texto iCalendar;
- nombre de archivo estable;
- exclusión de reason;
- exclusión de notes;
- aclaración de que programado no equivale a tomado.

## Visual

Medicina → Administrar → Programación.

Debe aparecer:

`Exportar calendario`.

Al tocar:

se descarga un archivo `.ics`.

## Apple Calendar

Abrir el archivo.

Comprobar:

- medicamento;
- fechas;
- horas;
- dosis si existe.

## Google Calendar

Importar el archivo `.ics`.

Comprobar:

- medicamento;
- fechas;
- horas.

## Semántica

Después de exportar:

- Timeline no cambia;
- ninguna toma nueva aparece;
- Patrones no cambia.

## Privacidad

Revisar el `.ics`.

No debe contener:

- motivo;
- notas privadas.

## Programación finalizada

Exportar una programación con stopped_at.

No deben existir eventos posteriores a la finalización.
