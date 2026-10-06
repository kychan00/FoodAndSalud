---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0016 — QA sintético no persistente

## Problema

Para probar el motor de Patrones se necesitan escenarios con múltiples días de
datos.

Insertarlos manualmente en Supabase:

- ensuciaría el historial real;
- afectaría estadísticas;
- podría olvidarse borrar registros;
- dificultaría reproducir bugs.

## Decisión

Crear un laboratorio QA completamente sintético y no persistente.

## Datos

Los fixtures viven en código.

No se insertan en PostgreSQL.

## Entorno

El laboratorio visual solamente está disponible cuando:

`import.meta.env.DEV === true`

## Motor

Los fixtures pasan por el mismo motor puro utilizado para los datos reales.

Esto permite comprobar el comportamiento sin crear una segunda implementación.

## Producción

La ruta QA no debe estar disponible como herramienta funcional de usuario.

## Consecuencia

Podemos crear escenarios extremos y reproducibles sin contaminar el historial.
