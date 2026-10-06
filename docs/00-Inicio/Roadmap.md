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
- [ ] Validación visual de los seis escenarios
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
