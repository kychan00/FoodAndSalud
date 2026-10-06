---
tipo: release
estado: completado
fecha: 2026-10-06
fase: "3.2"
---

# Release — Fase 3.2 Alimento vs Combinaciones

## Estado

Completada.

## Objetivo

Comparar el comportamiento observado de un alimento según el contexto en el
que fue consumido.

## Ejemplo

Café + Leche

contra:

Café sin Leche.

## Estados implementados

- No se puede separar
- Pocos datos
- Mayor con la combinación
- Diferencia pequeña
- Menor con la combinación

## Caso de ambigüedad

Cuando dos alimentos aparecen siempre juntos:

FoodAndSalud declara explícitamente que no puede separarlos con los datos
disponibles.

## QA

Se añadió el escenario:

`Café solo vs Café + Leche`

Resultado esperado:

Café + Leche:

100%

Café sin Leche:

0%

## Validación

La fase terminó con:

- 31 pruebas aprobadas;
- ESLint aprobado;
- TypeScript aprobado;
- build aprobado;
- git diff --check aprobado.

## Bugs

Durante la implementación se documentó:

[[BUG-0007-Type-Widening-Fixture-QA]]

## Principio

FoodAndSalud compara contextos observados.

No asigna automáticamente culpabilidad ni causalidad a un alimento.
