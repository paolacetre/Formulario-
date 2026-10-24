# Integración de los dos formularios al proyecto real

Este documento resume únicamente lo que corresponde a los dos formularios del proyecto y qué carpetas/archivos deben copiarse al proyecto institucional real.

## 1) Formulario principal: creación de nueva ocupación

### Ruta principal
- `src/views/FormularioOcupacion.jsx`

### Archivo base del formulario
- `src/components/SolicitudOcupacion.jsx`

### Componentes asociados que se deben copiar si se usa este flujo completo
- `src/components/DatosGenerales.jsx`
- `src/components/PropuestaOcupacion.jsx`
- `src/components/FuncionesDenominaciones.jsx` (tarjetas de funciones, denominaciones y ocupaciones relacionadas)
- `src/components/ListaCatalogo.jsx` (lista desplegable con buscador del catálogo CNO + creación manual + listado de tarjetas)
- `src/components/TarjetaElemento.jsx` (tarjeta de cada elemento agregado: código, nombre, descripción y ocupación asociada)
- `src/components/FormularioManual.jsx` (formulario en línea para crear elementos que no están en el catálogo)
- `src/components/ElementosManuales.jsx` (opción "Agregar otra habilidad/otro conocimiento" debajo de las tablas)
- `src/components/Tarjeta.jsx` (tarjeta reutilizable que agrupa los campos de cada paso)
- `src/components/SelectorBuscable.jsx` (lista desplegable con buscador interno, usada para nivel, área y los catálogos de la CNO)
- `src/components/TablaCatalogo.jsx` (tabla seleccionable usada por Habilidades y Conocimientos)
- `src/components/Habilidades.jsx`
- `src/components/Conocimientos.jsx`
- `src/components/Justificacion.jsx`
- `src/components/RevisionSolicitud.jsx`
- `src/components/ListaAdjuntos.jsx` (lista de archivos con botón "Ver", usada en justificación, revisión y confirmación)
- `src/components/ConfirmacionSolicitud.jsx` (pantalla final con número de radicado y resumen)
- `src/components/SolicitudOcupacion.css` (estilos de la solicitud con el sistema visual del proyecto Clasificación de Ocupaciones: Work Sans 400/600, radio 16px, colores de marca y estados)
- `src/components/EncabezadoPaso.jsx` y `src/components/pasosSolicitud.js` (título "Paso N de 7" de cada paso y nombres del indicador de progreso)
- `src/components/ProgresoFormulario.jsx`

### Datos y soporte del flujo
- `src/services/formularioStorage.js`
- `src/services/fichaSolicitud.js` (radicado y secciones del resumen de revisión)
- `src/data/instrumento3.models.js` (área de desempeño, nivel de cualificación, habilidades y conocimientos de la CNO 2026)
- `src/services/catalogosCno.js` (carga diferida y búsqueda de las listas de la CNO)
- `src/data/cno/funciones.json`, `denominaciones.json` y `ocupaciones.json` (registros activos de la CNO 2026)

### Qué hace este formulario
- Registra datos generales del solicitante.
- Solicita la propuesta de una nueva ocupación.
- Tiene 7 pasos por sesión organizados en tarjetas: datos generales; propuesta (nombre, descripción, nivel de cualificación y después área de desempeño, ambos con su descripción); funciones/denominaciones/ocupaciones relacionadas; habilidades; conocimientos; justificación con documentos adjuntos y revisión final.
- Funciones, denominaciones y ocupaciones relacionadas tienen cada una su tarjeta con una lista desplegable con buscador (código, nombre y descripción u ocupación asociada). Al elegir una opción se agrega al listado como tarjeta; cada sección permite crear elementos manualmente. Se guardan como `{ codigo, nombre, descripcion, ocupacion, manual }`.
- Habilidades (41) y conocimientos (78) se seleccionan desde una tabla con código, nombre y descripción (`HABILIDADES_CATALOGO` y `CONOCIMIENTOS_CATALOGO`) y se guardan por código. Debajo de cada tabla se pueden agregar otras (`habilidadesManuales`, `conocimientosManuales`).
- Guarda borrador en `localStorage`.
- Actualmente usa `console.log` al enviar la solicitud; en el proyecto real se debe reemplazar por un endpoint institucional.

### Elementos que sí deben integrarse
- La vista `FormularioOcupacion`.
- El componente `SolicitudOcupacion` y sus subcomponentes.
- La lógica de validación por pasos.
- La lógica de almacenamiento local para borradores si aún se usa como prototipo.

### Elementos que deben cambiarse en producción
- `guardarBorrador` / `obtenerBorrador` debe reemplazarse por backend o servicio real.
- `console.log` del envío final debe ir a un servicio API, que también debe recibir los archivos adjuntos.
- El número de radicado (`generarRadicado`) se genera en el navegador solo para el prototipo; en producción debe asignarlo el backend.
- Los valores de departamentos, municipios y sectores deben conectarse con datos reales.
- Los datos de `src/data/cno/` y de `instrumento3.models.js` se generaron desde `CNO_2026_10-09Actualizado (2).xlsx` (igual a `back/database/siembra/cno.xlsx`). Como ese libro corta textos en 255 caracteres, las descripciones de las áreas se tomaron completas del `Instrumento 3` (hoja Codecs) y las de algunas habilidades, conocimientos y la habilidad 19 y 30 de `2CNO_2024_(2025-06-13).xlsx`. En producción deben consultarse en la API del backend (`cno_funcion`, `cno_denominacion`, `cno_ocupacion`, `habilidad_destreza`, `cno_conocimiento`, `cno_area_desempeno`, `cno_nivel_cualificacion`).

