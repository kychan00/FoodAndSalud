---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0012 — FoodAndSalud es Mobile First

## Contexto

FoodAndSalud se utilizará principalmente para registrar eventos cotidianos:

- alimentos;
- comidas;
- evacuaciones;
- síntomas;
- observaciones rápidas.

Estas acciones normalmente ocurrirán desde un teléfono.

## Decisión

La experiencia principal de FoodAndSalud será diseñada para dispositivos móviles.

## Prioridad

El orden de diseño será:

1. teléfono;
2. tablet;
3. escritorio.

## Principio

La versión de escritorio no debe intentar llenar artificialmente todo el ancho
de la pantalla.

El contenido puede permanecer centrado y conservar dimensiones similares a una
aplicación móvil.

## Layout

Los formularios y pantallas principales utilizarán anchos de lectura controlados.

En escritorio:

- el contenido se mantiene centrado;
- se conserva la jerarquía móvil;
- pueden aparecer márgenes amplios;
- no se agregarán columnas innecesarias únicamente para ocupar espacio.

## Interacción

Los controles principales deberán ser cómodos para touch.

Objetivos:

- targets grandes;
- formularios simples;
- pocas decisiones por pantalla;
- registro rápido;
- navegación con una mano cuando sea posible.

## Inspiración

Se toma como referencia la facilidad de uso de aplicaciones como Flo:

- tarjetas simples;
- jerarquía clara;
- pocos elementos simultáneos;
- acciones principales evidentes.

FoodAndSalud conservará identidad visual propia.

## Regla

Cuando exista conflicto entre optimizar una interacción para escritorio
o para móvil, se priorizará móvil salvo que la funcionalidad requiera
explícitamente más espacio.
