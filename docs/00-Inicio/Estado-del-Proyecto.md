---
tipo: estado
actualizado: 2026-10-06
---

# Estado del Proyecto

## Estado actual

Fase 2 — Núcleo de seguimiento en desarrollo.

## Fundamentos completados

- React
- TypeScript
- Vite
- Supabase
- PostgreSQL
- Supabase Auth
- RLS
- Obsidian
- Design System
- Mobile First

## Autenticación

Completada y probada End-to-End.

## Experiencia principal

La navegación móvil utiliza:

- Hoy
- Calendario
- Patrones

## Hoy

Incluye:

- fecha actual;
- selector horizontal de siete días;
- resumen digestivo;
- Registrar comida;
- Registrar Bristol;
- Medicina;
- timeline diario.

## Calendario

Implementación inicial:

- vista mensual;
- cambio de mes;
- indicadores de comida;
- indicadores de Bristol;
- timeline por día.

## Patrones

Implementación inicial basada en últimos 30 días:

- comidas;
- evacuaciones;
- Bristol promedio;
- Bristol 6–7.

## Medicina

Visible en interfaz.

Persistencia pendiente.

## Base de datos actual

- profiles
- foods
- food_entries
- food_entry_items
- bathroom_entries
- timeline_events

## Próximos pasos

1. probar registro real de alimentos;
2. probar registro real Bristol;
3. validar Calendar;
4. validar Patrones;
5. diseñar modelo de Medicina;
6. comenzar asociaciones alimento → respuesta digestiva.

## Fase 2.2 — Medicina

El tercer dominio de eventos ya está implementado localmente.

Arquitectura:

medicines
↓
medicine_entries
↓
timeline_events
├── Hoy
├── Calendario
└── Patrones

Validación de base realizada:

- db reset correcto;
- migración inicial aplicada;
- migración Medicina aplicada;
- 18 pruebas pgTAP aprobadas;
- db lint sin errores;
- tipos TypeScript generados.

Pendiente:

- dry-run remoto;
- deploy de migración;
- prueba End-to-End real de Medicina.

## Deploy Fase 2.2

La migración de Medicina fue aplicada al Supabase remoto.

Producción contiene ahora:

- profiles
- foods
- food_entries
- food_entry_items
- bathroom_entries
- medicines
- medicine_entries
- timeline_events

Pendiente antes de cerrar Fase 2.2:

- E2E Comida;
- E2E Bristol;
- E2E Medicina;
- Calendario;
- Patrones;
- persistencia;
- prueba de fecha histórica.

## Fase 3.0 — Motor de asociaciones

FoodAndSalud ya cuenta con un primer motor analítico personal.

Flujo:

alimento
↓
exposición
↓
ventana de 24 horas
↓
Bristol / urgencia / dolor
↓
comparación contra referencia personal
↓
señal + evidencia

También se registra coincidencia temporal con Medicina.

Los resultados se presentan como asociaciones y no como relaciones causales.

La primera implementación funciona en el cliente sobre los datos privados del
usuario obtenidos mediante Supabase y protegidos por RLS.

## Laboratorio QA de Patrones

FoodAndSalud cuenta ahora con una capa sintética de pruebas.

Ruta de desarrollo:

`/#/qa/patterns`

Características:

- datos totalmente ficticios;
- no utiliza Supabase;
- no modifica información real;
- reutiliza el motor real;
- reutiliza los componentes visuales reales;
- permite cambiar entre escenarios;
- permite inspeccionar el dataset utilizado.

Escenarios iniciales:

- Café señal alta;
- Pocos datos;
- Leche señal media;
- Arroz neutral;
- Café + Medicina;
- Café + Leche juntos.

Objetivo:

forzar comportamientos extremos para descubrir bugs antes de depender de meses
de historial real.

## Gráficas de Patrones

El Laboratorio QA permite ahora inspeccionar visualmente el comportamiento del
motor.

Visualizaciones:

1. Bristol por fecha y alimento.
2. Coincidencia observada y ajustada por alimento frente a referencia personal.

Las gráficas son Mobile First y utilizan scroll horizontal cuando el número de
observaciones supera el espacio disponible.

También se corrigió la interpretación visual de las horas sintéticas mediante
formatters UTC específicos de QA.

Los datos reales conservan su comportamiento normal de zona horaria.

## Fase 3.1 — Detalle explicable por alimento

La asociación general puede abrir ahora una vista individual.

Ruta:

`/patterns/food/:foodId`

La pantalla explica:

- cantidad de exposiciones;
- cantidad evaluable;
- señal;
- coincidencia;
- ventanas 6 / 12 / 24 horas;
- Bristol posterior;
- urgencia;
- dolor;
- tiempo hasta evacuación;
- Medicina concurrente;
- otros alimentos de la misma comida;
- historial de cada exposición.

Las exposiciones sin evacuación posterior permanecen como:

No evaluables.

No se interpretan automáticamente como ausencia de respuesta.

## QA sintético del detalle de alimento

El Laboratorio de Patrones puede abrir ahora la vista completa de cada alimento
ficticio.

Arquitectura:

Fixtures QA
↓
qaFoodDetail
↓
FoodDetailReport
↓
FoodDetailContent

Producción utiliza:

Supabase
↓
foodDetail.service
↓
FoodDetailReport
↓
FoodDetailContent

La interfaz visual es compartida.

Esto permite probar la pantalla real sin contaminar los datos del usuario.
