---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "4.4"
---

# Prueba — Resumen Diario v1

## Motor

Archivo:

`dailySummary.test.ts`.

## Cobertura

Comprueba:

- conteo por tipo;
- último evento de cada tipo;
- entrada sin ordenar;
- último evento general;
- día vacío;
- eventos sin timestamp válido.

## Visual

### Día con registros

Esperado:

- Última comida;
- Último Bristol;
- Última Medicina.

Cada sección muestra:

- valor;
- contador;
- hora.

## Fecha histórica

Navegar varios días hacia atrás.

Esperado:

botón:

`Hoy`.

Al tocarlo:

regresa a la fecha actual.

## Día vacío

Esperado:

`Este día todavía está vacío`.

## Móvil

En 360–390 px:

las tres secciones permanecen apiladas y legibles.

## Regresión

Debe continuar aprobando:

`npm run check:patterns-v1`.
