---
tipo: funcionalidad
estado: implementada
fecha: 2026-10-06
fase: "4.3"
---

# Comidas Recientes v1

## Objetivo

Permitir reutilizar una combinación completa de alimentos registrada
anteriormente.

## Ejemplo

Registro histórico:

`Desayuno`

- Café;
- Pan;
- Huevo.

Al abrir:

Registrar comida

puede aparecer una tarjeta:

`Desayuno`

`Café · Pan · Huevo`

`Usar esta comida`.

## Al tocar

Se recuperan:

- tipo de comida;
- alimentos.

No se recuperan:

- hora anterior;
- fecha anterior;
- notas anteriores.

## Razón

La combinación puede repetirse.

La hora y el contexto escrito pertenecen al evento histórico original.

## Recencia

Las plantillas se ordenan mediante:

`food_entries.eaten_at`.

No:

`created_at`.

## Duplicados

Dos comidas se consideran la misma plantilla cuando coinciden:

- tipo de comida;
- conjunto de alimentos.

La comparación ignora:

- mayúsculas;
- espacios extra;
- orden de captura.

Se conserva la versión más reciente.

## Interfaz

Se muestran hasta:

6 plantillas.

Las tarjetas utilizan scroll horizontal en móvil.

## Protección contra sobrescritura

Las plantillas completas sólo se muestran cuando:

- todavía no hay alimentos seleccionados;
- el campo de alimento está vacío.

Así una plantilla no aparece como invitación a reemplazar una captura ya
iniciada.

## Atajos individuales

Los atajos de alimentos de Fase 4.1 permanecen disponibles.

## Base de datos

No requiere migración.

Las plantillas se derivan de registros históricos existentes.
