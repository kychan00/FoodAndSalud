---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "3.11"
---

# Prueba — Medicina Antes y Después

## Frontera

Comida:

12:00.

### 06:00

Exactamente seis horas antes.

Resultado:

incluida.

### 05:59

Más antigua que seis horas.

Resultado:

excluida.

### 13:00

Resultado:

posterior.

## QA previo

Escenario:

`Café con Omeprazol antes`.

Café:

10 exposiciones.

Omeprazol:

6 exposiciones.

Mediana:

2 h antes.

### Antes

6/6 marcadas.

100%.

### Sin Omeprazol

0/4 marcadas.

0%.

### Diferencia

+100 pp.

## QA posterior

El escenario previo:

`Café con Medicina discriminable`

debe continuar mostrando Omeprazol como:

posterior

con mediana:

1 h después.

## Exclusividad

Antes

-

después

-

ambas

-

sin medicamento

debe equivaler al total de exposiciones.
