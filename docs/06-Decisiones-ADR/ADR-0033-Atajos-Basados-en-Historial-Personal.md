---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "4.1"
---

# ADR-0033 — Atajos Basados en Historial Personal

## Contexto

La captura manual repetida genera fricción.

Ejemplos:

- escribir Café todos los días;
- volver a escribir Omeprazol;
- volver a escribir 20 mg.

## Decisión

Agregar atajos derivados únicamente del historial y catálogo del usuario.

## Alimentos

La recencia se determina mediante:

`food_entries.eaten_at`.

Los alimentos de cada comida se recuperan mediante:

`food_entry_items`.

## Medicina

La recencia se determina mediante:

`medicine_entries.taken_at`.

La toma más reciente de cada medicamento puede aportar:

- dosis;
- unidad.

## Ranking

Prioridad:

1. reciente;
2. favorito;
3. catálogo.

Los IDs se deduplican.

## Lenguaje

La interfaz utiliza:

`Atajos`

y:

`Usados recientemente`.

No utiliza:

- recomendado;
- debería tomar;
- mejor opción;
- sugerencia terapéutica.

## Seguridad semántica

Una dosis rellenada desde el historial significa:

último valor registrado.

No significa:

dosis correcta

ni:

dosis indicada.

## Sin migración

Las tablas existentes ya contienen la información necesaria.
