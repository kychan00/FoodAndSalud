---
tipo: bug
estado: cerrado
severidad: alta
fecha: 2026-10-06
---

# BUG-0001 — Supabase local con Docker provoca fallo read-only

## Problema

Al intentar ejecutar el stack completo de Supabase mediante Docker Desktop,
el equipo sufrió una presión importante de memoria.

Durante la descarga y preparación de las imágenes, el almacenamiento interno
de Docker pasó a modo de solo lectura.

## Comportamiento esperado

`supabase start` debía levantar el entorno local completo.

## Comportamiento observado

Docker comenzó a mostrar errores similares a:

```text
write /var/lib/desktop-containerd/...: read-only file system
```

El stack no pudo terminar de iniciar.

## Evidencia

El problema ocurrió mientras Docker descargaba y preparaba múltiples servicios:

- PostgreSQL
- Auth
- Studio
- Realtime
- Storage
- Edge Runtime
- Logflare
- Mailpit
- PostgREST
- Kong
- Vector
- Postgres Meta

La presión de memoria del sistema aumentó considerablemente.

## Prueba de aislamiento

Docker pudo ejecutar correctamente:

```bash
docker run --rm hello-world
```

Por lo tanto el problema no estaba relacionado con:

- el repositorio FoodAndSalud;
- la migración SQL;
- Supabase remoto;
- GitHub.

Posteriormente incluso `supabase db start` mediante Docker dejó el contenedor
de PostgreSQL en estado `unhealthy`.

## Causa raíz

El stack de desarrollo basado en Docker resultó demasiado pesado/inestable
para esta máquina durante la inicialización de todos los servicios.

El almacenamiento interno de Docker terminó entrando en estado read-only.

## Solución

Se cambió el entorno local al runtime nativo de Supabase para macOS Apple Silicon.

Se ejecutó:

```bash
export SUPABASE_EXPERIMENTAL_STACK=1

npx supabase start \
  --runtime native \
  --preparation on-demand \
  --exclude rest,auth,realtime,storage,functions,studio,mail,analytics,pooler
```

Esto inició únicamente PostgreSQL.

## Resultado

El runtime nativo:

- inició correctamente;
- quedó healthy;
- aplicó la migración;
- ejecutó pgTAP;
- pasó database lint;
- permitió generar tipos TypeScript;
- consumió considerablemente menos recursos.

## Prevención

En esta máquina:

1. No utilizar `supabase start` con Docker como flujo predeterminado.
2. Utilizar runtime nativo.
3. Levantar únicamente los servicios requeridos.
4. Utilizar `--preparation on-demand`.
5. Detener servicios cuando termine una prueba.
6. No aumentar agresivamente la memoria de Docker si macOS ya está bajo presión.

## Regla derivada

El entorno local debe utilizar el mínimo conjunto de servicios necesario.

## Estado

Cerrado.
