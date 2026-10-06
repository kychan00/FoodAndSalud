---
tipo: analitica
estado: diseño
fecha: 2026-10-06
---

# Analítica de Asociaciones

## Objetivo

Encontrar patrones temporales entre alimentos consumidos y evacuaciones
posteriores.

FoodAndSalud realiza análisis exploratorio.

No establece causalidad médica.

---

# Unidad de exposición

Una exposición ocurre cuando un alimento aparece en un `food_entry`.

Ejemplo:

14:00

- arroz
- pollo
- salsa

Esto representa tres exposiciones asociadas al mismo evento de comida.

---

# Ventanas temporales

Inicialmente estudiaremos:

- 0–2 horas
- 2–6 horas
- 6–12 horas
- 12–24 horas
- 24–48 horas

Las ventanas deben ser configurables desde la capa analítica y no estar
codificadas dentro de componentes React.

---

# Outcomes iniciales

Para cada alimento podremos calcular:

## Exposiciones

Número de ocasiones en que el alimento fue registrado.

## Evento posterior

Número de exposiciones seguidas por al menos una evacuación dentro de
determinada ventana.

## Bristol 6–7

Frecuencia de eventos posteriores de tipo 6 o 7.

## Bristol 1–2

Frecuencia de eventos posteriores de tipo 1 o 2.

## Urgencia

Promedio o distribución de urgencia posterior.

## Dolor

Promedio o distribución de dolor posterior.

## Tiempo hasta primer evento

Tiempo transcurrido desde la exposición hasta la primera evacuación registrada.

---

# Baseline

Los resultados deben compararse contra el comportamiento habitual del propio
usuario.

No contra una supuesta población estándar.

---

# Tamaño de muestra

La interfaz debe distinguir entre:

- evidencia insuficiente
- patrón débil
- patrón moderado
- patrón consistente

No debemos mostrar un score fuerte después de una o dos observaciones.

---

# Lenguaje de UI

Correcto:

> Se observó una frecuencia mayor de registros Bristol 6–7 después de consumir
> este alimento.

Incorrecto:

> Este alimento le causa diarrea.

---

# Fase inicial

No utilizar modelos de IA para inferir causalidad.

Primero construiremos métricas transparentes y reproducibles.

La lógica deberá poder explicar de dónde salió cada insight.
