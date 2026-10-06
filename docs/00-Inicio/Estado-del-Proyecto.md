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

## Fase 3.2 — Comparación de combinaciones

El detalle del alimento ya puede comparar contextos.

Ejemplo:

Café + Leche
vs
Café sin Leche

El motor distingue:

- combinación con mayor coincidencia;
- combinación con menor coincidencia;
- tasas similares;
- pocos datos;
- alimentos inseparables.

Cuando dos alimentos aparecen siempre juntos, FoodAndSalud declara que no puede
separarlos con la información disponible.

No se asigna causalidad automática.

## Fase 3.3 — Code Splitting

La aplicación adopta lazy loading por rutas.

Objetivo principal:

reducir el JavaScript necesario durante el arranque.

Fronteras dinámicas:

- autenticación;
- Hoy;
- Calendario;
- Patrones;
- detalle de alimento.

El Laboratorio QA usa imports dinámicos condicionados al entorno de desarrollo.

Recharts queda asociado a las rutas que realmente utilizan gráficas en lugar de
ser una dependencia obligatoria del arranque inicial.

## Fase 3.4 — Combinaciones multiventana

El análisis:

alimento + acompañante
vs
alimento sin acompañante

ya no se limita a 24 horas.

Ahora compara:

- 6 h;
- 12 h;
- 24 h.

Esto permite observar cuándo empieza a aparecer una diferencia temporal.

Ejemplo QA:

Café + Leche:

6 h → 0%
12 h → 100%
24 h → 100%

Café sin Leche:

6 h → 0%
12 h → 0%
24 h → 0%

La señal continúa siendo observacional y no causal.

## Fase 3.5 — Baseline comparable

El motor de Patrones utiliza ahora unidades comparables.

Antes:

exposición alimentaria
vs
evento individual de baño.

Ahora:

comida con alimento
vs
comida sin alimento.

La tasa por evacuaciones individuales permanece visible únicamente como dato
descriptivo.

Si no existen comidas sin un alimento determinado, se utiliza la referencia
global por ventanas de comida.

También se evita contar dos veces el mismo alimento dentro de una misma comida.

## Fase 3.6 — Control de ventanas superpuestas

Las ventanas de resultado dejan de solaparse libremente entre comidas.

Regla:

comida A
→ ventana A
→ nueva comida B
→ termina ventana A
→ comienza ventana B.

Esto reduce la doble atribución de una misma evacuación a varias comidas
sucesivas.

La interfaz muestra cuántas ventanas fueron interrumpidas y la duración efectiva
de cada exposición afectada.

La estrategia es deliberadamente conservadora y puede reducir sensibilidad a
latencias largas.

## Fase 3.7 — Magnitud y estabilidad

Las señales alimentarias incorporan ahora medidas descriptivas adicionales:

- diferencia absoluta;
- RR descriptivo;
- muestra observada;
- muestra comparadora;
- estabilidad leave-one-out.

La razón relativa no se calcula cuando la tasa comparadora es cero ni cuando no
existe un grupo independiente de comidas sin el alimento.

La estabilidad describe cuánto cambia la categoría al retirar una observación
evaluable.

También se corrigió la explicación del historial:

una primera evacuación normal ya no oculta una respuesta marcada posterior
dentro de la misma ventana.

La automatización de esta fase produjo BUG-0013 por depender del formato textual
de un import; FoodDetailContent pasó a reemplazo estructural completo.
