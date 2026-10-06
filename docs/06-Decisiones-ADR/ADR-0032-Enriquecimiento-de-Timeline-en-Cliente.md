---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "4.0"
---

# ADR-0032 — Enriquecimiento de Timeline en Cliente

## Contexto

`timeline_events` unifica:

- comida;
- Bristol;
- Medicina.

Sin embargo, un evento de comida no contiene los nombres de sus alimentos.

## Opciones

### Modificar la vista SQL

Agregar agregación de:

`food_entry_items`

y:

`foods`.

### Enriquecer en el servicio

Mantener la vista estable y resolver nombres únicamente para los eventos de
comida recuperados.

## Decisión

Fase 4.0 utiliza:

enriquecimiento en el servicio del cliente.

## Razones

1. no modifica el esquema durante el inicio de Experiencia diaria;
2. mantiene Patrones v1 intacto;
3. permite validar primero la utilidad del timeline enriquecido;
4. mantiene el orden `sort_order` de los alimentos;
5. el volumen actual de un día o mes es pequeño.

## Flujo

1. consultar `timeline_events`;
2. identificar ids de `food_entries`;
3. consultar `food_entry_items`;
4. consultar los alimentos necesarios;
5. construir `food_names`;
6. renderizar.

## Limitación

Implica hasta dos consultas adicionales cuando existen comidas.

## Evolución

Si la escala lo justifica:

se puede mover esta agregación a una vista o RPC.

Ese cambio deberá conservar el contrato visual existente.
