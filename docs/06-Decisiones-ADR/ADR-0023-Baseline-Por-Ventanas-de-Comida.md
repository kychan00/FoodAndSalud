---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "3.5"
---

# ADR-0023 — Baseline por ventanas de comida

## Contexto

Una tasa de asociación por alimento utiliza como unidad:

exposición.

Compararla directamente con una tasa por evacuaciones individuales mezcla
denominadores.

## Decisión

La unidad comparadora será también una ventana de comida.

## Para un alimento A

### Grupo observado

Comidas donde A estuvo presente.

### Comparador preferido

Comidas donde A no estuvo presente.

## Ventana de resultado

24 horas.

Una ventana es evaluable si existe al menos una evacuación posterior dentro de
esas 24 horas.

## Respuesta marcada

La ventana se clasifica como marcada si al menos una evacuación cumple:

- Bristol 1–2;
- Bristol 6–7;
- urgencia >= 2;
- dolor >= 2.

## Fallback

Cuando no existen comidas evaluables sin el alimento:

usar el baseline global de ventanas de comida.

## Consecuencia

Un alimento registrado en todas las comidas no obtiene artificialmente una
señal fuerte por ausencia de un control real.

## Evacuaciones

La tasa por eventos de baño se conserva únicamente como métrica descriptiva.

## Limitación

Las ventanas de diferentes comidas todavía pueden superponerse temporalmente.

Ejemplo:

desayuno
→ comida
→ misma evacuación posterior.

Esta limitación deberá abordarse en una fase analítica posterior.
