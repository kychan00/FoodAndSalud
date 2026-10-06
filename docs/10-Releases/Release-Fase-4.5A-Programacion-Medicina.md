---
tipo: release
estado: completado
fecha: 2026-10-06
fase: "4.5A"
---

# Release — Fase 4.5A Programación de Medicina

## Estado

Completada.

## Separación fundamental

FoodAndSalud distingue:

`programado`

de:

`registrado como tomado`.

Crear una programación no genera automáticamente un:

`medicine_entry`.

## Base de datos

Se incorporaron:

- medicine_schedules;
- medicine_schedule_times.

Medicine entries incorpora opcionalmente:

- schedule_id;
- scheduled_for.

## Métodos de programación

### Horas específicas

El usuario puede introducir:

- N veces al día;
- una hora manual para cada toma.

### Intervalos

El usuario puede introducir:

- cada X horas;
- primera hora programada.

## Periodo

Toda programación conserva:

- fecha de inicio;
- fecha de fin inclusiva;
- zona horaria IANA.

## Seguridad

Las tablas poseen RLS por propietario.

## Patrones

Patrones v1 sigue utilizando exclusivamente:

`medicine_entries`.

Las programaciones no cuentan como exposición.

## Calidad

Se aprobaron:

- tests;
- lint;
- TypeScript;
- build;
- presupuesto de bundles;
- aislamiento QA;
- contrato de tipos Supabase;
- regresión completa de Patrones v1;
- validación visual de Una toma;
- validación visual de Programar;
- horas específicas;
- intervalos;
- validaciones del formulario.

## Documentación

- [[Programacion-de-Medicina-v1]]
- [[ADR-0037-Programado-No-Equivale-a-Tomado]]
- [[Prueba-Programacion-de-Medicina-v1]]
