---
tipo: prueba
estado: activo
fecha: 2026-10-06
fase: "3.0"
---

# Laboratorio QA — Patrones

## Objetivo

Permitir revisar visualmente el motor de asociaciones utilizando datasets
sintéticos controlados.

## Ruta

En desarrollo:

`/#/qa/patterns`

## Producción

La ruta está protegida mediante:

`import.meta.env.DEV`

En un build de producción redirige a:

`/patterns`

## Persistencia

El laboratorio:

- no consulta Supabase;
- no escribe Supabase;
- no altera datos reales;
- no modifica el usuario.

## Componentes reutilizados

El laboratorio usa el mismo:

`buildAssociationReport`

que utiliza el análisis real.

También reutiliza:

`FoodAssociationCard`

Por tanto sirve para probar simultáneamente:

- algoritmo;
- ranking;
- etiquetas;
- colores;
- layout;
- responsive;
- advertencias.

## Escenarios iniciales

### Café con señal alta

Café:

8 exposiciones.

Todas seguidas por respuesta marcada.

Arroz:

8 exposiciones.

Todas seguidas por Bristol 4 normal.

Objetivo:

Café debe quedar arriba.

### Pocos datos

Queso:

2 exposiciones.

Ambas adversas.

Objetivo:

No permitir señal fuerte por una muestra demasiado pequeña.

### Leche con señal media

4 exposiciones.

3 marcadas.

1 normal.

Objetivo:

Probar umbral intermedio.

### Arroz neutral

8 exposiciones normales.

Existen respuestas adversas en otros días.

Objetivo:

Comprobar que la referencia personal no genere falsos positivos.

### Café + Medicina

6 exposiciones adversas.

6 coincidencias con Medicina.

Objetivo:

Mostrar un factor concurrente.

### Café + Leche juntos

Ambos aparecen siempre en las mismas comidas.

Objetivo:

Mostrar una limitación real:

el sistema no puede determinar cuál de ambos explica mejor el patrón si nunca
aparecen separados.

## Gráficas

El laboratorio incluye ahora dos visualizaciones.

### Bristol por fecha

Muestra:

fecha
→ alimento previo
→ Bristol

El tooltip incluye:

- fecha completa;
- alimento;
- Bristol;
- urgencia;
- dolor;
- presencia de Medicina.

### Coincidencia por alimento

Compara:

- porcentaje observado;
- porcentaje ajustado;
- referencia personal.

## Horarios sintéticos

Los fixtures QA se visualizan en UTC deliberadamente.

Esto mantiene los escenarios deterministas entre computadoras y evita que una
hora ficticia cambie según la zona horaria del navegador.

Véase:

[[BUG-0005-Horario-Fixtures-QA]]
