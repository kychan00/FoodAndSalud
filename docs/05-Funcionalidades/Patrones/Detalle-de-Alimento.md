---
tipo: funcionalidad
estado: implementacion
fecha: 2026-10-06
fase: "3.1"
---

# Detalle de Alimento

## Objetivo

Explicar por qué FoodAndSalud asigna una determinada señal a un alimento.

## Navegación

Patrones
→ Posibles asociaciones
→ Ver detalle

## Pantalla

Muestra:

- alimento;
- señal;
- exposiciones;
- exposiciones evaluables;
- porcentaje de coincidencia;
- Medicina concurrente.

## Ventanas

Se calculan:

- 6 horas;
- 12 horas;
- 24 horas.

## Historial gráfico

Cada exposición puede mostrar la primera evacuación registrada dentro de las
24 horas posteriores.

Datos:

- fecha;
- Bristol;
- urgencia;
- dolor;
- tiempo transcurrido;
- otros alimentos;
- Medicina.

## No evaluable

Si no existe una evacuación posterior dentro de la ventana:

el evento no se considera normal.

Se conserva como:

`No evaluable`

## Co-ocurrencia

Se muestran los alimentos consumidos dentro de la misma comida.

Ejemplo:

Café

- Leche — 75%
- Pan — 50%

## Propósito

La pantalla debe explicar la señal.

No sustituye la observación temporal por una puntuación opaca.
