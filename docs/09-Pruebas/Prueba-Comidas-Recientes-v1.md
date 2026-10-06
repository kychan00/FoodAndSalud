---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "4.3"
---

# Prueba — Comidas Recientes v1

## Motor

Archivo:

`recentMeals.test.ts`.

## Cobertura

Comprueba:

- comida más reciente primero;
- orden de alimentos;
- deduplicación;
- cambio de orden de captura;
- separación por tipo de comida;
- entradas históricas vacías;
- límite de plantillas.

## Visual

### Crear historial

Registrar:

Desayuno

- Café;
- Pan;
- Huevo.

### Reabrir

Abrir:

Registrar comida.

Esperado:

una tarjeta bajo:

`Comidas recientes`.

### Usar plantilla

Tocar:

`Café · Pan · Huevo`.

Esperado:

- tipo Desayuno seleccionado;
- Café como chip;
- Pan como chip;
- Huevo como chip;
- fecha/hora actual permanecen;
- notas permanecen vacías.

## Regresión

Debe continuar aprobando:

`npm run check:patterns-v1`.
