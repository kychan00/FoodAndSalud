---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0020 — Comparar contextos, no buscar culpables

## Problema

Una comida puede contener múltiples alimentos.

Si ocurre una respuesta digestiva posterior:

Arroz + Café + Leche
→ Bristol 7

no existe suficiente información para asignar automáticamente el evento a uno
de los alimentos.

## Decisión

FoodAndSalud comparará contextos observados.

Ejemplo:

Café + Leche

contra:

Café sin Leche.

## Lenguaje

Permitido:

- mayor coincidencia con;
- menor coincidencia con;
- patrón diferente;
- no se puede separar;
- faltan datos.

Evitar:

- Leche es la culpable;
- Leche causa;
- Café es seguro;
- esta combinación provoca.

## Caso inseparable

Si dos alimentos siempre aparecen juntos:

el sistema debe decir explícitamente que no puede distinguirlos.

## Beneficio

Esta estrategia permite que nueva información futura reduzca la ambigüedad sin
inventar causalidad.
