---
tipo: funcionalidad
estado: desplegado
fecha: 2026-10-06
---

# Medicina

## Objetivo

Registrar medicamentos, suplementos y remedios utilizados por el usuario.

## Datos

Cada evento puede contener:

- nombre;
- fecha y hora;
- dosis;
- unidad;
- motivo;
- notas.

## Ejemplos

Omeprazol
20 mg

Probiótico
1 cápsula

Paracetamol
500 mg

## Catálogo

El nombre no se duplica como una entidad nueva en cada registro.

FoodAndSalud reutiliza:

`medicine_id`

## Timeline

Los registros aparecen junto a:

- comidas;
- Bristol.

## Calendario

Los días con Medicina tendrán un marcador propio.

## Patrones

Medicina será una variable importante al estudiar posibles asociaciones.

FoodAndSalud no deberá asumir que un cambio digestivo fue causado por un
alimento si también existió un medicamento cercano temporalmente.

## Producción

El modelo de Medicina está desplegado en Supabase remoto mediante:

`20261006190000_add_medicine_tracking.sql`

La validación funcional End-to-End se realiza después del deploy.
