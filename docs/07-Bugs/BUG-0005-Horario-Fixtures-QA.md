---
tipo: bug
estado: cerrado
severidad: baja
fecha: 2026-10-06
---

# BUG-0005 — Horarios de fixtures QA convertidos por el navegador

## Síntoma

Un fixture definido como:

`2026-09-01T08:00:00Z`

aparecía visualmente como:

`02:00 a.m.`

en un navegador ubicado en UTC-6.

## Causa

La fecha sintética estaba expresada en UTC.

`Intl.DateTimeFormat` utilizaba la zona horaria local del navegador y convertía
automáticamente la hora.

## Problema

Para datos reales esto es correcto.

Para fixtures QA es confuso porque el fixture pretende ser determinista y su
hora forma parte explícita del escenario.

## Solución

El Laboratorio QA usa ahora formatters específicos con:

`timeZone: UTC`

De esta forma:

`08:00Z`

se visualiza como:

`08:00`

independientemente de la computadora que ejecute las pruebas.

## Alcance

Esta regla aplica únicamente a datos sintéticos de QA.

Los datos reales de FoodAndSalud continúan mostrándose de acuerdo con la zona
horaria correspondiente al usuario.

## Test

`qaDate.test.ts`

verifica que la hora sintética permanezca estable.

## Estado

Cerrado.
