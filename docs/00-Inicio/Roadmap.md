---
tipo: roadmap
estado: activo
---

# Roadmap — FoodAndSalud

## Fase 0 — Fundamentos

- [x] Crear repositorio GitHub
- [x] Crear proyecto Supabase
- [x] Crear React + TypeScript + Vite
- [x] Configurar ESLint
- [x] Instalar dependencias base
- [x] Crear arquitectura de carpetas
- [x] Crear Vault de Obsidian
- [x] Documentar arquitectura inicial
- [x] Crear ADR iniciales
- [x] Crear base del Design System
- [x] Definir modelo de datos
- [x] Crear migración inicial
- [x] Configurar RLS
- [ ] Configurar pruebas
- [ ] Configurar CI

## Fase 1 — Design System

- [x] Tokens iniciales
- [ ] Tipografía
- [ ] Espaciado definitivo
- [ ] Radios definitivos
- [ ] Sombras
- [ ] Botones
- [ ] Cards
- [ ] Inputs
- [ ] Chips
- [ ] Bottom sheets
- [ ] Navegación móvil
- [ ] Estados vacíos
- [ ] Skeletons
- [ ] Feedback visual

## Fase 2 — Supabase

- [x] Supabase CLI
- [x] Vincular proyecto remoto
- [x] Migraciones
- [ ] Profiles
- [ ] Foods
- [ ] Food entries
- [ ] Food entry items
- [ ] Bathroom entries
- [x] Row Level Security
- [x] Índices
- [x] Constraints
- [x] Tests estructurales de base de datos

## Fase 3 — Autenticación

- [x] Cliente Supabase
- [x] Registro con email y contraseña
- [x] Pantalla de verificación
- [x] Login
- [x] Persistencia de sesión
- [x] Protected routes
- [x] Logout
- [x] Solicitud de recuperación de contraseña
- [x] Cambio de contraseña
- [x] Probar correo real de confirmación
- [x] Verificar creación automática de profile

## Fase 4 — Alimentos

- [x] Crear alimento
- [x] Registrar comida
- [ ] Cantidades
- [ ] Unidades
- [ ] Categorías
- [ ] Historial
- [ ] Alimentos frecuentes
- [ ] Edición
- [ ] Eliminación

## Fase 5 — Baño

- [x] Registro
- [x] Escala Bristol
- [x] Urgencia
- [x] Dolor
- [x] Notas
- [ ] Historial
- [ ] Edición
- [ ] Eliminación

## Fase 6 — Timeline

- [x] Timeline diario
- [x] Unificar eventos
- [ ] Navegación por fecha
- [ ] Filtros
- [ ] Vista semanal

## Fase 7 — Estadística

- [ ] Baseline personal
- [ ] Ventanas temporales
- [ ] Frecuencias
- [ ] Comparaciones
- [ ] Tendencias
- [ ] Tamaño de muestra
- [ ] Métricas explicables

## Fase 8 — Insights

- [ ] Asociación alimento-evento
- [ ] Score interpretable
- [ ] Nivel de confianza
- [ ] Explicación del cálculo
- [ ] Advertencias de causalidad
- [ ] Ranking de asociaciones
- [ ] Detalle por alimento

## Fase 9 — Producto

- [ ] PWA
- [ ] Instalación móvil
- [ ] Offline parcial
- [ ] Accesibilidad
- [ ] Refinamiento UX
- [ ] Rendimiento

## Fase 2.1 — Experiencia Mobile

- [x] Navegación inferior
- [x] Tab Hoy
- [x] Calendario horizontal
- [x] Acción Registrar comida
- [x] Acción Registrar Bristol
- [x] Acción Medicina visible
- [x] Calendario mensual
- [x] Marcadores de eventos por día
- [x] Tab Patrones
- [x] Resumen inicial de 30 días
- [x] Persistencia de Medicina
- [ ] Análisis alimento → síntomas

## Fase 2.2 — Medicina

