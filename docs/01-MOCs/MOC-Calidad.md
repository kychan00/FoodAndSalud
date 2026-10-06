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
