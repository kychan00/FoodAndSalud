---
tipo: bug
estado: cerrado
severidad: media
fecha: 2026-10-06
fase: "4.2"
---

# BUG-0017 — Estado de Formulario Derivado en useEffect

## Síntoma

La primera implementación de edición de registros pasó las pruebas funcionales,
pero ESLint detuvo Fase 4.2 con:

`react-hooks/set-state-in-effect`.

Afectaba:

- FoodEntryEditForm;
- BathroomEntryEditForm;
- MedicineEntryEditForm;
- EntryEditorSheet.

## Causa

Los formularios cargaban datos con React Query y posteriormente copiaban
sincrónicamente esos datos a múltiples estados mediante `useEffect`.

Flujo anterior:

`query -> useEffect -> setState -> render`

Esto producía una segunda fase de renderizado únicamente para inicializar
campos.

## Solución

Cada editor se divide conceptualmente en:

### Contenedor

Responsable de:

- React Query;
- loading;
- error;
- datos remotos.

### Formulario

Sólo se monta cuando los datos existen.

Sus estados se inicializan directamente con los datos recibidos.

Nuevo flujo:

`query -> data -> mount form(initialData)`

No existe sincronización posterior mediante `useEffect`.

## EntryEditorSheet

También se eliminó el efecto que reiniciaba:

- modo;
- estado de eliminación;
- error.

Ahora el estado se restablece explícitamente mediante:

`close()`

y al cancelar cada acción.

## Recuperación

El primer script de recuperación intentó eliminar el efecto mediante una
expresión regular dependiente del formato del archivo.

Ese parche no encontró el bloque después del formateo real.

La corrección definitiva sustituyó `EntryEditorSheet.tsx` como módulo completo,
evitando un nuevo parche textual frágil.

## Regla

Para cambios estructurales de componentes:

preferir reemplazo de módulo o transformaciones estructurales verificables.

No depender de la distribución de líneas generada por Prettier.

## Estado

Cerrado.
