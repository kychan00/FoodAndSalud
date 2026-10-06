---
tipo: prueba
estado: automatizada
fecha: 2026-10-06
fase: "3.2"
---

# Prueba — Combinaciones de Alimentos

## Motor

`combination.engine.test.ts`

## Casos

### Siempre juntos

Café + Leche en todas las exposiciones.

Resultado:

No se puede separar.

### Mayor con combinación

Café + Leche:

100%.

Café sin Leche:

0%.

Resultado:

Mayor con la combinación.

### Menor con combinación

Se prueba también el caso inverso.

### Tasas similares

Se comprueba que diferencias pequeñas no se conviertan en señales fuertes.

### Sin evacuación

Las exposiciones sin datos posteriores continúan siendo no evaluables.

## QA

Escenario:

`Café solo vs Café + Leche`

Permite probar visualmente:

Café global
→ detalle
→ comparación con Leche.

## Objetivo

Detectar inconsistencias entre:

motor general
→ detalle
→ combinación
→ historial.
