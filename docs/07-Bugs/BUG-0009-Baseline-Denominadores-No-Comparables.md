---
tipo: bug
estado: cerrado
severidad: media
fecha: 2026-10-06
fase: "3.5"
---

# BUG-0009 — Baseline con denominadores no comparables

## Problema

El motor original comparaba:

`respuestas marcadas por exposición alimentaria`

contra:

`evacuaciones marcadas por total de evacuaciones`.

Estas tasas utilizan unidades distintas.

## Ejemplo

Una comida puede tener:

- una exposición;
- tres evacuaciones posteriores.

La exposición continúa siendo:

una ventana evaluable.

Pero el baseline antiguo contaba:

tres eventos.

Esto podía modificar la referencia simplemente porque una ventana contenía más
evacuaciones.

## Riesgo

Comparar denominadores distintos podía:

- inflar diferencias;
- reducir diferencias;
- alterar señales;
- hacer difícil interpretar el porcentaje.

## Solución

El baseline principal utiliza ahora:

`ventanas de comida evaluables`.

Para cada alimento el comparador preferido es:

`comidas donde el alimento no estuvo presente`.

## Fallback

Si el alimento aparece en todas las comidas:

se utiliza la referencia global de ventanas de comida.

El sistema no inventa un grupo de control inexistente.

## Evacuaciones individuales

La tasa de evacuaciones marcadas continúa calculándose como información
descriptiva.

No participa directamente como baseline del alimento.

## Mejora adicional

El mismo alimento repetido accidentalmente dentro de una misma comida se
deduplica.

Una comida cuenta como una exposición de ese alimento.

## Estado

Cerrado.
