---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "3.3"
---

# ADR-0021 — Lazy loading por rutas

## Contexto

La aplicación superó 1 MB de JavaScript minificado en un único chunk inicial.

El crecimiento se produjo principalmente conforme se añadieron:

- gráficas;
- Recharts;
- Laboratorio QA;
- detalle de alimentos;
- análisis de combinaciones.

## Decisión

Las páginas principales utilizan importación dinámica.

## Unidad de separación

La primera frontera de code splitting será:

ruta.

## Razón

Las rutas representan fronteras funcionales naturales.

Un usuario que abre Hoy no necesita descargar inmediatamente:

- Calendario;
- Patrones;
- detalle;
- gráficas.

## QA

Las pantallas exclusivas de QA sólo se importan cuando:

`import.meta.env.DEV === true`

## Fallback

Se utiliza un componente reutilizable:

`RouteLoading`

## No decisión

Por ahora no se añaden configuraciones manuales complejas de vendor chunks.

Primero se permite al bundler construir chunks a partir de las fronteras
naturales creadas con dynamic import.

## Revisión futura

Si un chunk individual vuelve a superar límites razonables, se evaluará separar
dependencias grandes o módulos analíticos específicos.