---

## 2) Formulario alterno: ajuste o inclusión de nueva ocupación

### Ruta principal
- `src/views/FormularioAlterno.jsx`

### Datos de apoyo
- `src/data/ocupacionesMock.js`

### Qué hace este formulario
- Solicita información del solicitante.
- Permite elegir tipo de solicitud: `Ajuste` o `Inclusión de nueva ocupación`.
- Si es ajuste, permite buscar la ocupación base por código o por término en dos buscadores: uno para CNO y otro para CUOC (usa `buscarOcupaciones` del catálogo activo).
- Genera secciones dinámicas para evaluar aspectos como ocupación, descripción, denominaciones, conocimientos, destrezas, nivel y equivalencias.
- Tiene validación obligatoria antes de guardar la solicitud.
- Permite anexar archivo, observaciones y seguimiento de la solicitud.

### Qué se debe copiar
- La vista `FormularioAlterno` completa.
- La estructura de datos inicial del formulario.
- Los componentes internos definidos dentro del mismo archivo: `Campo`, `Check`, `Seccion`, `BuscadorOcupacion`.
- El servicio `src/services/ocupacionesService.js` (búsqueda CNO/CUOC).
- La data mock de ocupaciones para pruebas en entorno local: `ocupacionesMock.js`.

### Qué debe cambiarse en producción
- Reemplazar `ocupacionesMock.js` por un servicio o API real.
- Reemplazar la validación local por reglas institucionales reales.
- Reemplazar la acción de guardar por el endpoint final.
- Sustituir la referencia a PDFs locales (`/referencias/...pdf`) por archivos reales o una fuente institucional.

---

## 3) Carpetas a copiar al proyecto real

### Mínimo recomendado para los formularios
```text
src/
├── components/
│   ├── SolicitudOcupacion.jsx
│   ├── DatosGenerales.jsx
│   ├── PropuestaOcupacion.jsx
│   ├── FuncionesDenominaciones.jsx
│   ├── Tarjeta.jsx
│   ├── ListaCatalogo.jsx
│   ├── TarjetaElemento.jsx
│   ├── FormularioManual.jsx
│   ├── ElementosManuales.jsx
│   ├── SelectorBuscable.jsx
│   ├── TablaCatalogo.jsx
│   ├── Habilidades.jsx
│   ├── Conocimientos.jsx
│   ├── Justificacion.jsx
│   ├── RevisionSolicitud.jsx
│   ├── ListaAdjuntos.jsx
│   ├── ConfirmacionSolicitud.jsx
│   ├── ProgresoFormulario.jsx
│   └── FormularioAlterno.jsx   # si se decide moverlo igual dentro de components, pero en este proyecto vive en views
├── views/
│   ├── FormularioOcupacion.jsx
│   └── FormularioAlterno.jsx
├── services/
│   ├── formularioStorage.js
│   ├── fichaSolicitud.js
│   ├── catalogosCno.js
│   └── ocupacionesService.js   # solo si se integra búsqueda/consulta de ocupaciones
├── data/
│   ├── instrumento3.models.js
│   ├── cno/                   # funciones.json, denominaciones.json, ocupaciones.json
│   └── ocupacionesMock.js
└── App.jsx
```

### Importante
No se debe copiar todo el proyecto completo. Solo es necesario llevar la parte funcional de ambos flujos y luego conectarla con el backend institucional.

---

## 4) Archivos de navegación y estilos que normalmente se integran

### Rutas principales
- `src/App.jsx`

Esto incluye:
- Importación de `FormularioOcupacion`.
- Importación de `FormularioAlterno`.
- Rutas:
  - `/formulario`
  - `/formulario-alterno`

### Estilos generales
- `src/App.css`
- `src/index.css`

Estos estilos son necesarios si el proyecto institucional no tiene un sistema visual ya definido. Si sí existe uno, se recomienda reutilizarlo y no sobreescribir todo.

---

## 5) Qué no copiar como está en producción

- `src/data/ocupacionesMock.js` como fuente oficial de datos.
- `localStorage` como persistencia definitiva.
- `console.log` como envío real.
- PDFs locales con rutas relativas `/referencias/...` si no existen dentro del proyecto final.
- El prototipo completo sin revisión de compatibilidad con el proyecto institucional.

---

## 6) Recomendación de integración real

1. Copiar solo la estructura del formulario y sus componentes.
2. Conectar cada formulario a un servicio real del backend.
3. Reemplazar `localStorage` por persistencia institucional.
4. Sustituir `ocupacionesMock.js` por una API o datos reales.
5. Mantener la lógica de validación pero alinearla con el negocio real.
6. Revisar que los nombres y rutas no colisionen con el proyecto principal.

---

## 7) Resumen práctico

Si la intención es llevar estos formularios al proyecto real, lo más importante es copiar:

- `src/views/FormularioOcupacion.jsx`
- `src/components/SolicitudOcupacion.jsx`
- todos los componentes de la carpeta `src/components` que usa `SolicitudOcupacion`
- `src/services/formularioStorage.js`
- `src/services/fichaSolicitud.js` (radicado y secciones del resumen de revisión)
- `src/views/FormularioAlterno.jsx`
- `src/data/ocupacionesMock.js` solo como dato de prueba local
- `src/App.jsx` para las rutas
- `src/App.css` y `src/index.css` solo si hace falta estilo

Con esto ya queda la base funcional para integrarlos correctamente al proyecto real, con la aclaración de que la parte de persistencia y envío debe conectarse al backend institucional.
