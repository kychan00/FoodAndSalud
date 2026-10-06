---
tipo: release
estado: completado
fecha: 2026-10-06
fase: "3.7"
---

# Release — Fase 3.7 Magnitud y Estabilidad

## Estado

Completada.

## Magnitud

El detalle de alimento muestra ahora:

- diferencia absoluta;
- RR descriptivo;
- muestra observada;
- muestra comparadora.

## Diferencia absoluta

Ejemplo:

75% observado

25% comparación

Resultado:

+50 puntos porcentuales.

## RR descriptivo

Ejemplo:

75%
/
25%

Resultado:

3.00×.

Cuando la tasa comparadora es 0%:

no se muestra infinito.

Se muestra:

`No estimable`.

## Estabilidad

Se implementó una prueba leave-one-out.

Cada exposición evaluable se retira una vez y se vuelve a calcular la categoría
de señal.

La aplicación clasifica la estabilidad como:

- alta;
- media;
- baja;
- no estimable.

## Explicabilidad

Se corrigió la diferencia entre:

primera evacuación

y:

primera respuesta marcada.

Una primera evacuación normal ya no oculta una respuesta marcada posterior
dentro de la misma ventana.

## Validación

Se aprobaron:

- 56 tests;
- lint;
- TypeScript;
- build;
- bundle inicial menor a 500 kB;
- QA fuera de producción;
- validación visual.

## Documentación

- [[Magnitud-y-Estabilidad]]
- [[ADR-0025-Medidas-Descriptivas-de-Efecto]]
- [[BUG-0012-Primera-Evacuacion-vs-Respuesta-Marcada]]
- [[BUG-0013-Parche-Import-FoodHistoryChart]]
- [[Prueba-Magnitud-y-Estabilidad]]
- [[Prueba-Consistencia-Historial-Patrones]]
