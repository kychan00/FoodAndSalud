---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "4.5A"
---

# Prueba — Programación de Medicina v1

## Base de datos

Archivo:

`003_medicine_schedule_schema_test.sql`.

Comprueba:

- medicine_schedules;
- medicine_schedule_times;
- start_date;
- end_date;
- schedule_id en medicine_entries;
- scheduled_for;
- RLS;
- índice único de ocurrencias.

## Motor

Archivo:

`medicineSchedule.engine.test.ts`.

Comprueba:

- N horas específicas al día;
- intervalo continuo;
- fecha de fin inclusiva;
- clipping por rango;
- conversión de zona horaria.

## Visual 4.5A

Abrir:

Medicina → Programar.

Comprobar:

- selector Una toma / Programar;
- fechas inicio/fin;
- Veces al día;
- N inputs de hora;
- modo Cada X horas;
- primera hora programada;
- zona horaria;
- guardado.

## Semántica

Guardar una programación no debe crear una toma en Timeline.

## Regresión

Debe continuar aprobando:

`npm run check:patterns-v1`.
