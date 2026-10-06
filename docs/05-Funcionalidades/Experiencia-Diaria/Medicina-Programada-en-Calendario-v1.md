---
tipo: funcionalidad
estado: implementada
fecha: 2026-10-06
fase: "4.5B"
---

# Medicina Programada en Calendario v1

## Objetivo

Mostrar en el Calendario las ocurrencias derivadas de una programación de
Medicina sin convertirlas automáticamente en tomas reales.

## Estados

### Programado

Representa:

una ocurrencia esperada según el horario guardado.

No es:

evidencia de toma.

### Registrada

Representa:

una ocurrencia programada que el usuario convirtió explícitamente en un
`medicine_entry`.

## Calendario mensual

Un día con Medicina pendiente puede mostrar un indicador adicional:

anillo violeta.

El punto sólido de Medicina continúa representando:

un registro real.

## Día seleccionado

Se muestra una sección:

`Medicina programada`.

Cada ocurrencia indica:

- medicamento;
- hora programada;
- dosis, si existe;
- estado.

## Registrar como tomada

Al tocar una ocurrencia pendiente se abre:

`Medicina programada`.

El usuario puede corregir:

- hora real;
- dosis;
- unidad;
- motivo;
- notas.

Al guardar se crea:

`medicine_entries`.

También se conservan:

- schedule_id;
- scheduled_for.

## Hora programada vs hora real

Ejemplo:

programada:

`08:00`

registrada:

`08:07`.

Ambas marcas temporales se conservan.

## Eliminación posterior

Si el usuario elimina posteriormente el `medicine_entry` real:

la ocurrencia vuelve a mostrarse como programada.

La programación original permanece.

## Patrones

Sólo la toma registrada entra a Patrones.

La ocurrencia pendiente no entra.

## Base de datos

Fase 4.5B no requiere una migración adicional.

Utiliza el esquema introducido en 4.5A.
