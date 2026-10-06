---
tipo: design-system
estado: activo
fecha: 2026-10-06
---

# Gráficas Temporales

## Objetivo

Las gráficas de FoodAndSalud deben ayudar a entender una historia, no solamente
mostrar números.

## Principios

### Fechas visibles

Toda gráfica temporal debe mostrar fechas en el eje horizontal.

### Etiquetas contextuales

Cuando sea posible, una fecha debe indicar también el evento relevante.

Ejemplo:

`01 sep · Café`

### Tooltips

Al tocar o pasar sobre un punto deben mostrarse los detalles relevantes.

Para Bristol:

- fecha;
- alimento;
- Bristol;
- urgencia;
- dolor;
- Medicina concurrente.

### Mobile First

Si una serie contiene demasiados puntos para un teléfono, la gráfica puede
tener desplazamiento horizontal.

No comprimir tantos puntos que las etiquetas dejen de ser legibles.

### Escala Bristol

La escala vertical conserva:

1–7

La zona 3–5 puede representarse visualmente como zona central de referencia.

Esto no convierte automáticamente esos valores en una evaluación médica.

### Asociación por alimento

Las gráficas comparativas pueden mostrar:

- coincidencia observada;
- coincidencia ajustada;
- referencia personal.

### Colores

Usar los dominios existentes del Design System:

- food;
- bathroom;
- insight;
- primary;
- success.

No crear una paleta paralela exclusiva para gráficas.

## Reutilización

Los componentes de gráficas deben poder utilizarse tanto en:

- QA;
- Patrones reales;
- detalle futuro de alimento.
