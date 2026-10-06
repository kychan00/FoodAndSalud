---
tipo: moc
estado: activo
---

# MOC — Calidad

## Regla

Todo bug significativo debe producir conocimiento permanente.

## Flujo

Problema
→ reproducción
→ causa raíz
→ solución
→ prevención
→ test
→ estándar reutilizable

## Regla complementaria

Toda solución buena que pueda reutilizarse debe documentarse como patrón.

## Herramientas

- ESLint
- Prettier
- TypeScript
- Vitest
- React Testing Library
- Playwright

## Objetivo

Evitar que el proyecto dependa de recordar cómo se resolvió algo anteriormente.

## Bugs documentados

- [[BUG-0003-Migracion-Nueva-No-Aplicada-Local]]
- [[BUG-0002-React-SetState-En-Effect]]
- [[BUG-0001-Docker-Supabase-Read-Only-Memory]]

## Pruebas End-to-End

- [[Prueba-Auth-End-to-End]]

## Automatización de desarrollo

- [[BUG-0004-Parche-Dependiente-de-Formato]]

- [[MOC-Pruebas]]
- [[Laboratorio-QA-Patrones]]
- [[Datos-Sinteticos-Patrones]]
- [[ADR-0016-QA-Sintetico-No-Persistente]]

- [[BUG-0005-Horario-Fixtures-QA]]

## Automatización

- [[BUG-0006-Parche-PatternsPage-Dependiente-de-Formato]]

## TypeScript

- [[BUG-0007-Type-Widening-Fixture-QA]]

## Rendimiento

- [[Code-Splitting-y-Lazy-Loading]]
- [[ADR-0021-Lazy-Loading-Por-Rutas]]

## Automatización estructural

- [[BUG-0008-Marcador-Ambiguo-Registro-QA]]

## Metodología

- [[BUG-0009-Baseline-Denominadores-No-Comparables]]
- [[ADR-0023-Baseline-Por-Ventanas-de-Comida]]

## Superposición temporal

- [[BUG-0010-Doble-Atribucion-Ventanas-Superpuestas]]
- [[BUG-0011-Parche-Import-Combination-Engine]]
- [[ADR-0024-Censura-Por-Nueva-Comida]]

## Consistencia analítica

- [[BUG-0012-Primera-Evacuacion-vs-Respuesta-Marcada]]
- [[BUG-0013-Parche-Import-FoodHistoryChart]]
- [[ADR-0025-Medidas-Descriptivas-de-Efecto]]

## Persistencia temporal

- [[ADR-0026-Persistencia-Por-Mitades-Cronologicas]]

## Lenguaje causal

- [[ADR-0027-Factores-Concurrentes-No-Confusores-Causales]]

## Identidad de Medicina

- [[ADR-0028-Identidad-de-Medicamento-en-Patrones]]

## Guards QA

- [[BUG-0014-Guard-QA-Nombre-Real-de-Medicamento]]

## Timing de Medicina

- [[ADR-0029-Ventana-Previa-de-Medicina]]
- [[BUG-0015-Parche-startIso-Dependiente-de-Formato]]

## Semántica temporal

- [[ADR-0030-Latencia-de-Primera-Respuesta-Marcada]]

## Patrones v1

- [[ADR-0031-Contrato-Estable-Patrones-v1]]
- [[Auditoria-Patrones-v1]]

## Release estable

- [[Release-Patrones-v1]]

## Experiencia diaria

- [[ADR-0032-Enriquecimiento-de-Timeline-en-Cliente]]

## Captura rápida

- [[ADR-0033-Atajos-Basados-en-Historial-Personal]]

## Corrección de registros

- [[ADR-0034-Registros-Historicos-vs-Catalogos-Reutilizables]]

## React

- [[BUG-0017-Estado-de-Formulario-Derivado-en-useEffect]]

## Comidas recientes

- [[ADR-0035-Plantillas-Derivadas-de-Comidas-Historicas]]

## Resumen diario

- [[ADR-0036-Resumen-Diario-Derivado-del-Timeline]]

## Programación de Medicina

- [[ADR-0037-Programado-No-Equivale-a-Tomado]]

## Ocurrencias programadas

- [[ADR-0038-Ocurrencias-Programadas-Derivadas]]

## Lifecycle de programaciones

- [[ADR-0039-Ciclo-de-Vida-de-Programaciones-de-Medicina]]

## Bugs de automatización

- [[BUG-0018-Parche-de-Fixture-Dependiente-del-Formato]]
