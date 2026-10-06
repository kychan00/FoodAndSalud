---
tipo: release
estado: completado
fecha: 2026-10-06
fase: "3.8"
---

# Release — Fase 3.8 Persistencia Temporal

## Estado

Completada.

## Objetivo

Distinguir entre una asociación agregada y un patrón que cambia a través del
historial.

## División

Las comidas se ordenan cronológicamente y se dividen en dos mitades:

- periodo anterior;
- periodo reciente.

## Cálculo

Cada mitad vuelve a comparar:

alimento

vs

comidas sin alimento.

## Estados

La aplicación puede mostrar:

- Persistente;
- Más reciente;
- Se debilitó;
- Estable;
- Variable;
- Datos insuficientes.

## Escenarios QA

### Café persistente

Anterior:

+100 pp.

Reciente:

+100 pp.

Resultado:

Persistente.

### Café con patrón reciente

Anterior:

0 pp.

Reciente:

+100 pp.

Resultado:

Más reciente.

### Café con patrón debilitado

Anterior:

+100 pp.

Reciente:

0 pp.

Resultado:

Se debilitó.

## Validación

Se aprobaron:

- 68 tests;
- lint;
- TypeScript;
- build;
- bundle inicial menor a 500 kB;
- QA fuera de producción;
- validación visual de los tres escenarios temporales.

## Documentación

- [[Persistencia-Temporal]]
- [[ADR-0026-Persistencia-Por-Mitades-Cronologicas]]
- [[Prueba-Persistencia-Temporal]]
