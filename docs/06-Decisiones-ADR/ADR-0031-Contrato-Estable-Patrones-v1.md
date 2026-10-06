---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "3.13"
---

# ADR-0031 — Contrato Estable de Patrones v1

## Contexto

Patrones creció por fases incorporando:

- asociación;
- baseline;
- ventanas;
- combinaciones;
- magnitud;
- estabilidad;
- persistencia;
- contexto concurrente;
- Medicina específica;
- timing de Medicina;
- latencia.

Seguir agregando métricas sin congelar las reglas existentes aumentaría el riesgo
de inconsistencias silenciosas.

## Decisión

Se declara un:

contrato metodológico Patrones v1.

## Contrato

Las reglas estables quedan documentadas en:

[[Patrones-v1]].

## Cambios metodológicos

Todo cambio que modifique resultados históricos debe incluir:

1. test de regresión;
2. documentación;
3. ADR;
4. explicación de compatibilidad.

## No incluido en v1

Patrones v1 no incorpora:

- pruebas de hipótesis;
- p-values;
- intervalos de confianza inferenciales;
- regresión multivariable;
- inferencia causal;
- diagnóstico automático;
- farmacocinética;
- recomendaciones terapéuticas.

## Razón

El producto debe preservar una frontera clara entre:

descripción de registros personales

e:

inferencia clínica o causal.

## Quality gate

Antes de cerrar una modificación de Patrones debe pasar:

`npm run check:patterns-v1`.

## Estado

Patrones v1 queda estable después de completar la Fase 3.13.
