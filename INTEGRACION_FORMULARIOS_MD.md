# Integración del formulario de solicitud al proyecto real

Este documento resume únicamente lo que corresponde al formulario de solicitud de creación de ocupación (Instrumento 3) y qué carpetas/archivos deben copiarse al proyecto institucional real.

## 1) Formulario principal: creación de nueva ocupación

### Ruta principal
- `src/views/FormularioOcupacion.jsx`

### Archivo base del formulario
- `src/components/SolicitudOcupacion.jsx`

### Componentes asociados que se deben copiar si se usa este flujo completo
- `src/components/DatosGenerales.jsx`
- `src/components/PropuestaOcupacion.jsx`
- `src/components/FuncionesDenominaciones.jsx` (tarjetas de funciones, denominaciones y ocupaciones relacionadas)
- `src/components/ListaCasillas.jsx` (casillas para escribir un elemento por casilla, con "+ Agregar", papelera y aviso de repetidos)
- `src/data/instructivoInstrumento3.js` (descripción de cada campo, tomada del Instrumento 3)
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
- `src/services/fichaSolicitud.js` (etiquetas y secciones del resumen de revisión)
- `src/services/solicitudesService.js` (envío al backend, fecha de envío y correo de contacto)
- `.env` y `.env.development` (correo de contacto `VITE_CORREO_CONTACTO`, modo de radicación `VITE_MODO_SOLICITUDES` y URL del backend `VITE_API_URL`)
- `src/data/instrumento3.models.js` (área de desempeño, nivel de cualificación, habilidades y conocimientos de la CNO 2026)
- `src/services/catalogosCno.js` (normalización de texto y opciones de nivel y área)

### Qué hace este formulario
- Registra datos generales del solicitante.
- Solicita la propuesta de una nueva ocupación.
- Tiene 7 pasos por sesión organizados en tarjetas: datos generales; propuesta (nombre, descripción, nivel de cualificación y después área de desempeño, ambos con su descripción); funciones/denominaciones/ocupaciones relacionadas; habilidades; conocimientos; justificación con documentos adjuntos y revisión final.
- Funciones, denominaciones y ocupaciones relacionadas se escriben en casillas, una por elemento, como pide el Instrumento 3 ("Escriba una función por cada casilla"). Las ocupaciones relacionadas llevan código y nombre ("Cod Ocupación - Nombre Ocupación"). Se guardan como textos (funciones, denominaciones) y `{ codigo, nombre }` (ocupaciones); al enviar se descartan las casillas vacías.
- Cada campo muestra debajo de su etiqueta la descripción del Instrumento 3 (`instructivoInstrumento3.js`).
- Habilidades (41) y conocimientos (78) se seleccionan desde una tabla con código, nombre y descripción (`HABILIDADES_CATALOGO` y `CONOCIMIENTOS_CATALOGO`) y se guardan por código. Debajo de cada tabla se pueden agregar otras (`habilidadesManuales`, `conocimientosManuales`).
- Guarda borrador en `localStorage`.
- Radicación con `VITE_MODO_SOLICITUDES`: `mock` (actual, sin base de datos) la simula en el navegador con el mismo contrato y la guarda en `localStorage` (`clasificacion-solicitudes-ocupacion`, con `estado: "RADICADA"` y `rolDestino: "ANALISTA"`); `api` la envía al backend.
- En modo `api`, al enviar radica la solicitud en el backend del proyecto Clasificación de Ocupaciones (`POST /api/public/solicitudes-ocupacion`, público, con `tipo: "wizard"`). El backend devuelve el radicado consecutivo `SOL-AAAA-000123` (secuencia del id de `clasificacion.solicitud_ocupacion`) y la fecha de registro, que se muestran en la confirmación junto con el mensaje "Para más información, comuníquese al correo …" (`VITE_CORREO_CONTACTO`; vacío = no se muestra).
- La solicitud queda disponible para los roles ANALISTA y ADMINISTRADOR (`GET /api/solicitudes-ocupacion`). Falta la pantalla del analista que la consulte en el frontend institucional.
- Si el backend falla o limita los envíos (429), muestra el aviso y conserva los datos para reintentar.

### Elementos que sí deben integrarse
- La vista `FormularioOcupacion`.
- El componente `SolicitudOcupacion` y sus subcomponentes.
- La lógica de validación por pasos.
- La lógica de almacenamiento local para borradores si aún se usa como prototipo.

