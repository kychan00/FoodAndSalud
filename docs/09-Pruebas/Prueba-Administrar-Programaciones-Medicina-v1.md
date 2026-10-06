---
tipo: prueba
estado: automatizada-y-visual
fecha: 2026-10-06
fase: "4.5C"
---

# Prueba — Administrar Programaciones de Medicina v1

## Base de datos

`004_medicine_schedule_lifecycle_test.sql`

comprueba:

- stopped_at;
- archived_at;
- índices lifecycle.

## Recurrencia

Los tests comprueban:

- corte exacto de horas específicas;
- corte exacto de intervalos.

## Lifecycle

`medicineSchedule.management.test.ts`

comprueba:

- Próxima;
- Activa;
- Finalizada;
- Terminada;
- texto de horario.

## Visual

### Editar

Medicina → Administrar → programación → Editar.

Cambiar horario o periodo.

Esperado:

el Calendario refleja el nuevo futuro.

Los medicine_entries históricos permanecen.

### Finalizar

En una programación Activa:

`Finalizar ahora`.

Esperado:

- estado Finalizada;
- desaparecen ocurrencias posteriores;
- registros reales permanecen.

### Quitar

Cancelar primero.

Esperado:

sin cambios.

Confirmar después.

Esperado:

- desaparece de Administrar;
- desaparece del Calendario programado;
- medicine_entries permanecen.

## Regresión

Debe continuar aprobando:

`npm run check:patterns-v1`.
