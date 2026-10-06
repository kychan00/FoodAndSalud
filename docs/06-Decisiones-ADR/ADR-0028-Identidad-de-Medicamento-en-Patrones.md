---
tipo: adr
estado: aprobado
fecha: 2026-10-06
fase: "3.10"
---

# ADR-0028 — Identidad de Medicamento en Patrones

## Contexto

El motor de patrones recibía los eventos de Medicina únicamente como:

- id del evento;
- fecha y hora.

Eso era suficiente para detectar:

`alguna Medicina presente`.

No permitía distinguir medicamentos.

## Decisión

`MedicineObservation` acepta opcionalmente:

- medicineId;
- medicineName;
- dose;
- unit.

## Compatibilidad

Los campos nuevos son opcionales.

Esto permite conservar:

- fixtures históricos;
- motor agregado;
- pruebas anteriores.

## Datos reales

`foodDetail.service.ts` recupera:

medicine_entries

y después resuelve sus nombres desde:

medicines.

## Razón para no usar solamente el nombre

El agrupamiento se realiza mediante:

medicineId.

El nombre es información de presentación.

Esto evita mezclar medicamentos por coincidencias textuales.

## Exposiciones

Varias tomas del mismo medicamento dentro de una sola ventana cuentan como:

una exposición con ese medicamento.

El número total de tomas se conserva por separado.

## Dosis

Las dosis se muestran como contexto descriptivo.

No se comparan todavía como niveles de exposición.

## Interpretación

Una diferencia observada con un medicamento específico no demuestra:

- efecto adverso;
- efecto protector;
- interacción;
- causalidad.
