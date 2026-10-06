---
tipo: funcionalidad
estado: implementada
fecha: 2026-10-06
fase: "4.0"
---

# Centro Diario v1

## Objetivo

Convertir:

Hoy

y:

Calendario

en puntos reales de captura y revisión cotidiana.

## Hoy

Conserva sus accesos directos a:

- comida;
- Bristol;
- Medicina.

Cuando el usuario navega hacia otro día desde la tira semanal:

el registro utiliza ese día

con:

la hora local actual.

## Timeline

Los eventos de comida muestran ahora:

1. tipo de comida;
2. alimentos;
3. notas, cuando existen;
4. hora.

Ejemplo:

`Comida`

`Arroz · Pollo · Salsa`

`Comí fuera de casa`

`2:30 p. m.`

## Calendario

El día seleccionado permite registrar directamente:

- comida;
- Bristol;
- Medicina.

No es necesario volver a Hoy.

## Fecha de captura desde Calendario

Si el usuario selecciona:

23 de septiembre

y la hora actual es:

14:37

el formulario inicia en:

23 de septiembre · 14:37.

## Actualización

`RegisterSheet` ya invalida las consultas con prefijo:

`timeline`.

Por tanto un nuevo registro vuelve a cargar:

- día;
- mes;
- Hoy;
- Calendario.

## Patrones

Los registros continúan invalidando:

`patterns`.

Patrones v1 no cambia metodológicamente en esta fase.

## Base de datos

No se requiere migración.
