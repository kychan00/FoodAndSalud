---
tipo: release
estado: completado
fecha: 2026-10-06
version: "Patrones v1.0.0"
---

# Release — Patrones v1

## Estado

Liberado.

## Propósito

Patrones v1 convierte los registros personales de FoodAndSalud en análisis
descriptivos de asociaciones temporales.

La versión se congela con un contrato metodológico explícito.

Véase:

[[Patrones-v1]]

y:

[[ADR-0031-Contrato-Estable-Patrones-v1]].

---

# Capacidades

## Asociación por alimento

El motor identifica exposiciones repetidas y respuestas marcadas posteriores.

La unidad principal es:

ventana de comida.

---

## Baseline comparable

La comparación principal utiliza:

comidas evaluables donde el alimento está ausente.

Cuando no existe un control separable:

se utiliza el baseline global de ventanas de comida.

---

## Ventanas efectivas

Horizontes:

- 6 h;
- 12 h;
- 24 h.

Una nueva comida interrumpe la ventana de la comida anterior.

Esto evita atribuir el mismo evento a múltiples comidas sucesivas.

---

## Magnitud

Se muestran medidas descriptivas como:

- diferencia absoluta;
- RR descriptivo cuando es estimable;
- tamaño de muestra.

---

## Estabilidad

Se utiliza sensibilidad:

leave-one-out.

Estados:

- alta;
- media;
- baja;
- no estimable.

---

## Persistencia temporal

El historial se divide cronológicamente en:

- periodo anterior;
- periodo reciente.

Puede describirse como:

- persistente;
- más reciente;
- debilitado;
- estable;
- variable;
- insuficiente.

---

## Combinaciones

Un alimento puede compararse:

- acompañado de otro alimento;
- sin ese alimento.

El sistema detecta también:

inseparabilidad.

---

## Factores concurrentes

Se muestran contextos concurrentes sin denominarlos automáticamente:

confusores causales.

---

## Medicina específica

Los eventos pueden conservar:

- medicine_id;
- nombre;
- dosis;
- unidad;
- horario.

Se analiza cada medicamento por separado.

---

## Medicina antes y después

Contextos:

- antes solamente;
- después solamente;
- antes y después;
- sin medicamento.

La ventana previa es:

6 horas.

La ventana posterior utiliza:

la ventana efectiva de la comida.

---

## Latencia

La latencia utiliza:

la primera respuesta marcada.

No simplemente:

la primera evacuación.

Intervalos:

- 0–6 h;
- > 6–12 h;
- > 12–24 h.

Se muestran:

- mediana;
- rango;
- distribución;
- perfil temporal.

---

# Contrato de interpretación

Patrones v1 describe:

- asociaciones;
- coincidencias;
- diferencias observadas;
- contexto;
- estabilidad;
- persistencia;
- latencia.

No afirma:

- causalidad;
- intolerancia;
- diagnóstico;
- efecto farmacológico;
- recomendación terapéutica.

---

# Hardening

La Fase 3.13 añadió pruebas contractuales para:

- frontera exacta 6 h;
- frontera exacta 12 h;
- frontera exacta 24 h;
- siguiente comida;
- comidas simultáneas;
- inicio de ventana;
- múltiples evacuaciones;
- primera evacuación vs primera respuesta marcada;
- Medicina antes y después;
- grupos temporales mutuamente excluyentes.

---

# Auditoría integral

Todos los escenarios QA registrados atraviesan:

- detalle;
- combinaciones;
- persistencia;
- factores concurrentes;
- Medicina específica;
- timing de Medicina;
- latencia.

Se verifica que ningún motor produzca:

- NaN;
- Infinity;
- -Infinity.

Véase:

[[Auditoria-Patrones-v1]].

---

# Quality gate

Comando oficial:

`npm run check:patterns-v1`

Incluye:

1. tests;
2. lint;
3. TypeScript;
4. build;
5. presupuesto de bundle;
6. aislamiento QA.

---

# Resultado de cierre

En el cierre de Patrones v1:

- 29 archivos de test;
- 131 tests;
- todos aprobados;
- lint aprobado;
- TypeScript aprobado;
- build aprobado;
- bundle inicial menor a 500 kB;
- todos los chunks JavaScript menores a 500 kB;
- fixtures QA fuera de producción;
- smoke visual final aprobado.

---

# Estado futuro

Patrones v1 queda congelado.

Nuevas métricas o cambios metodológicos no deben agregarse de forma incremental
sin modificar explícitamente:

- contrato;
- pruebas;
- documentación;
- ADR correspondiente.

El desarrollo principal continúa fuera del módulo Patrones.
