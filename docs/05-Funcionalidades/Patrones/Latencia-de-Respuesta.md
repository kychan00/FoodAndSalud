---
tipo: funcionalidad
estado: implementada
fecha: 2026-10-06
fase: "3.12"
---

# Latencia de Respuesta

## Objetivo

Describir cuándo aparece la primera respuesta marcada después de un alimento.

## Unidad

La latencia se mide en:

horas desde la comida

hasta:

la primera evacuación marcada dentro de la ventana efectiva.

## Importante

No se utiliza simplemente:

la primera evacuación.

Ejemplo:

08:00 — alimento

12:00 — Bristol 4

18:00 — Bristol 7

La latencia marcada es:

10 h.

No:

4 h.

## Intervalos

### Temprana

0–6 h.

### Intermedia

> 6–12 h.

### Tardía

> 12–24 h.

## Perfil dominante

Se requieren al menos:

3 exposiciones con respuesta marcada.

Un intervalo se considera dominante si contiene:

> = 60%

de las primeras respuestas marcadas.

## Estados

- principalmente temprana;
- principalmente intermedia;
- principalmente tardía;
- distribución variable;
- pocos datos.

## Métricas

Se muestran:

- exposiciones marcadas;
- proporción marcada;
- mediana;
- rango mínimo–máximo;
- distribución por intervalos.

## Ventanas interrumpidas

La latencia utiliza:

`firstAdverseBathroom`

del historial.

Por tanto ya respeta la regla de Fase 3.6:

una nueva comida termina la atribución de la comida anterior.

## Interpretación

La latencia expresa proximidad temporal.

No demuestra causalidad.
