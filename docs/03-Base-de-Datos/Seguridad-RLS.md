---
tipo: seguridad
estado: aprobado
fecha: 2026-10-06
---

# Seguridad — Row Level Security

## Principio

La interfaz nunca es la frontera de seguridad.

La base de datos debe impedir directamente que un usuario acceda a datos
de otra cuenta.

## Tablas privadas

RLS debe estar habilitado en:

- profiles
- foods
- food_entries
- food_entry_items
- bathroom_entries

## Identidad

La identidad se obtiene mediante:

```sql
(select auth.uid())
```

## Operaciones

Cada operación tendrá una política explícita:

- SELECT
- INSERT
- UPDATE
- DELETE

No utilizaremos políticas ambiguas para `public`.

Las políticas privadas se asignan explícitamente al rol:

`authenticated`

## Usuario anónimo

El rol `anon` no debe recibir permisos sobre los datos personales.

## foods

Los alimentos no tendrán DELETE desde la API.

En vez de borrarlos:

`archived_at`

Esto mantiene intacto el historial.

## food_entries

El usuario puede:

- leer
- insertar
- modificar
- eliminar

sus propios eventos.

## food_entry_items

Las claves foráneas compuestas impiden relacionar accidentalmente registros
de usuarios diferentes.

## bathroom_entries

Solo el propietario puede acceder a un registro.

## Views

Las vistas expuestas deberán utilizar:

`security_invoker = true`

para respetar las políticas RLS de las tablas subyacentes.
