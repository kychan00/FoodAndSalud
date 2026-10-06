---
tipo: release
estado: completado
fecha: 2026-10-06
fase: "4.5C"
---

# Release — Fase 4.5C Administrar Programaciones de Medicina

## Estado

Completada.

## Administración

Medicina incorpora:

- Una toma;
- Programar;
- Administrar.

## Estados de programación

- Próxima;
- Activa;
- Finalizada;
- Terminada.

## Edición

Una programación editable puede modificar:

- dosis;
- unidad;
- periodo;
- horas específicas;
- intervalo;
- primera hora;
- motivo;
- notas.

Los medicine_entries históricos no se reescriben.

## Finalizar ahora

Se utiliza:

`stopped_at`.

Las ocurrencias iguales o posteriores a ese instante dejan de generarse.

## Quitar programación

Se utiliza:

`archived_at`.

No se realiza DELETE físico.

Así las tomas históricas vinculadas conservan la identidad de su programación.

## Calendario

Las programaciones archivadas dejan de producir ocurrencias.

## Patrones

Sin cambios.

Sólo medicine_entries representa una toma registrada.

## Calidad

Se aprobaron:

- tests;
- lifecycle;
- stopped_at exacto;
- archived_at;
- lint;
- TypeScript;
- build;
- presupuesto de bundles;
- Patrones v1;
- validación visual de edición;
- validación visual de finalización;
- validación visual de archivado;
- validación móvil.

## Documentación

- [[Administrar-Programaciones-Medicina-v1]]
- [[ADR-0039-Ciclo-de-Vida-de-Programaciones-de-Medicina]]
- [[Prueba-Administrar-Programaciones-Medicina-v1]]
- [[BUG-0018-Parche-de-Fixture-Dependiente-del-Formato]]
