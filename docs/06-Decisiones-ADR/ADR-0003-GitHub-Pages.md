---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0003 — GitHub Pages

## Contexto

La aplicación frontend puede compilarse como contenido estático.

## Decisión

Publicar el frontend mediante GitHub Pages.

## Ruta

```text
https://kychan00.github.io/FoodAndSalud/
```

## Consecuencia

Vite deberá trabajar bajo el base path:

```text
/FoodAndSalud/
```

Las rutas deben funcionar correctamente al ejecutarse desde ese subdirectorio.

## Consideración

La estrategia de React Router deberá elegirse teniendo en cuenta las
limitaciones de routing de GitHub Pages.
