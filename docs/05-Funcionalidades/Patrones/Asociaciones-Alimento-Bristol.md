---
tipo: funcionalidad
estado: implementacion
fecha: 2026-10-06
fase: "3.0"
---

# Asociaciones Alimento → Respuesta Digestiva

## Objetivo

FoodAndSalud intenta detectar patrones temporales entre alimentos registrados
y respuestas digestivas posteriores.

El sistema no intenta diagnosticar intolerancias ni demostrar causalidad.

## Ventana temporal

Cada exposición a un alimento se observa durante las siguientes:

24 horas.

## Exposición

Una exposición ocurre cuando un alimento aparece dentro de una comida.

Ejemplo:

Comida:

- arroz
- pollo
- salsa

produce tres exposiciones analíticas.

## Exposición evaluable

Una exposición es evaluable cuando existe al menos un registro de baño dentro
de las siguientes 24 horas.

Si no existe registro de baño posterior, esa exposición no se interpreta como
"buena" ni "mala".

Simplemente no puede evaluarse.

## Respuesta marcada

Una respuesta digestiva se considera marcada cuando ocurre al menos una de
estas condiciones:

- Bristol 1–2;
- Bristol 6–7;
- urgencia >= 2;
- dolor >= 2.

## Referencia personal

FoodAndSalud calcula primero qué proporción de los registros de baño del usuario
son respuestas marcadas.

Esto crea una referencia personal.

Ejemplo:

20 registros de baño
5 marcados

Referencia personal:

25%

## Asociación por alimento

Para cada alimento se calculan:

- exposiciones totales;
- exposiciones evaluables;
- exposiciones con respuesta marcada;
- porcentaje observado;
- porcentaje ajustado;
- diferencia contra referencia personal;
- severidad;
- coincidencia con Medicina.

## Suavizado

Se utiliza suavizado hacia la referencia personal.

Esto evita que:

1 exposición +
1 respuesta marcada

produzca inmediatamente una señal extrema.

El peso inicial utilizado es:

4 observaciones equivalentes de referencia.

## Evidencia

### Baja

0–3 exposiciones evaluables.

### Media

4–7 exposiciones evaluables.

### Mayor

8 o más exposiciones evaluables.

## Señal

### Pocos datos

Menos de 3 exposiciones evaluables.

### Sin señal clara

Los datos disponibles no muestran un aumento suficientemente consistente frente
a la referencia personal.

### Señal media

La frecuencia ajustada supera la referencia personal de manera relevante.

### Señal alta

Existe una diferencia mayor y repetida frente a la referencia personal.

## Medicina

El motor registra si existe Medicina dentro de la misma ventana temporal.

Esto no elimina automáticamente la asociación, pero muestra una advertencia de
posible factor concurrente.

## Regla epistemológica

Nunca convertir automáticamente:

"aparece antes de"

en:

"causa".

La interfaz debe utilizar expresiones como:

- posible asociación;
- coincidencia temporal;
- señal;
- patrón;
- requiere más datos.
