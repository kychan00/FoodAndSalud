---
tipo: pruebas
estado: activo
fecha: 2026-10-06
---

# Datos Sintéticos — Patrones

## Regla

Los datasets sintéticos de QA nunca deben insertarse en las tablas reales del
usuario.

## Ubicación

`src/features/patterns/fixtures/association.fixtures.ts`

## Objetivo

Crear estados que serían lentos o incómodos de producir manualmente.

Ejemplos:

- ocho cafés seguidos por Bristol 7;
- múltiples eventos neutrales;
- Medicina concurrente;
- alimentos perfectamente correlacionados entre sí;
- muestras deliberadamente pequeñas.

## Ventaja

Las pruebas son deterministas.

Un mismo escenario produce siempre el mismo resultado.

## Uso

### Automatizado

Vitest ejecuta:

`association.fixtures.test.ts`

### Visual

El desarrollador puede abrir:

`/#/qa/patterns`

## Regla de producción

Ningún fixture deberá importarse desde los flujos de registro reales.

Los fixtures pertenecen únicamente al entorno QA.
