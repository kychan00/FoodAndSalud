---
tipo: release
estado: completado
fecha: 2026-10-06
fase: "3.10"
---

# Release — Fase 3.10 Medicamentos Específicos

## Estado

Completada.

## Cambio principal

El motor ya no trata todos los eventos de Medicina como una categoría anónima.

El detalle puede conservar:

- medicine_id;
- nombre;
- dosis;
- unidad;
- horario relativo.

## Comparación

Por cada medicamento identificado se compara:

alimento + medicamento

vs

el mismo alimento sin ese medicamento.

## Ejemplo QA

Café:

10 exposiciones.

Omeprazol:

6 exposiciones.

### Con Omeprazol

6/6 respuestas marcadas.

100%.

### Sin Omeprazol

0/4 respuestas marcadas.

0%.

### Diferencia

+100 pp.

## Contexto

También se muestran:

- número de tomas;
- mediana temporal;
- dosis registradas.

## QA isolation

El guard inicial produjo un falso positivo al buscar literalmente:

`Omeprazol`.

Omeprazol también aparece legítimamente como placeholder del formulario de
registro.

Se corrigió el guard para utilizar sentinels exclusivos de QA.

Véase:

[[BUG-0014-Guard-QA-Nombre-Real-de-Medicamento]].

## Validación

Se aprobaron:

- 80 tests;
- lint;
- TypeScript;
- build;
- bundle inicial menor a 500 kB;
- fixtures QA fuera de producción;
- validación visual.

## Documentación

- [[Medicamentos-Especificos]]
- [[ADR-0028-Identidad-de-Medicamento-en-Patrones]]
- [[Prueba-Medicamentos-Especificos]]
- [[BUG-0014-Guard-QA-Nombre-Real-de-Medicamento]]
