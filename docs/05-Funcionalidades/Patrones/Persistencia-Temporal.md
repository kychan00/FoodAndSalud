---
tipo: funcionalidad
estado: implementacion
fecha: 2026-10-06
fase: "3.8"
---

# Persistencia Temporal

## Objetivo

Distinguir entre una asociación que:

- se mantiene;
- aparece recientemente;
- se debilita;
- permanece estable sin una diferencia grande;
- cambia de manera variable;
- todavía no tiene datos suficientes.

## División temporal

Las comidas se ordenan cronológicamente.

Después se dividen en:

- mitad anterior;
- mitad reciente.

La división utiliza aproximadamente la mitad del número de comidas.

No representa necesariamente:

45 días vs 45 días.

## Razón

Dividir por número de comidas reduce el riesgo de obtener un periodo prácticamente
vacío cuando los registros están concentrados en determinadas fechas.

## Cálculo

En cada mitad se calculan por separado:

### Alimento

- exposiciones evaluables;
- respuestas marcadas;
- tasa.

### Comparación

- comidas sin el alimento;
- evaluables;
- respuestas marcadas;
- tasa.

### Diferencia

tasa del alimento
-

tasa comparadora.

## Umbrales descriptivos

Una diferencia se considera claramente elevada cuando es:

> = 25 puntos porcentuales.

Se considera pequeña cuando es:

<= 12 puntos porcentuales.

## Persistente

La diferencia es elevada en ambas mitades.

## Más reciente

La diferencia es pequeña en la mitad anterior y elevada en la reciente.

## Se debilitó

La diferencia es elevada en la mitad anterior y pequeña en la reciente.

## Estable

La diferencia cambia poco entre ambos periodos sin cumplir las reglas anteriores.

## Variable

Existe un cambio mayor pero no sigue una trayectoria simple.

## Datos insuficientes

Se requieren al menos:

2 exposiciones evaluables del alimento

y:

2 comidas comparadoras evaluables

en cada mitad.

## Importante

Persistencia temporal no significa causalidad.

Describe únicamente la repetición del contraste dentro del historial registrado.
