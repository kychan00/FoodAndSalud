---
tipo: release
estado: completado
fecha: 2026-10-06
fase: "3.12"
---

# Release — Fase 3.12 Latencia de Respuesta

## Estado

Completada.

## Objetivo

Describir cuándo aparece la primera respuesta marcada después de una comida.

## Semántica

La latencia utiliza:

`firstAdverseBathroom`.

No utiliza simplemente:

`firstBathroom`.

Esto permite representar correctamente casos como:

- primera evacuación normal a 4 h;
- primera respuesta marcada a 10 h.

La latencia marcada es:

10 h.

## Intervalos

- 0–6 h;
- > 6–12 h;
- > 12–24 h.

## Resumen

Se muestran:

- número de exposiciones marcadas;
- proporción marcada;
- mediana;
- mínimo;
- máximo;
- distribución temporal;
- perfil dominante.

## QA

Se validaron visualmente:

### Temprana

4 h.

### Intermedia

10 h.

### Tardía

16 h.

## Calidad

Se aprobaron:

- 97 tests;
- lint;
- TypeScript;
- build;
- bundle inicial menor a 500 kB;
- todos los chunks JavaScript menores a 500 kB;
- QA fuera de producción;
- validación visual.

## Documentación

- [[Latencia-de-Respuesta]]
- [[ADR-0030-Latencia-de-Primera-Respuesta-Marcada]]
- [[Prueba-Latencia-de-Respuesta]]
