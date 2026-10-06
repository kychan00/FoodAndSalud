---
tipo: release
estado: completado
fecha: 2026-10-06
fase: "3.0"
---

# Release — Fase 3.0 Motor de Patrones

## Estado

Completada.

## Motor

FoodAndSalud dispone de un primer motor de asociaciones personales entre:

alimento
→ ventana temporal
→ respuesta digestiva

## Variables consideradas

- Bristol;
- urgencia;
- dolor;
- Medicina concurrente.

## Ventana inicial

24 horas.

## Respuesta marcada

Una observación se considera marcada cuando ocurre al menos uno de estos casos:

- Bristol 1–2;
- Bristol 6–7;
- urgencia >= 2;
- dolor >= 2.

## Evidencia

El motor diferencia:

- pocos datos;
- evidencia baja;
- evidencia media;
- evidencia mayor.

## Señales

- sin señal clara;
- señal media;
- señal alta.

## Referencia personal

Los alimentos se comparan contra la frecuencia general de respuestas marcadas
del propio usuario.

## QA

Se implementó un laboratorio sintético no persistente.

Escenarios:

- Café señal alta;
- Queso con pocos datos;
- Leche señal media;
- Arroz neutral;
- Café + Medicina;
- Café + Leche juntos.

## Gráficas QA

Se añadieron:

- Bristol por fecha;
- etiquetas de alimentos;
- coincidencia observada;
- coincidencia ajustada;
- referencia personal.

## Bugs documentados

- BUG-0003
- BUG-0004
- BUG-0005

## Principio epistemológico

FoodAndSalud presenta asociaciones.

No presenta causalidad automática ni diagnósticos.
