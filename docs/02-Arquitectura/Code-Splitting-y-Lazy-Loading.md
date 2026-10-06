---
tipo: arquitectura
estado: activo
fecha: 2026-10-06
fase: "3.3"
---

# Code Splitting y Lazy Loading

## Problema

Antes de la Fase 3.3 el build principal había crecido aproximadamente hasta:

`1080.52 kB`

sin comprimir.

El navegador descargaba desde el inicio código correspondiente a:

- autenticación;
- Hoy;
- Calendario;
- Patrones;
- detalle de alimento;
- Recharts;
- Laboratorio QA.

Esto no era necesario.

## Estrategia

Las páginas se convierten en rutas dinámicas utilizando:

`React.lazy`

y:

`import()`

## Resultado arquitectónico

### Inicio

Carga solamente el núcleo necesario para iniciar la aplicación.

### Hoy

Se descarga cuando corresponde mostrar Hoy.

### Calendario

Se descarga al navegar a Calendario.

### Patrones

Se descarga al navegar a Patrones.

### Detalle

El detalle del alimento se descarga al abrir una asociación.

## Recharts

Las gráficas pertenecen principalmente al dominio Patrones.

Al cargar Patrones de forma dinámica:

Recharts deja de formar parte obligatoria del JavaScript inicial.

## QA

Las páginas del Laboratorio utilizan:

`import.meta.env.DEV`

junto con imports dinámicos.

El objetivo es que el código específico del Laboratorio no forme parte del
build de producción.

## Suspense

Cada ruta utiliza un fallback común:

`RouteLoading`

La navegación principal permanece disponible mientras se descarga una sección
protegida.

## Regla

Las nuevas áreas grandes de FoodAndSalud deben considerar lazy loading antes de
ser añadidas al bundle inicial.
