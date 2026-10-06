---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0005 — Design Tokens

## Problema

Los colores, espaciados, radios y tamaños definidos directamente dentro de
componentes generan inconsistencia visual y deuda técnica.

## Decisión

Toda propiedad visual reutilizable deberá derivarse de Design Tokens.

La fuente principal será:

```text
src/styles/tokens.css
```

## Regla

Evitar valores visuales arbitrarios dentro de componentes.

Especialmente:

- colores
- radios
- sombras
- espaciados
- tiempos de animación

Si una propiedad representa un patrón reutilizable, debe convertirse en token.

## Resultado esperado

Modificar el lenguaje visual general no deberá requerir editar decenas de
componentes individualmente.
