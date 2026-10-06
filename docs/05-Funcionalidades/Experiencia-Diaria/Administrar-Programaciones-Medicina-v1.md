---
tipo: funcionalidad
estado: implementada
fecha: 2026-10-06
fase: "4.5C"
---

# Administrar Programaciones de Medicina v1

## Acceso

Medicina ofrece:

- Una toma;
- Programar;
- Administrar.

## Estados

Una programación puede mostrarse como:

- Próxima;
- Activa;
- Finalizada;
- Terminada.

## Editar

Puede modificarse:

- dosis;
- unidad;
- periodo;
- horas específicas;
- número de horas;
- intervalo;
- primera hora;
- motivo;
- notas.

Editar la programación no modifica tomas históricas.

## Finalizar ahora

`stopped_at`

guarda el instante exacto desde el cual dejan de producirse nuevas ocurrencias.

Así una programación finalizada a mitad del día no continúa generando horarios
posteriores de ese mismo día.

## Quitar programación

No se realiza DELETE físico.

Se utiliza:

`archived_at`.

La programación deja de aparecer en:

- Administrar;
- Calendario;
- futuras ocurrencias.

Las tomas reales ya registradas permanecen.

## Patrones

Sin cambios.

Patrones continúa utilizando exclusivamente:

`medicine_entries`.
