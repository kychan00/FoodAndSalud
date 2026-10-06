---
tipo: release
estado: completado
fecha: 2026-10-06
fase: "3.11"
---

# Release — Fase 3.11 Medicina Antes y Después

## Estado

Completada.

## Objetivo

Incorporar tomas registradas antes de una comida al contexto temporal de
Patrones.

## Ventana previa

Se observan:

6 horas antes.

La frontera exacta:

-6 h

se incluye.

## Contextos

Para cada medicamento se distinguen:

- antes solamente;
- después solamente;
- antes y después;
- sin medicamento.

## Después

Las tomas posteriores continúan respetando la ventana efectiva de comida.

## Servicio real

La consulta de Medicina comienza seis horas antes del inicio del periodo de
análisis.

Esto permite recuperar contexto previo incluso para la primera comida situada
en el borde de los 90 días.

## QA

Se validaron visualmente:

- Café con Omeprazol antes;
- Café con Medicina discriminable.

## Calidad

Se aprobaron:

- 87 tests;
- lint;
- TypeScript;
- build;
- bundle inicial menor a 500 kB;
- todos los chunks JavaScript menores a 500 kB;
- QA fuera de producción;
- validación visual.

## Documentación

- [[Medicina-Antes-y-Despues]]
- [[ADR-0029-Ventana-Previa-de-Medicina]]
- [[Prueba-Medicina-Antes-y-Despues]]
- [[BUG-0015-Parche-startIso-Dependiente-de-Formato]]
