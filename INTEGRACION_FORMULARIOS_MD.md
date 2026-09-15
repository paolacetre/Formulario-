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
- `src/components/FuncionesPrincipales.jsx`
- `src/components/DenominacionesOcupacionales.jsx`
- `src/components/OcupacionesRelacionadas.jsx`
- `src/components/Habilidades.jsx`
- `src/components/Conocimientos.jsx`
- `src/components/Justificacion.jsx`
- `src/components/RevisionSolicitud.jsx`
- `src/components/ProgresoFormulario.jsx`

### Datos y soporte del flujo
- `src/services/formularioStorage.js`
- `src/data/instrumento3.models.js`

### Qué hace este formulario
- Registra datos generales del solicitante.
- Solicita la propuesta de una nueva ocupación.
- Tiene pasos por sesión: información general, propuesta, funciones, denominaciones, relaciones, habilidades, conocimientos, justificación y revisión final.
- Guarda borrador en `localStorage`.
- Actualmente usa `console.log` al enviar la solicitud; en el proyecto real se debe reemplazar por un endpoint institucional.

### Elementos que sí deben integrarse
- La vista `FormularioOcupacion`.
- El componente `SolicitudOcupacion` y sus subcomponentes.
- La lógica de validación por pasos.
- La lógica de almacenamiento local para borradores si aún se usa como prototipo.

### Elementos que deben cambiarse en producción
- `guardarBorrador` / `obtenerBorrador` debe reemplazarse por backend o servicio real.
- `console.log` del envío final debe ir a un servicio API.
- Los valores de departamentos, municipios y sectores deben conectarse con datos reales.

---

## 2) Formulario alterno: ajuste o inclusión de nueva ocupación

### Ruta principal
- `src/views/FormularioAlterno.jsx`

### Datos de apoyo
- `src/data/ocupacionesMock.js`

### Qué hace este formulario
- Solicita información del solicitante.
- Permite elegir tipo de solicitud: `Ajuste` o `Inclusión de nueva ocupación`.
- Si es ajuste, permite seleccionar una ocupación base desde un catálogo.
- Genera secciones dinámicas para evaluar aspectos como ocupación, descripción, denominaciones, conocimientos, destrezas, nivel y equivalencias.
- Tiene validación obligatoria antes de guardar la solicitud.
- Permite anexar archivo, observaciones y seguimiento de la solicitud.

### Qué se debe copiar
- La vista `FormularioAlterno` completa.
- La estructura de datos inicial del formulario.
- Los componentes internos definidos dentro del mismo archivo: `Campo`, `Check`, `Seccion`.
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
│   ├── FuncionesPrincipales.jsx
│   ├── DenominacionesOcupacionales.jsx
│   ├── OcupacionesRelacionadas.jsx
│   ├── Habilidades.jsx
│   ├── Conocimientos.jsx
│   ├── Justificacion.jsx
│   ├── RevisionSolicitud.jsx
│   ├── ProgresoFormulario.jsx
│   └── FormularioAlterno.jsx   # si se decide moverlo igual dentro de components, pero en este proyecto vive en views
├── views/
│   ├── FormularioOcupacion.jsx
│   └── FormularioAlterno.jsx
├── services/
│   ├── formularioStorage.js
│   └── ocupacionesService.js   # solo si se integra búsqueda/consulta de ocupaciones
├── data/
│   ├── instrumento3.models.js
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
- `src/views/FormularioAlterno.jsx`
- `src/data/ocupacionesMock.js` solo como dato de prueba local
- `src/App.jsx` para las rutas
- `src/App.css` y `src/index.css` solo si hace falta estilo

Con esto ya queda la base funcional para integrarlos correctamente al proyecto real, con la aclaración de que la parte de persistencia y envío debe conectarse al backend institucional.