- [x] Diseñar modelo medicines
- [x] Diseñar medicine_entries
- [x] RLS
- [x] Integración con timeline
- [x] Integración visual con Calendario
- [x] Integración inicial con Patrones
- [x] Formulario mobile-first
- [x] Aplicar migración remota
- [ ] Probar registro real End-to-End

## Fase 3.0 — Motor de Patrones

- [x] Ventana temporal alimento → respuesta
- [x] Definir respuesta digestiva marcada
- [x] Referencia personal
- [x] Suavizado por evidencia
- [x] Señal alta / media / baja
- [x] Nivel de evidencia
- [x] Detección de coincidencia con Medicina
- [x] Ranking de alimentos
- [x] UI Mobile First en Patrones
- [x] Tests unitarios del motor
- [x] Documentación epistemológica
- [ ] Validación con registros reales
- [ ] Detalle individual por alimento
- [ ] Comparación por ventanas 6 h / 12 h / 24 h

## Fase 3.0 QA — Laboratorio de Patrones

- [x] Crear MOC-Pruebas
- [x] Dataset sintético no persistente
- [x] Escenario señal alta
- [x] Escenario señal media
- [x] Escenario datos insuficientes
- [x] Escenario alimento neutral
- [x] Escenario Medicina concurrente
- [x] Escenario de alimentos ambiguos
- [x] Tests automatizados de fixtures
- [x] Laboratorio visual
- [x] Dataset inspeccionable
- [x] Ruta QA solo en desarrollo
- [ ] Revisar visualmente todos los escenarios
- [ ] Documentar bugs encontrados

## Fase 3.0 QA Visual

- [x] Gráfica Bristol por fecha
- [x] Etiquetas alimento + fecha
- [x] Tooltip Bristol / urgencia / dolor
- [x] Mostrar Medicina concurrente
- [x] Zona visual Bristol 3–5
- [x] Gráfica de asociación por alimento
- [x] Coincidencia observada
- [x] Coincidencia ajustada
- [x] Línea de referencia personal
- [x] Scroll horizontal Mobile First
- [x] BUG-0005 horario de fixtures
- [x] Tests de fechas QA
- [x] Documentación de gráficas
- [x] Validación visual de los seis escenarios
- [ ] Llevar gráficas aprobadas a Patrones reales

## Fase 3.1 — Detalle de alimento

- [x] Ruta individual por alimento
- [x] Botón Ver detalle desde Patrones
- [x] Exposiciones totales
- [x] Exposiciones evaluables
- [x] Señal actual
- [x] Ventana 6 h
- [x] Ventana 12 h
- [x] Ventana 24 h
- [x] Gráfica de ventanas
- [x] Gráfica Bristol por fecha
- [x] Tiempo alimento → evacuación
- [x] Bristol posterior
- [x] Urgencia posterior
- [x] Dolor posterior
- [x] Medicina concurrente
- [x] Alimentos consumidos juntos
- [x] Historial individual
- [x] Tests unitarios
- [x] ADR de explicabilidad
- [x] MOC Patrones
- [x] BUG-0006 documentado
- [ ] Validación visual con datos reales
- [ ] QA sintético del detalle
- [ ] Comparación alimento solo vs combinación

## Fase 3.1 QA — Detalle sintético

- [x] Abrir detalle desde Laboratorio QA
- [x] Reutilizar FoodDetailContent
- [x] Adaptar fixtures a FoodDetailReport
- [x] Probar Café señal alta
- [x] Probar alimento neutral
- [x] Probar co-ocurrencia
- [x] Probar Medicina
- [x] Mantener horarios QA en UTC
- [x] Tests del adaptador
- [x] Documentación MOC Pruebas
- [ ] Validación visual de todos los escenarios

## Fase 3.2 — Alimento vs combinaciones

- [x] Detectar alimentos concurrentes
- [x] Comparar con alimento presente
- [x] Comparar sin alimento concurrente
- [x] Calcular diferencia porcentual
- [x] Detectar combinaciones inseparables
- [x] Detectar pocos datos
- [x] Detectar coincidencia mayor
- [x] Detectar coincidencia menor
- [x] Detectar tasas similares
- [x] Calcular exposiciones sin acompañantes
- [x] Integrar en detalle real
- [x] Integrar en detalle QA
- [x] Nuevo escenario Café solo vs Café + Leche
- [x] Tests unitarios
- [x] Tests QA
- [x] Documentación Obsidian
- [ ] Validación visual
- [ ] Comparaciones con ventanas 6 / 12 / 24 h

