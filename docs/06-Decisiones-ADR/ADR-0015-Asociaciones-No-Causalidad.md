---
tipo: adr
estado: aprobado
fecha: 2026-10-06
---

# ADR-0015 — Asociaciones temporales, no causalidad

## Contexto

El objetivo principal de FoodAndSalud es ayudar al usuario a observar qué
alimentos coinciden repetidamente con respuestas digestivas.

Los datos son observacionales.

Existen múltiples variables que pueden intervenir:

- otras comidas;
- cantidades;
- combinaciones;
- medicamentos;
- tiempo;
- estrés;
- enfermedades;
- variación normal;
- información no registrada.

## Decisión

FoodAndSalud no utilizará lenguaje causal para sus resultados automáticos.

## Permitido

- posible asociación;
- señal alta;
- señal media;
- coincidencia;
- aparece frecuentemente antes de;
- patrón temporal.

## No permitido

- este alimento causa;
- este alimento provoca;
- usted es intolerante a;
- este alimento es dañino;
- diagnóstico.

## Razón

La aplicación realiza seguimiento personal y análisis exploratorio.

No existe un experimento controlado que permita inferir causalidad de forma
automática.

## Consecuencia de diseño

La pestaña se llama:

Patrones

y no:

Diagnóstico.

## Consecuencia técnica

Los resultados siempre deberán mostrar también:

- cantidad de observaciones;
- evidencia;
- referencia personal;
- ventana temporal.
