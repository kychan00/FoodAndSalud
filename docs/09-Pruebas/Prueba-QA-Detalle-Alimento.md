---
tipo: prueba
estado: activo
fecha: 2026-10-06
fase: "3.1"
---

# Prueba QA — Detalle de Alimento

## Objetivo

Permitir probar la pantalla real de detalle de alimento utilizando únicamente
datos ficticios.

## Flujo

Laboratorio QA
→ escenario
→ alimento
→ Ver detalle

## Ruta

`/#/qa/patterns/:scenarioId/food/:foodId`

## Persistencia

Esta pantalla:

- no consulta Supabase;
- no escribe Supabase;
- no modifica datos reales.

## Arquitectura

Los fixtures se convierten mediante:

`buildQaFoodDetailReport`

El resultado utiliza el mismo:

`FoodDetailContent`

que la pantalla real.

Esto permite comprobar la misma interfaz con dos fuentes de datos:

### Producción

Supabase
→ foodDetail.service
→ FoodDetailReport
→ FoodDetailContent

### QA

Fixtures
→ qaFoodDetail
→ FoodDetailReport
→ FoodDetailContent

## Escenarios importantes

### Café con señal alta

Abrir:

Café

Esperado:

- 8 exposiciones;
- señal alta;
- historial repetido;
- Bristol 6–7.

### Arroz del escenario Café con señal alta

Esperado:

- 8 exposiciones;
- sin señal clara;
- Bristol 4.

### Café + Medicina

Esperado:

- Medicina concurrente;
- 6 exposiciones afectadas por ese contexto.

### Café + Leche juntos

Abrir Café.

Esperado:

Leche:

- 4 co-ocurrencias;
- 100%.

Abrir Leche.

Esperado:

Café:

- 4 co-ocurrencias;
- 100%.

Esto evidencia la ambigüedad del conjunto observacional.

## Horarios

Los datos QA utilizan UTC para mantener horarios deterministas.

Los datos reales continúan utilizando la zona horaria normal del usuario.