- [x] BUG-0007 type widening en fixture QA

## Fase 3.3 — Rendimiento y Code Splitting

- [x] Lazy loading Auth
- [x] Lazy loading Hoy
- [x] Lazy loading Calendario
- [x] Lazy loading Patrones
- [x] Lazy loading detalle de alimento
- [x] Separar Recharts del arranque inicial
- [x] QA mediante import dinámico DEV
- [x] Fallback reutilizable
- [x] Verificar tamaño del bundle inicial
- [x] Verificar QA ausente de producción
- [x] Validación visual de navegación

## Fase 3.4 — Combinaciones 6 / 12 / 24 h

- [x] Estadísticas de combinación a 6 h
- [x] Estadísticas de combinación a 12 h
- [x] Estadísticas de combinación a 24 h
- [x] Estado independiente por ventana
- [x] Diferencia porcentual por ventana
- [x] Gráfica agrupada
- [x] Resumen visual 6 / 12 / 24
- [x] Caso temprano QA
- [x] Caso tardío QA
- [x] Detectar diferencia que aparece después de 6 h
- [x] Mantener no evaluables correctamente
- [x] Tests unitarios
- [x] Tests QA
- [x] Documentación Obsidian
- [ ] Validación visual

- [x] BUG-0008 registro del escenario QA tardío

## Fase 3.5 — Baseline comparable

- [x] Detectar problema de denominadores
- [x] Crear ventanas únicas por comida
- [x] Baseline global por ventanas de comida
- [x] Comparador específico por alimento
- [x] Usar comidas sin el alimento
- [x] Fallback cuando no existe control
- [x] Mantener tasa de baño como dato descriptivo
- [x] Deduplicar alimento dentro de una misma comida
- [x] Aplicar comparador al detalle real
- [x] Aplicar comparador al detalle QA
- [x] Actualizar gráfica de comparación
- [x] Actualizar fixtures
- [x] Tests metodológicos
- [x] BUG-0009
- [x] ADR-0023
- [x] Documentación Obsidian
- [x] Validación visual

## Fase 3.6 — Ventanas superpuestas

- [x] Detectar siguiente comida
- [x] Motor temporal compartido
- [x] Cerrar ventana ante nueva comida
- [x] Mantener máximo 24 h
- [x] Aplicar a 6 / 12 / 24 h
- [x] Aplicar a asociaciones
- [x] Aplicar a baseline
- [x] Aplicar a detalle
- [x] Aplicar a combinaciones
- [x] Aplicar a Medicina
- [x] Contar ventanas interrumpidas
- [x] Mostrar ventana efectiva
- [x] Escenario QA de superposición
- [x] Tests unitarios
- [x] Tests QA
- [x] BUG-0010
- [x] BUG-0011
- [x] ADR-0024
- [x] Documentación Obsidian
- [x] Validación visual

## Fase 3.7 — Magnitud y estabilidad

- [x] Diferencia absoluta en puntos porcentuales
- [x] RR descriptivo
- [x] No mostrar infinito cuando control = 0
- [x] Tamaño de muestra observado
- [x] Tamaño de muestra comparador
- [x] Estabilidad leave-one-out
- [x] Estabilidad alta
- [x] Estabilidad media
- [x] Estabilidad baja
- [x] No estimable sin control separado
- [x] Componente visual de magnitud
- [x] Consistencia primera evacuación / respuesta marcada
- [x] Mostrar respuesta marcada posterior
- [x] Tests de efecto
- [x] Test de explicabilidad
- [x] BUG-0012
- [x] BUG-0013
- [x] ADR-0025
- [x] Documentación Obsidian
- [x] Validación visual

## Fase 3.8 — Persistencia temporal

