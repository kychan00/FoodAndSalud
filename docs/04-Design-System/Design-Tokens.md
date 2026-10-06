---
tipo: design-system
estado: activo
---

# Design Tokens

La fuente de verdad técnica es:

```text
src/styles/tokens.css
```

## Principio

Los componentes no deben inventar valores visuales cuando exista un patrón
reutilizable.

## Identidad

La interfaz tendrá una apariencia:

- cálida
- limpia
- ligera
- amable
- fácil de escanear
- optimizada para móvil

La facilidad visual puede inspirarse en aplicaciones de seguimiento como Flo,
pero FoodAndSalud tendrá una identidad propia.

## Dominios visuales

### Alimentos

Token:

```css
--color-food
```

Identifica registros y elementos relacionados con alimentación.

### Baño

Token:

```css
--color-bathroom
```

Identifica registros gastrointestinales.

### Insights

Token:

```css
--color-insight
```

Identifica análisis, tendencias y asociaciones.

## Superficies

La interfaz utiliza un fondo cálido y tarjetas claras para separar contenido
sin introducir ruido visual.

## Espaciado

El sistema utiliza una escala consistente basada principalmente en múltiplos
de cuatro píxeles.

## Radios

Los elementos interactivos y tarjetas deben mantener una apariencia suave.

## Movimiento

Las animaciones serán breves y funcionales.

Nunca deben retrasar una acción frecuente como registrar comida o una
evacuación.

## Accesibilidad

El color nunca debe ser la única forma de comunicar estado.

Debe acompañarse de uno o varios de los siguientes elementos:

- texto
- icono
- etiqueta
- posición
- patrón visual

## Regla

Si un nuevo componente necesita repetidamente un mismo valor visual,
ese valor deberá evaluarse como candidato a Design Token.
