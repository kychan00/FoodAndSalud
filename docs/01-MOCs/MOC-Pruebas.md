---
tipo: moc
estado: activo
fecha: 2026-10-06
---

# MOC — Pruebas

## Objetivo

Centralizar la estrategia de pruebas de FoodAndSalud.

La calidad del proyecto no depende de una sola clase de pruebas.

Se utilizan diferentes niveles.

## Base de datos

- [[Pruebas-de-Base-de-Datos]]
- pgTAP
- RLS
- migraciones
- db reset
- db lint

## Autenticación

- [[Prueba-Auth-End-to-End]]

## Funcionalidad

- [[Prueba-E2E-Fase-2.2]]

## Motor de Patrones

- [[Prueba-Motor-Asociaciones]]
- [[Laboratorio-QA-Patrones]]
- [[Datos-Sinteticos-Patrones]]

## Bugs

Los bugs encontrados durante las pruebas se documentan en:

`07-Bugs`

## Filosofía

Cada bug importante debe producir al menos uno de estos resultados:

- una prueba nueva;
- una regla arquitectónica;
- una documentación;
- una mejora de validación.

## Tipos de prueba

### Unitarias

Prueban lógica aislada.

Ejemplo:

motor de asociaciones.

### Base de datos

Prueban:

- tablas;
- constraints;
- RLS;
- vistas;
- migraciones.

### Integración

Prueban la comunicación entre módulos.

Ejemplo:

Supabase → motor → Patrones.

### E2E

Prueban el recorrido real del usuario.

Ejemplo:

Registrar comida
→ Supabase
→ Timeline
→ Calendario
→ Patrones.

### QA sintético

Permite forzar escenarios artificiales sin contaminar datos reales.

Ejemplo:

Café
→ Bristol 7
repetido ocho veces.

- [[Graficas-Temporales]]
- [[BUG-0005-Horario-Fixtures-QA]]
- [[ADR-0017-Graficas-Reutilizables-Recharts]]

## Detalle de alimento

- [[Prueba-Detalle-Alimento]]

## Detalle sintético

- [[Prueba-QA-Detalle-Alimento]]
- [[ADR-0019-Vista-Compartida-Real-QA]]

## Combinaciones

- [[Prueba-Combinaciones-Alimentos]]

## TypeScript y fixtures

- [[BUG-0007-Type-Widening-Fixture-QA]]

## Rendimiento

- [[Prueba-Bundle-Produccion]]

## Combinaciones temporales

- [[Prueba-Combinaciones-Multiventana]]

## Registro de escenarios QA

- [[BUG-0008-Marcador-Ambiguo-Registro-QA]]

## Baseline

- [[Prueba-Baseline-Comparable]]

## Superposición temporal

- [[Prueba-Ventanas-Superpuestas]]

## Magnitud y estabilidad

- [[Prueba-Magnitud-y-Estabilidad]]
- [[Prueba-Consistencia-Historial-Patrones]]

## Persistencia temporal

- [[Prueba-Persistencia-Temporal]]

## Factores concurrentes

- [[Prueba-Factores-Concurrentes]]

## Medicamentos específicos

- [[Prueba-Medicamentos-Especificos]]

## Timing de Medicina

- [[Prueba-Medicina-Antes-y-Despues]]

## Latencia de respuesta

- [[Prueba-Latencia-de-Respuesta]]

## Patrones v1

- [[Auditoria-Patrones-v1]]

## Experiencia diaria

- [[Prueba-Centro-Diario-v1]]

## Captura rápida

- [[Prueba-Captura-Rapida-v1]]

## Corrección de registros

- [[Prueba-Editar-y-Eliminar-Registros-v1]]

## Comidas recientes

- [[Prueba-Comidas-Recientes-v1]]

## Resumen diario

- [[Prueba-Resumen-Diario-v1]]

## Programación de Medicina

- [[Prueba-Programacion-de-Medicina-v1]]
