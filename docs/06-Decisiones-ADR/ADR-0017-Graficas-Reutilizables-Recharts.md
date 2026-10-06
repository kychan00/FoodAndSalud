---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0017 — Gráficas reutilizables con Recharts

## Contexto

FoodAndSalud ya utiliza Recharts como dependencia del proyecto.

El análisis de Patrones necesita visualizar:

- evolución temporal;
- Bristol por fecha;
- asociaciones por alimento;
- referencia personal.

## Decisión

Crear componentes reutilizables sobre Recharts.

## Componentes iniciales

### PatternTimelineChart

Muestra:

fecha + alimento
→ Bristol

Incluye:

- eje de fechas;
- etiquetas de alimentos;
- Bristol 1–7;
- tooltip;
- urgencia;
- dolor;
- Medicina concurrente.

### AssociationRateChart

Compara por alimento:

- coincidencia observada;
- coincidencia ajustada;
- referencia personal.

## Mobile First

Las gráficas extensas permiten desplazamiento horizontal.

Esto es preferible a eliminar etiquetas o amontonar datos.

## Futuro

Los mismos componentes o sus derivados podrán utilizarse en la pestaña real de
Patrones y en el detalle de cada alimento.
