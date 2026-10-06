---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "3.8"
---

# ADR-0026 — Persistencia por Mitades Cronológicas

## Contexto

Una tasa agregada de 90 días puede ocultar cambios temporales.

Ejemplo:

8 respuestas marcadas concentradas únicamente al inicio

no representan la misma estructura que:

8 respuestas distribuidas de forma consistente.

## Decisión

El historial de comidas se divide en dos mitades cronológicas según el número de
comidas registradas.

## Periodos

- anterior;
- reciente.

## Unidad

Se conserva la misma unidad metodológica de fases anteriores:

ventanas de comida.

## Comparación

En cada mitad:

comidas con alimento

vs

comidas sin alimento.

## Muestra mínima

Cada mitad requiere:

- 2 exposiciones evaluables del alimento;
- 2 comparaciones evaluables.

## Estados

- persistente;
- más reciente;
- debilitado;
- estable;
- variable;
- insuficiente.

## Razón para no usar días fijos

Los registros personales pueden ser muy irregulares.

Dos periodos iguales en días podrían contener:

muchas comidas en uno

y:

muy pocas en el otro.

## Limitación

Las dos mitades no necesariamente representan intervalos iguales en tiempo.

Por eso la interfaz muestra las fechas reales de cada periodo.

## Causalidad

La clasificación es descriptiva.

No demuestra causalidad.