- [x] Dividir historial cronológicamente
- [x] Mitad anterior
- [x] Mitad reciente
- [x] Tasa del alimento por periodo
- [x] Tasa comparadora por periodo
- [x] Diferencia absoluta por periodo
- [x] Detectar patrón persistente
- [x] Detectar patrón reciente
- [x] Detectar patrón debilitado
- [x] Detectar patrón estable
- [x] Detectar patrón variable
- [x] Detectar datos insuficientes
- [x] Gráfica temporal
- [x] Mostrar fechas reales
- [x] Mostrar muestras
- [x] Escenario QA persistente
- [x] Escenario QA reciente
- [x] Escenario QA debilitado
- [x] Tests unitarios
- [x] Tests QA
- [x] ADR-0026
- [x] Documentación Obsidian
- [x] Validación visual

## Fase 3.9 — Factores concurrentes

- [x] Definir factor concurrente
- [x] Evitar lenguaje causal de confusión
- [x] Dividir alimento con / sin Medicina
- [x] Calcular tasa con Medicina
- [x] Calcular tasa sin Medicina
- [x] Calcular diferencia en pp
- [x] Detectar Medicina inseparable
- [x] Detectar pocos datos
- [x] Detectar diferencia mayor con Medicina
- [x] Detectar diferencia menor con Medicina
- [x] Detectar diferencia pequeña
- [x] Detectar ausencia de Medicina
- [x] Resumir alimentos acompañantes
- [x] Detectar alimento inseparable
- [x] Mostrar exposiciones del alimento solo
- [x] Escenario QA Medicina discriminable
- [x] Tests del motor
- [x] Test QA
- [x] ADR-0027
- [x] Documentación Obsidian
- [x] Validación visual

## Fase 3.10 — Medicamentos específicos

- [x] Conservar medicine_id
- [x] Recuperar nombre desde catálogo
- [x] Conservar dosis
- [x] Conservar unidad
- [x] Asociar tomas con ventana efectiva
- [x] Identificar medicamento por exposición
- [x] Comparar con medicamento
- [x] Comparar sin medicamento
- [x] Calcular diferencia en pp
- [x] Detectar medicamento inseparable
- [x] Detectar pocos datos
- [x] Detectar mayor cuando aparece
- [x] Detectar menor cuando aparece
- [x] Detectar diferencia pequeña
- [x] Calcular mediana temporal
- [x] Mostrar número de tomas
- [x] Mostrar dosis registradas
- [x] Mostrar nombre en historial
- [x] Mantener fixtures históricos compatibles
- [x] Tests del motor
- [x] Test QA
- [x] ADR-0028
- [x] Documentación Obsidian
- [x] Validación visual

## Fase 3.11 — Medicina antes vs después

- [x] Ventana previa de 6 h
- [x] Frontera exacta -6 h
- [x] Excluir eventos anteriores a -6 h
- [x] Mantener ventana posterior efectiva
- [x] Consultar 6 h previas en Supabase
- [x] Conservar Medicina previa en historial
- [x] Antes solamente
- [x] Después solamente
- [x] Antes y después
- [x] Sin medicamento
- [x] Comparar antes vs sin
- [x] Comparar después vs sin
- [x] Diferencias en pp
- [x] Mediana temporal antes
- [x] Mediana temporal después
- [x] Mostrar tomas antes y después
- [x] Escenario QA Omeprazol antes
- [x] Mantener escenario posterior
- [x] Test de frontera
- [x] Tests del motor
- [x] Test QA
- [x] BUG-0015
- [x] ADR-0029
- [x] Documentación Obsidian
- [x] Validación visual

## Fase 3.12 — Latencia de respuesta

