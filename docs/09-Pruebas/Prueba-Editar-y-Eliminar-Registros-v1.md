---
tipo: prueba
estado: automatizada-y-visual
fecha: 2026-10-06
fase: "4.2"
---

# Prueba — Editar y Eliminar Registros v1

## Automatizada

### Normalización de comida

Archivo:

`food.edit.test.ts`.

Comprueba:

- deduplicación;
- espacios;
- mayúsculas;
- orden;
- valores vacíos.

### Presentación

Archivo:

`entryEditor.presentation.test.ts`.

Comprueba copy para:

- comida;
- Bristol;
- Medicina;
- confirmación de eliminación.

## Visual — Comida

1. abrir Hoy;
2. tocar `…` en una comida;
3. elegir Editar;
4. cambiar un alimento;
5. cambiar la hora;
6. guardar;
7. verificar timeline.

## Visual — Bristol

1. abrir `…`;
2. editar Bristol;
3. cambiar tipo y urgencia;
4. guardar;
5. verificar timeline.

## Visual — Medicina

1. abrir `…`;
2. editar;
3. cambiar dosis o medicamento;
4. guardar;
5. verificar timeline.

## Eliminación

Para cada tipo:

1. abrir `…`;
2. elegir Eliminar;
3. cancelar;
4. comprobar que permanece;
5. repetir;
6. confirmar;
7. comprobar que desaparece.

## Regresión

Debe continuar aprobando:

`npm run check:patterns-v1`.
