---
tipo: release
estado: desplegada
fecha: 2026-10-06
canal: github-pages
---

# Release — Preview de Producción en GitHub Pages

## Objetivo

Publicar el estado funcional actual de FoodAndSalud para revisión sobre una URL
real.

## Incluye

La aplicación disponible hasta:

Fase 4.5D.

Esto incluye:

- autenticación;
- Hoy;
- Calendario;
- Patrones v1;
- registro de comida;
- registro Bristol;
- registro de Medicina;
- edición y eliminación de registros;
- captura rápida;
- comidas recientes;
- resumen diario;
- programación de Medicina;
- calendario de Medicina;
- registrar una ocurrencia como tomada;
- administrar programaciones;
- exportación `.ics`.

## GitHub Pages

La aplicación utiliza:

- Vite;
- base `/FoodAndSalud/`;
- HashRouter;
- rama de publicación `gh-pages`.

## Backend

Supabase permanece como backend remoto.

El build de producción utiliza:

- VITE_SUPABASE_URL;
- VITE_SUPABASE_PUBLISHABLE_KEY.

Los valores proceden del `.env.local` local durante el build.

El archivo `.env.local` no se publica ni se versiona.

## Patrones

El quality gate de Patrones v1 debe aprobar antes del deploy.

## Estado de 4.5D

La funcionalidad se despliega para validación manual real.

No se marcan todavía como aprobadas las comprobaciones manuales pendientes de:

- descarga ICS;
- Apple Calendar;
- Google Calendar;
- programación finalizada;
- móvil.

## Auth

Debe comprobarse la allow-list de redirects de Supabase Auth para la URL de
GitHub Pages antes de considerar completo el flujo de recuperación de
contraseña.
