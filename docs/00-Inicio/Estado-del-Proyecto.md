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

## Fase 3.8 — Persistencia temporal

El detalle de alimento distingue ahora entre:

- patrón persistente;
- patrón más reciente;
- patrón debilitado;
- comportamiento estable;
- comportamiento variable;
- datos insuficientes.

El historial de comidas se divide en dos mitades cronológicas según el número de
comidas disponibles.

Cada mitad vuelve a calcular:

alimento
vs
comidas sin alimento.

La interfaz muestra también:

- fechas de cada mitad;
- tasas;
- muestra;
- diferencia en puntos porcentuales.

La clasificación es descriptiva y no causal.

## Fase 3.9 — Factores concurrentes

El detalle del alimento analiza ahora contextos concurrentes.

### Medicina

Las exposiciones se dividen en:

con Medicina
vs
sin Medicina.

Se muestran:

- muestra;
- tasa;
- diferencia;
- inseparabilidad.

### Otros alimentos

Se sintetiza el motor de combinaciones para mostrar:

- frecuencia de acompañamiento;
- alimentos inseparables;
- diferencias observadas;
- exposiciones del alimento solo.

La interfaz utiliza deliberadamente:

`factor concurrente`

en lugar de:

`confusor causal`.

El análisis continúa siendo descriptivo.

## Fase 3.10 — Medicamentos específicos

El detalle de alimento ya no trata todos los registros de Medicina como una sola
categoría.

Cada evento real puede conservar:

- medicine_id;
- nombre;
- dosis;
- unidad;
- hora relativa.

Para cada medicamento se compara:

alimento + medicamento

vs

el mismo alimento sin ese medicamento.

La interfaz muestra:

- porcentaje de coexistencia;
- muestras;
- tasas;
- diferencia;
- número de tomas;
- mediana temporal;
- dosis observadas.

No se realizó ninguna migración de base de datos porque la información necesaria
ya estaba disponible en `medicines` y `medicine_entries`.

El análisis sigue siendo descriptivo y no causal.

## Fase 3.11 — Medicina antes vs después

Patrones distingue ahora temporalmente un medicamento en relación con cada
comida.

Los contextos disponibles son:

- antes solamente;
- después solamente;
- antes y después;
- sin medicamento.

La ventana previa es de seis horas.

La Medicina posterior continúa utilizando la ventana efectiva de comida.

El servicio real recupera seis horas adicionales antes del inicio de los 90 días
para conservar el contexto de la primera comida.

La fase continúa siendo descriptiva y no modela farmacocinética.

## Fase 3.12 — Latencia de respuesta

Patrones puede describir ahora cuándo aparece la primera respuesta marcada.

La métrica utiliza:

`firstAdverseBathroom`

y no simplemente:

`firstBathroom`.

Los intervalos son:

- 0–6 h;
- > 6–12 h;
- > 12–24 h.

Se muestran:

- mediana;
- rango;
- distribución;
- proporción marcada;
- perfil temporal dominante.

Se requieren al menos tres respuestas marcadas para clasificar el perfil.

La latencia es descriptiva y no causal.

## Fase 3.13 — Hardening de Patrones v1

Patrones entra en fase de estabilización.

No se añaden nuevas métricas en esta fase.

Se congela el contrato metodológico que cubre:

- asociación;
- baseline;
- ventanas de comida;
- combinaciones;
- magnitud;
- estabilidad;
- persistencia;
- factores concurrentes;
- Medicina específica;
- timing de Medicina;
- latencia.

Se añade un quality gate único:

`npm run check:patterns-v1`.

Los cambios metodológicos posteriores deberán modificar explícitamente el
contrato y sus pruebas.

## Patrones v1 — Liberado

Patrones v1 quedó cerrado después de la Fase 3.13.

El módulo cuenta con un contrato metodológico estable y un quality gate único:

`npm run check:patterns-v1`.

El cierre incluye:

- asociación por alimento;
- baseline comparable;
- ventanas 6/12/24 h;
- censura por nueva comida;
- combinaciones;
- magnitud;
- estabilidad leave-one-out;
- persistencia temporal;
- factores concurrentes;
- Medicina específica;
- Medicina antes/después;
- latencia de primera respuesta marcada.

Quality gate de cierre:

- 29 archivos de test;
- 131 tests;
- lint aprobado;
- TypeScript aprobado;
- build aprobado;
- budget de bundles aprobado;
- aislamiento QA aprobado;
- smoke visual aprobado.

Patrones entra ahora en mantenimiento.

El desarrollo principal continúa en la experiencia de registro diario y uso
cotidiano de FoodAndSalud.

## Fase 4.0 — Centro diario v1

Comenzó la etapa de Experiencia diaria después del release de Patrones v1.

### Timeline

Las comidas pueden mostrar ahora los alimentos que contienen.

### Hoy

Los accesos de captura utilizan:

día seleccionado + hora local actual.

### Calendario

El día seleccionado permite crear:

- comida;
- Bristol;
- Medicina.

Después de guardar:

las consultas de timeline se invalidan y el día/mes se actualizan.

### Arquitectura

No se modifica la vista SQL `timeline_events`.

El enriquecimiento de nombres de alimentos se realiza en el servicio de timeline.

### Patrones

Patrones v1 permanece estable y su quality gate continúa siendo obligatorio.

## Fase 4.1 — Captura rápida v1

Experiencia diaria incorpora atajos basados en el historial personal.

### Alimentos

El formulario muestra alimentos usados recientemente y favoritos.

La recencia utiliza:

`food_entries.eaten_at`.

### Medicina

El formulario muestra medicamentos usados recientemente.

Un atajo puede recuperar:

- nombre;
- última dosis;
- última unidad.

Esto representa repetición de un registro previo y no una recomendación
terapéutica.

### Caché

Las consultas usan:

`daily-suggestions`.

Se invalidan después de guardar.

### Base de datos

No se requieren migraciones.

### Patrones

Patrones v1 permanece congelado.
