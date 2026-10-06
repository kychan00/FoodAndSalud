---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "4.1"
---

# Prueba — Captura Rápida v1

## Ranking

Archivo:

`dailySuggestions.test.ts`.

Comprueba:

- recientes primero;
- favoritos después;
- deduplicación;
- límite de resultados;
- normalización de texto.

## Alimentos

Validación visual:

1. abrir Registrar comida;
2. observar Atajos;
3. tocar un alimento;
4. comprobar que aparece como chip;
5. comprobar que desaparece del listado de atajos;
6. escribir parte de un nombre;
7. comprobar filtrado.

## Medicina

Validación visual:

1. registrar una Medicina con dosis;
2. guardar;
3. volver a abrir Medicina;
4. tocar el atajo;
5. comprobar nombre;
6. comprobar última dosis;
7. comprobar unidad.

## Regresión

Deben continuar aprobando:

- tests;
- lint;
- TypeScript;
- build;
- `npm run check:patterns-v1`.
