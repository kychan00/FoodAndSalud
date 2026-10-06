---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "3.10"
---

# Prueba — Medicamentos Específicos

## Motor

`medicineSpecific.engine.test.ts`

## QA

`medicineSpecific.qa.test.ts`

## Escenario

Café:

10 exposiciones.

Omeprazol 20 mg aparece:

6 veces.

Hora:

1 h después de Café.

## Con Omeprazol

6 evaluables.

6 marcadas.

Tasa:

100%.

## Sin Omeprazol

4 evaluables.

0 marcadas.

Tasa:

0%.

## Diferencia

+100 pp.

## Resultado

Mayor cuando aparece.

## Dosis

20 mg.

## Mediana temporal

1.0 h después.

## Inseparable

El escenario:

`Café + Medicina`

identifica ahora:

`Medicina QA`.

Como aparece en todas las exposiciones:

resultado:

No se puede separar.

## Sin Medicina

El escenario:

`Café con señal alta`

no genera factores de medicamento específico.
