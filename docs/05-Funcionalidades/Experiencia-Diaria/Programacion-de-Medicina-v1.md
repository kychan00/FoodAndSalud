---
tipo: funcionalidad
estado: implementada
fecha: 2026-10-06
fase: "4.5A"
---

# Programación de Medicina v1

## Principio

FoodAndSalud distingue explícitamente:

`programado`

de:

`tomado`.

Una programación no crea automáticamente un:

`medicine_entry`.

Por tanto:

una programación no entra a Patrones como exposición real.

## Modos

Al abrir Medicina aparecen:

- Una toma;
- Programar.

## Horas específicas

El usuario puede indicar:

`N veces al día`

entre 1 y 8.

Después introduce manualmente cada hora.

Ejemplo:

- 08:00;
- 14:00;
- 22:00.

FoodAndSalud no propone esas horas.

## Intervalo

También puede registrar:

`Cada X horas`.

Se captura:

- intervalo;
- primera hora programada.

El intervalo continúa de manera consecutiva entre días.

## Periodo

Toda programación tiene:

- fecha de inicio;
- fecha de fin.

La fecha de fin es inclusiva.

## Zona horaria

Se conserva la zona horaria IANA del dispositivo en el momento de crear la
programación.

Ejemplo:

`America/Mexico_City`.

## Dosis

La programación puede guardar:

- dosis;
- unidad;
- motivo;
- notas.

Estos datos describen lo introducido por el usuario.

No constituyen una pauta propuesta por FoodAndSalud.

## Programaciones existentes

El formulario permite revisar las programaciones ya guardadas.

## Calendario

La expansión de ocurrencias ya existe en el motor.

Su presentación dentro del Calendario se implementa en:

Fase 4.5B.

## Patrones

Patrones v1 sigue utilizando exclusivamente:

`medicine_entries`.

Nunca:

`medicine_schedules`.
