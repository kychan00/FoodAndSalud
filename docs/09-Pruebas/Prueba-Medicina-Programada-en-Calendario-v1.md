---
tipo: prueba
estado: automatizada-y-visual
fecha: 2026-10-06
fase: "4.5B"
---

# Prueba — Medicina Programada en Calendario v1

## Automatizada

Archivo:

`medicineSchedule.calendar.test.ts`.

Comprueba:

- ocurrencia pendiente;
- ocurrencia registrada;
- equivalencia temporal entre Z y +00:00;
- aislamiento entre programaciones distintas.

## Visual

### Pendiente

Crear una programación activa.

Abrir Calendario.

Esperado:

- indicador de programación en los días correspondientes;
- sección Medicina programada;
- estado Programado;
- hora;
- medicamento.

### Registrar como tomada

Tocar una ocurrencia.

Esperado:

formulario:

`Registrar como tomada`.

Debe permitir modificar:

- hora real;
- dosis;
- unidad;
- motivo;
- notas.

Guardar.

Esperado:

- la tarjeta pasa a Registrada;
- aparece una toma real en Timeline;
- la hora real aparece en Timeline;
- la hora programada se conserva internamente;
- no se duplica la ocurrencia.

### Eliminación

Eliminar el medicine_entry desde el Timeline.

Esperado:

la ocurrencia vuelve a:

Programado.

### Patrones

Antes de registrar la toma:

la ocurrencia programada no participa.

Después:

el medicine_entry real sí puede participar.

## Regresión

Debe continuar aprobando:

`npm run check:patterns-v1`.
