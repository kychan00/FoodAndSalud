---
tipo: moc
estado: activo
---

# MOC — Insights

## Objetivo

Descubrir asociaciones temporales entre alimentación y eventos
gastrointestinales.

## Regla fundamental

FoodAndSalud no debe presentar correlaciones como causalidad médica.

## Lenguaje permitido

- asociación observada
- patrón detectado
- frecuencia posterior
- posible relación temporal
- mayor frecuencia registrada
- menor frecuencia registrada

## Lenguaje que debe evitarse

- este alimento causa
- este alimento provoca
- usted es intolerante a
- usted tiene alergia a
- este alimento le hace daño con certeza

## Ventanas temporales candidatas

- 0–2 horas
- 2–6 horas
- 6–12 horas
- 12–24 horas
- 24–48 horas

## Variables futuras

- número de exposiciones
- número de eventos posteriores
- Bristol promedio
- frecuencia Bristol 6–7
- frecuencia Bristol 1–2
- urgencia promedio
- tiempo medio hasta el evento
- baseline personal
- diferencia respecto al baseline

## Implementación

- [[Patrones]]
