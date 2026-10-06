---
tipo: funcionalidad
estado: implementacion
fecha: 2026-10-06
---

# Integración de Medicina en Timeline

## Evento

Los registros de `medicine_entries` forman parte de:

`public.timeline_events`

## Tipo

`event_type = medicine`

## Subtipo

El nombre del medicamento se utiliza como `event_subtype`.

## Datos disponibles

El timeline puede representar:

- nombre;
- dosis;
- unidad;
- motivo;
- notas;
- hora.

## Color

Medicina utiliza el dominio visual lila / insight.

## Hoy

Medicina aparece como una de las tres acciones principales:

- Registrar comida
- Registrar Bristol
- Medicina

## Calendario

Los días con Medicina utilizan un tercer marcador.

Colores actuales:

- comida → durazno;
- Bristol → azul;
- Medicina → lila.

## Patrones

Medicina forma parte del conjunto de eventos de los últimos 30 días.

Esto es importante porque un cambio digestivo puede coincidir temporalmente
con alimentos y también con medicamentos, suplementos o remedios.

## Regla analítica

FoodAndSalud no deberá atribuir automáticamente una respuesta digestiva a un
alimento ignorando eventos de Medicina cercanos.