- [x] Usar primera respuesta marcada
- [x] No confundir primera evacuación con primera respuesta marcada
- [x] Intervalo 0–6 h
- [x] Intervalo >6–12 h
- [x] Intervalo >12–24 h
- [x] Mediana de latencia
- [x] Rango mínimo–máximo
- [x] Proporción de exposiciones marcadas
- [x] Perfil principalmente temprano
- [x] Perfil principalmente intermedio
- [x] Perfil principalmente tardío
- [x] Perfil variable
- [x] Pocos datos
- [x] Umbral dominante 60%
- [x] Muestra mínima de 3 respuestas marcadas
- [x] Respetar ventana efectiva
- [x] Reutilizar escenario tardío de Café + Leche
- [x] Escenario QA tardío 16 h
- [x] Tests del motor
- [x] Tests QA
- [x] ADR-0030
- [x] Documentación Obsidian
- [x] Validación visual

## Fase 3.13 — Hardening y cierre de Patrones v1

- [x] Cerrar Fase 3.12
- [x] Congelar contrato metodológico
- [x] Documentar Patrones v1
- [x] Test frontera exacta 6 h
- [x] Test frontera exacta 12 h
- [x] Test frontera exacta 24 h
- [x] Test evento exactamente en siguiente comida
- [x] Test comidas simultáneas
- [x] Test evento exactamente en inicio
- [x] Test múltiples evacuaciones
- [x] Test primera evacuación vs primera marcada
- [x] Test Medicina antes + después
- [x] Grupos de timing mutuamente excluyentes
- [x] Auditoría integral de escenarios QA
- [x] Detectar NaN
- [x] Detectar Infinity
- [x] Budget bundle inicial
- [x] Budget chunks JavaScript
- [x] Aislamiento QA automatizado
- [x] Crear npm run check:patterns-v1
- [x] ADR-0031
- [x] Documentación Obsidian
- [x] Smoke visual final
- [x] Release Patrones v1

## Fase 4.0 — Centro diario v1

- [x] Mantener Patrones v1 congelado
- [x] Mostrar alimentos dentro del timeline
- [x] Respetar sort_order de alimentos
- [x] Mantener notas separadas de los alimentos
- [x] Registrar comida desde Calendario
- [x] Registrar Bristol desde Calendario
- [x] Registrar Medicina desde Calendario
- [x] Usar día seleccionado + hora actual
- [x] Resumen de registros del día en Calendario
- [x] Estado vacío accionable
- [x] Test de fecha de registro
- [x] Test de enriquecimiento del timeline
- [x] Test de presentación del timeline
- [x] BUG-0016
- [x] ADR-0032
- [x] Documentación Obsidian
- [x] Regresión completa de Patrones v1
- [x] Validación visual en Hoy
- [x] Validación visual en Calendario

## Fase 4.1 — Captura rápida v1

- [x] Cerrar Fase 4.0
- [x] Atajos de alimentos
- [x] Historial real por eaten_at
- [x] Favoritos como fallback
- [x] Evitar alimentos duplicados
- [x] Filtrar atajos mientras se escribe
- [x] Atajos de Medicina
- [x] Historial real por taken_at
- [x] Recuperar última dosis
- [x] Recuperar última unidad
- [x] Fallback a unidad predeterminada
- [x] Invalidar caché de atajos al guardar
- [x] Scroll horizontal móvil
- [x] Ranking deduplicado
- [x] Test de ranking
- [x] ADR-0033
- [x] Documentación Obsidian
- [x] Regresión Patrones v1
- [x] Validación visual alimentos
- [x] Validación visual Medicina
- [x] Validación visual móvil

## Fase 4.2 — Corregir registros v1

- [x] Cerrar Fase 4.1
- [x] Menú de acciones en Timeline
- [x] Disponible desde Hoy
- [x] Disponible desde Calendario
- [x] Editar comida
- [x] Editar fecha/hora de comida
- [x] Editar tipo de comida
- [x] Editar alimentos
- [x] Editar notas de comida
- [x] Mantener atajos al editar comida
- [x] Editar Bristol
- [x] Editar fecha/hora Bristol
- [x] Editar tipo Bristol
- [x] Editar urgencia
- [x] Editar dolor
- [x] Editar notas Bristol
- [x] Editar Medicina
- [x] Editar medicamento
- [x] Editar fecha/hora Medicina
- [x] Editar dosis
- [x] Editar unidad
- [x] Editar motivo
- [x] Editar notas Medicina
- [x] Mantener atajos al editar Medicina
- [x] Eliminar comida
- [x] Eliminar Bristol
- [x] Eliminar Medicina
- [x] Confirmación antes de eliminar
- [x] No eliminar catálogos reutilizables
- [x] Invalidar timeline
- [x] Invalidar patterns
- [x] Invalidar daily-suggestions
- [x] Test de normalización
- [x] Test de copy del editor
- [x] ADR-0034
- [x] Documentación Obsidian
- [x] Regresión Patrones v1
- [x] Validación visual comida
- [x] Validación visual Bristol
- [x] Validación visual Medicina
- [x] Validación visual eliminación
- [x] Validación móvil
- [x] BUG-0017 — eliminar estado derivado mediante useEffect

