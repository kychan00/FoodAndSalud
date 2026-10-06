---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0004 — RLS por usuario

## Contexto

FoodAndSalud almacena información personal relacionada con alimentación
y comportamiento gastrointestinal.

## Decisión

Toda tabla que contenga datos privados deberá utilizar Row Level Security.

Los registros deberán asociarse al usuario autenticado.

## Regla

Un usuario nunca debe poder:

- consultar
- crear
- editar
- eliminar

registros pertenecientes a otro usuario.

## Implementación

Las políticas utilizarán:

```sql
auth.uid()
```

como identidad principal.

## Principio

La seguridad debe seguir funcionando incluso si alguien modifica
manualmente el código JavaScript del navegador.
