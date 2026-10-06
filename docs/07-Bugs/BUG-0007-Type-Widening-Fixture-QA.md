---
tipo: bug
estado: cerrado
severidad: baja
fecha: 2026-10-06
fase: "3.2"
---

# BUG-0007 — Type widening en fixture QA

## Síntoma

Las pruebas de Vitest pasaban:

31/31

pero:

`npm run build`

fallaba durante:

`tsc -b`

con:

`Type 'string' is not assignable to type 'AssociationSignal'`

## Archivo

`src/features/patterns/fixtures/combinationScenario.ts`

## Contexto

`PatternQaScenario` define:

`expectedSignals: Record<string, AssociationSignal>`

y:

`AssociationSignal`

solamente permite:

- `insufficient`
- `low`
- `medium`
- `high`

## Causa

El nuevo escenario fue declarado primero como un objeto independiente.

TypeScript infirió:

`coffee: string`
`milk: string`

en lugar de conservar:

`coffee: "low"`
`milk: "high"`

como miembros de `AssociationSignal`.

Este comportamiento se conoce como:

literal type widening.

## Solución

El objeto `expectedSignals` utiliza ahora:

`satisfies Record<string, AssociationSignal>`

Esto permite:

- validar el contrato;
- conservar los literales;
- evitar casts amplios;
- detectar valores inválidos en compilación.

## Aprendizaje

`vitest run` valida comportamiento en runtime, pero en la configuración actual no
sustituye el chequeo completo realizado por:

`tsc -b`

Por ello una fase solamente se considera válida cuando pasan:

1. tests;
2. lint;
3. TypeScript/build;
4. git diff --check.

## Estado

Cerrado.