## Fase 4.3 — Comidas recientes v1

- [x] Cerrar Fase 4.2
- [x] Derivar plantillas desde historial
- [x] Ordenar por eaten_at
- [x] Recuperar tipo de comida
- [x] Recuperar alimentos
- [x] No copiar fecha histórica
- [x] No copiar hora histórica
- [x] No copiar notas históricas
- [x] Deduplicar combinaciones repetidas
- [x] Ignorar orden al deduplicar
- [x] Conservar orden de la comida más reciente
- [x] Diferenciar desayuno/comida/cena/colación
- [x] Máximo 6 plantillas
- [x] Scroll horizontal móvil
- [x] Ocultar plantillas al comenzar captura manual
- [x] Mantener atajos individuales
- [x] Test de motor
- [x] ADR-0035
- [x] Documentación Obsidian
- [x] Regresión Patrones v1
- [x] Validación visual plantilla
- [x] Validación de fecha/hora
- [x] Validación móvil

## Fase 4.4 — Resumen diario v1

- [x] Cerrar Fase 4.3
- [x] Derivar resumen del timeline existente
- [x] Evitar consulta adicional
- [x] Conteo de comidas
- [x] Conteo Bristol
- [x] Conteo Medicina
- [x] Última comida
- [x] Hora de última comida
- [x] Último Bristol
- [x] Hora de último Bristol
- [x] Última Medicina
- [x] Hora de última Medicina
- [x] Día vacío
- [x] Botón volver a Hoy
- [x] Orden independiente del input
- [x] Test del motor
- [x] ADR-0036
- [x] Documentación Obsidian
- [x] Regresión Patrones v1
- [ ] Validación visual día con registros
- [ ] Validación visual día vacío
- [ ] Validación botón Hoy
- [ ] Validación móvil

## Fase 4.5 — Programación de Medicina v1

### Fase 4.5A — Modelo y captura

- [x] Separar programado de tomado
- [x] medicine_schedules
- [x] medicine_schedule_times
- [x] RLS
- [x] Fecha de inicio
- [x] Fecha de fin
- [x] Zona horaria
- [x] N veces al día
- [x] Horas específicas
- [x] Cada X horas
- [x] Primera hora del intervalo
- [x] Dosis opcional
- [x] Unidad opcional
- [x] Motivo
- [x] Notas
- [x] No crear medicine_entries automáticamente
- [x] Preparar schedule_id en medicine_entries
- [x] Preparar scheduled_for en medicine_entries
- [x] Evitar doble registro de una ocurrencia
- [x] Motor de recurrencia
- [x] Test de timezone
- [x] Test de intervalos
- [x] Test de horas específicas
- [x] Formulario Una toma / Programar
- [x] Ver programaciones existentes
- [x] ADR-0037
- [x] Documentación Obsidian
- [x] Regresión Patrones v1
- [x] Validación visual 4.5A

### Fase 4.5B — Calendario y toma real

- [ ] Expandir horarios en Calendario
- [ ] Indicador visual Programado
- [ ] Diferenciar programado de registrado
- [ ] Registrar una ocurrencia como tomada
- [ ] Permitir corregir hora real
- [ ] Vincular schedule_id
- [ ] Vincular scheduled_for
- [ ] Refrescar estado del Calendario
- [ ] Validación móvil
