---
tipo: funcionalidad
estado: implementacion
fecha: 2026-10-06
fase: "3.10"
---

# Medicamentos Específicos

## Problema anterior

El motor podía detectar:

`Medicina presente`

pero perdía la identidad del medicamento.

Por tanto no podía distinguir entre:

- Omeprazol;
- Ibuprofeno;
- cualquier otro medicamento registrado.

## Cambio

Los registros utilizados por el detalle incluyen ahora:

- medicine_id;
- nombre;
- hora de toma;
- dosis;
- unidad.

## Comparación

Para cada medicamento identificado:

exposiciones del alimento con ese medicamento

vs

exposiciones del mismo alimento sin ese medicamento.

## Estadísticas

Se muestran:

- exposiciones con medicamento;
- porcentaje de las exposiciones;
- muestra evaluable;
- respuestas marcadas;
- tasa;
- diferencia en puntos porcentuales;
- número de tomas;
- mediana del horario relativo;
- dosis registradas.

## Mediana temporal

Ejemplo:

comida:

08:00.

Omeprazol:

09:00.

Resultado:

1.0 h después.

Si existen varias tomas se utiliza la mediana del tiempo relativo.

## Inseparabilidad

Si un medicamento aparece en todas las exposiciones del alimento:

se muestra:

`No se puede separar`.

## Pocos datos

Si uno de los dos contextos tiene menos de dos exposiciones evaluables:

se muestra:

`Pocos datos`.

## Umbrales

Mayor cuando aparece:

> = +25 pp.

Menor cuando aparece:

<= -25 pp.

Entre ambos:

diferencia pequeña.

## Dosis

La dosis se muestra únicamente como contexto.

Esta fase no realiza todavía análisis por dosis.

## Limitaciones

No se modelan todavía:

- Medicina previa a la comida;
- farmacocinética;
- vida media;
- indicación;
- interacción farmacológica;
- causalidad.

## Base de datos

No requiere migración.

Las columnas necesarias ya existen en:

- medicines;
- medicine_entries.
