---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0006 — Timestamps y zona horaria

## Contexto

Las asociaciones dependen fuertemente del tiempo transcurrido entre comida
y evacuación.

## Decisión

Los eventos se almacenan como:

`timestamptz`

La preferencia de zona horaria se almacena separadamente en:

`profiles.timezone`

## Motivo

Los cálculos deben realizarse sobre instantes inequívocos.

La presentación se adapta posteriormente a la zona horaria del usuario.