### Elementos que deben cambiarse en producción
- `guardarBorrador` / `obtenerBorrador` debe reemplazarse por backend o servicio real.
- El servicio de solicitudes solo recibe datos: de los archivos adjuntos se envían el nombre, el tamaño y el tipo. Para guardar los archivos el backend necesita un endpoint de carga.
- Los valores de departamentos, municipios y sectores deben conectarse con datos reales.
- Los datos de `instrumento3.models.js` se generaron desde `CNO_2026_10-09Actualizado (2).xlsx` (igual a `back/database/siembra/cno.xlsx`). Como ese libro corta textos en 255 caracteres, las descripciones de las áreas se tomaron completas del `Instrumento 3` (hoja Codecs) y las de algunas habilidades, conocimientos y la habilidad 19 y 30 de `2CNO_2024_(2025-06-13).xlsx`. En producción deben consultarse en la API del backend (`habilidad_destreza`, `cno_conocimiento`, `cno_area_desempeno`, `cno_nivel_cualificacion`).

---

## 2) Carpetas a copiar al proyecto real

### Mínimo recomendado para el formulario
```text
src/
├── components/
│   ├── SolicitudOcupacion.jsx
│   ├── SolicitudOcupacion.css
│   ├── pasosSolicitud.js
│   ├── ProgresoFormulario.jsx
│   ├── EncabezadoPaso.jsx
│   ├── Tarjeta.jsx
│   ├── DatosGenerales.jsx
│   ├── PropuestaOcupacion.jsx
│   ├── SelectorBuscable.jsx
│   ├── FuncionesDenominaciones.jsx
│   ├── ListaCasillas.jsx
│   ├── Habilidades.jsx
│   ├── Conocimientos.jsx
│   ├── TablaCatalogo.jsx
│   ├── ElementosManuales.jsx
│   ├── FormularioManual.jsx
│   ├── TarjetaElemento.jsx
│   ├── Justificacion.jsx
│   ├── ListaAdjuntos.jsx
│   ├── RevisionSolicitud.jsx
│   └── ConfirmacionSolicitud.jsx
├── views/
│   └── FormularioOcupacion.jsx
├── services/
│   ├── formularioStorage.js
│   ├── fichaSolicitud.js
│   ├── solicitudesService.js
│   └── catalogosCno.js
├── data/
│   ├── instrumento3.models.js
│   └── instructivoInstrumento3.js
└── App.jsx
```

### Importante
No se debe copiar todo el proyecto completo. Solo es necesario llevar la parte funcional del formulario y luego conectarla con el backend institucional.

---

## 3) Archivos de navegación y estilos que normalmente se integran

### Rutas principales
- `src/App.jsx`

Esto incluye:
- Importación de `FormularioOcupacion`.
- Rutas:
  - `/formulario`

### Estilos generales
- `src/App.css`
- `src/index.css`

Estos estilos son necesarios si el proyecto institucional no tiene un sistema visual ya definido. Si sí existe uno, se recomienda reutilizarlo y no sobreescribir todo.

---

## 4) Qué no copiar como está en producción

- `src/data/ocupacionesMock.js` como fuente oficial de datos.
- `localStorage` como persistencia definitiva.
- `console.log` como envío real.
- PDFs locales con rutas relativas `/referencias/...` si no existen dentro del proyecto final.
- El prototipo completo sin revisión de compatibilidad con el proyecto institucional.

---

## 5) Recomendación de integración real

1. Copiar solo la estructura del formulario y sus componentes.
2. Conectar el formulario al servicio real del backend (`VITE_MODO_SOLICITUDES=api`).
3. Reemplazar `localStorage` por persistencia institucional.
4. Sustituir `ocupacionesMock.js` por una API o datos reales.
5. Mantener la lógica de validación pero alinearla con el negocio real.
6. Revisar que los nombres y rutas no colisionen con el proyecto principal.

---

## 6) Resumen práctico

Si la intención es llevar este formulario al proyecto real, lo más importante es copiar:

- `src/views/FormularioOcupacion.jsx`
- `src/components/SolicitudOcupacion.jsx`
- todos los componentes de la carpeta `src/components` que usa `SolicitudOcupacion`
- `src/services/formularioStorage.js`
- `src/services/fichaSolicitud.js` (etiquetas y secciones del resumen de revisión)
- `src/services/solicitudesService.js` (envío al backend, fecha de envío y correo de contacto)
- `.env` y `.env.development` (correo de contacto `VITE_CORREO_CONTACTO`, modo de radicación `VITE_MODO_SOLICITUDES` y URL del backend `VITE_API_URL`)
- `src/data/instrumento3.models.js` y `src/data/instructivoInstrumento3.js`
- `src/App.jsx` para las rutas
- `src/App.css` y `src/index.css` solo si hace falta estilo

Con esto ya queda la base funcional para integrarlos correctamente al proyecto real, con la aclaración de que la parte de persistencia y envío debe conectarse al backend institucional.
