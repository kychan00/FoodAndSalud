---
tipo: design-system
estado: activo
fecha: 2026-10-06
---

# Bottom Sheet

## Objetivo

FoodAndSalud utiliza Bottom Sheets para acciones rápidas en móvil.

## Uso inicial

La acción Registrar abre un Bottom Sheet con dos opciones:

- Alimento
- Baño

## Principios

- aparece desde la parte inferior;
- conserva contexto de la pantalla actual;
- puede cerrarse tocando el fondo;
- puede cerrarse mediante Escape en escritorio;
- bloquea el scroll de la página mientras está abierto;
- respeta safe-area inferior;
- tiene ancho máximo controlado en escritorio.

## Componente

`src/components/ui/BottomSheet.tsx`

## Regla

No crear implementaciones particulares de modal inferior dentro de features.

Las features deberán reutilizar BottomSheet.
