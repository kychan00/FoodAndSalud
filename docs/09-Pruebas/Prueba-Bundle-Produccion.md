---
tipo: prueba
estado: aprobada
fecha: 2026-10-06
fase: "3.3"
---

# Prueba — Bundle de Producción

## Objetivo

Comprobar que FoodAndSalud no cargue todo el código de la aplicación durante el
arranque inicial.

## Referencia previa

Antes de introducir lazy loading, el principal archivo JavaScript alcanzó
aproximadamente:

`1080.52 kB`

sin comprimir.

## Resultado Fase 3.3

Entrada JavaScript principal:

`280.26 kB`

Reducción aproximada frente a la referencia:

`74.1%`

## Criterio inicial

El archivo JavaScript cargado directamente desde `index.html` debe permanecer
por debajo de:

`500 kB`

Resultado:

APROBADO.

## Chunks producidos

- `FoodDetailPage-E3Eaf7td.js` — 389.70 kB
- `index-_UQbhyi8.js` — 280.26 kB
- `client-CRtBsRF2.js` — 218.11 kB
- `InputField-DYoDaKfR.js` — 109.96 kB
- `TodayPage-BrDYHKFn.js` — 19.50 kB
- `PatternsPage-DzjUHOoX.js` — 9.47 kB
- `Card-ClYXXJxJ.js` — 8.74 kB
- `CalendarPage-B3dOH4XF.js` — 3.55 kB
- `SignUpPage-C26N14Ix.js` — 2.34 kB
- `association.engine-D0mbGdPb.js` — 2.11 kB
- `LoginPage-BaLIxwYE.js` — 1.87 kB
- `CheckEmailPage-T8K2ehHj.js` — 1.83 kB
- `timeline.service-BsQMv-mF.js` — 1.78 kB
- `ResetPasswordPage-DqMcvCjg.js` — 1.78 kB
- `ForgotPasswordPage-Dey4kqSc.js` — 1.40 kB
- `TimelineList-CKtk3ef-.js` — 1.35 kB
- `AuthLayout-CZSh42IV.js` — 0.58 kB
- `Button-P3PTn8lk.js` — 0.28 kB

## QA

También se comprobó que los assets de producción no contienen:

- `Laboratorio de Patrones`
- `Café solo vs Café + Leche`

Esto proporciona una comprobación adicional de que fixtures y pantallas QA no
forman parte del build de producción.

## Estrategia

Las páginas utilizan:

- `React.lazy`
- `Suspense`
- `import()`

## Interpretación

Un chunk secundario puede ser relativamente grande sin afectar el arranque
inicial si sólo se descarga al entrar a esa funcionalidad.

La métrica principal de esta fase es el JavaScript requerido directamente por
la entrada de la aplicación.

## Regresión

Si el bundle inicial vuelve a superar 500 kB deberá revisarse qué dependencia
fue incorporada nuevamente de forma estática.
