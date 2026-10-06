---
tipo: funcionalidad
estado: liberado
fecha: 2026-10-06
version: "1.0"
---

# Patrones v1

## Propósito

Patrones v1 busca detectar asociaciones temporales descriptivas entre:

- comidas;
- alimentos;
- evacuaciones;
- Medicina registrada.

No realiza diagnóstico.

No demuestra causalidad.

## Unidad principal

La unidad metodológica es:

la ventana de una comida.

## Inicio

La ventana comienza:

después de la hora registrada de la comida.

Un evento exactamente a la hora de la comida no pertenece a su ventana
posterior.

## Final

La ventana termina en el primero de estos eventos:

- límite nominal del análisis;
- siguiente comida posterior.

## Siguiente comida

Una nueva comida interrumpe la ventana anterior.

Un evento exactamente a la hora de la nueva comida no pertenece a la comida
anterior.

## Comidas simultáneas

Dos registros de comida con exactamente la misma hora no se interrumpen entre
sí.

Ambos utilizan como siguiente comida:

la primera comida con una hora estrictamente posterior.

## Horizontes

Se observan:

- 6 h;
- 12 h;
- 24 h.

Los límites nominales exactos se incluyen cuando la ventana no fue interrumpida.

## Respuesta marcada

Una evacuación se considera marcada según las reglas del motor de asociación.

Una exposición completa se considera marcada si:

cualquier evacuación dentro de su ventana efectiva

cumple esas reglas.

## Primera evacuación

Se conserva para explicar:

qué ocurrió primero.

## Primera respuesta marcada

Se conserva independientemente de la primera evacuación.

Ejemplo:

- Bristol 4 a 4 h;
- Bristol 7 a 10 h.

Resultado:

- primera evacuación: 4 h;
- primera respuesta marcada: 10 h;
- ventana marcada: sí.

## Baseline

El baseline principal utiliza:

ventanas de comida comparables.

Para un alimento:

se prefieren comidas evaluables donde el alimento está ausente.

Si no existen controles evaluables separados:

se utiliza el baseline global de ventanas de comida.

## Magnitud

Patrones v1 puede mostrar:

- diferencia absoluta en puntos porcentuales;
- RR descriptivo cuando es estimable;
- muestras observadas.

## Estabilidad

Se utiliza una sensibilidad:

leave-one-out.

Describe cuánto cambia la categoría al retirar una exposición.

No es:

- valor p;
- intervalo de confianza;
- inferencia causal.

## Persistencia

El historial se divide cronológicamente en dos mitades por número de comidas:

- anterior;
- reciente.

Esto permite describir patrones:

- persistentes;
- recientes;
- debilitados;
- estables;
- variables.

## Combinaciones

Se compara un alimento:

- junto con otro alimento;
- sin ese otro alimento.

Si ambos aparecen siempre juntos:

se informa inseparabilidad.

## Factores concurrentes

Se muestran factores que aparecen en el mismo contexto.

No se denominan automáticamente:

confusores causales.

## Medicina específica

Los registros pueden conservar:

- medicine_id;
- nombre;
- dosis;
- unidad;
- hora.

Los medicamentos se agrupan mediante:

medicine_id.

## Medicina posterior

Una toma posterior pertenece al contexto de una comida si ocurre:

después de la comida

y:

antes de terminar su ventana efectiva.

## Medicina previa

Se observan también:

6 horas antes de la comida.

Incluido:

exactamente -6 h.

Excluido:

más de 6 h antes.

## Timing de Medicina

Un medicamento puede clasificarse como:

- antes solamente;
- después solamente;
- antes y después;
- ausente.

Los grupos son mutuamente excluyentes por exposición.

## Latencia

La latencia utiliza:

primera respuesta marcada.

Intervalos:

- 0–6 h;
- > 6–12 h;
- > 12–24 h.

Se utiliza la mediana como resumen principal.

## Lenguaje

La interfaz debe utilizar términos como:

- asociación;
- coincidencia;
- diferencia observada;
- contexto;
- persistencia;
- latencia.

Debe evitar afirmar que:

un alimento o medicamento causó una respuesta.

## Cambios futuros

Una modificación de cualquiera de estas reglas metodológicas requiere:

- test;
- actualización de este contrato;
- ADR cuando cambie una decisión metodológica estable.
