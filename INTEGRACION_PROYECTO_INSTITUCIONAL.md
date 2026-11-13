# Integración de la solicitud de creación de ocupaciones

Este documento explica cómo llevar el prototipo React al proyecto institucional cuando esté disponible.

## 1. Archivos

Copiar la siguiente estructura dentro de `src/` del proyecto institucional:

```text
src/
├── components/
│   ├── SolicitudOcupacion.jsx      # Flujo completo de la solicitud
│   ├── SolicitudOcupacion.css      # Estilos del formulario (todos bajo .solicitud)
│   ├── pasosSolicitud.js           # Títulos de los 7 pasos
│   ├── DatosGenerales.jsx, PropuestaOcupacion.jsx, FuncionesDenominaciones.jsx,
│   │   Habilidades.jsx, Conocimientos.jsx, Justificacion.jsx, RevisionSolicitud.jsx
│   ├── CampoTexto.jsx, SelectorBuscable.jsx, ListaCasillas.jsx, TablaCatalogo.jsx,
│   │   ElementosManuales.jsx, FormularioManual.jsx, Tarjeta.jsx, TarjetaElemento.jsx,
│   │   ListaAdjuntos.jsx, EncabezadoPaso.jsx, ProgresoFormulario.jsx
│   ├── DialogoConfirmacion.jsx
│   └── ConfirmacionSolicitud.jsx
│
├── views/
│   ├── Inicio.jsx                  # Opcional si ya existe una página de inicio
│   └── FormularioOcupacion.jsx
│
├── data/
│   ├── instructivoInstrumento3.js  # Descripción de cada campo
│   └── instrumento3.models.js      # Catálogos de la CNO
│
├── services/
│   ├── catalogosCno.js
│   ├── fichaSolicitud.js
│   ├── formularioStorage.js
│   └── solicitudesService.js
│
├── App.jsx
├── App.css
└── index.css
```

## 2. Dependencias

El prototipo solo necesita, además de React:

```bash
npm install react-router-dom
```

En `index.html` se cargan Work Sans (400 y 600) y Material Icons Round desde Google Fonts.

No copiar las carpetas `node_modules/` ni `dist/`.

## 3. Integración del formulario

`views/FormularioOcupacion.jsx` muestra `components/SolicitudOcupacion.jsx`, que maneja los 7 pasos, el borrador, la validación y la radicación.

La radicación está en `services/solicitudesService.js` y se configura en `.env`:

| Variable | Uso |
| --- | --- |
| `VITE_MODO_SOLICITUDES` | `mock` simula el backend en el navegador; `api` envía al backend. |
| `VITE_API_URL` | URL del backend para el modo `api`. |
| `VITE_CORREO_CONTACTO` | Correo que se muestra en la confirmación. Si queda vacío, no se muestra. |

En modo `api` la solicitud se envía a `POST /api/public/solicitudes-ocupacion`. El backend asigna el radicado consecutivo y la fecha de registro.

Al integrarlo al proyecto real se debe:

1. Mantener los campos y sus reglas obligatorias.
2. Cambiar a modo `api` y apuntar `VITE_API_URL` al backend institucional.
3. Enviar los archivos adjuntos al backend: hoy solo se registran su nombre, tamaño y tipo.
4. No duplicar el formulario si ya existe una implementación institucional equivalente.

## 4. Rutas

El prototipo utiliza estas rutas:

```text
/             Inicio público
/formulario   Solicitud de nueva ocupación
```

Cualquier otra ruta redirige al inicio.

Si el proyecto institucional ya utiliza React Router, agregar únicamente la ruta del formulario:

```jsx
<Route path="/formulario" element={<FormularioOcupacion />} />
```

No crear un segundo `BrowserRouter` si el proyecto institucional ya tiene uno.

## 5. Cambios en `App.jsx` y `main.jsx`

Si el proyecto institucional ya tiene un `App.jsx`, no reemplazarlo completo. Integrar solamente:

- La importación de `FormularioOcupacion`.
- La ruta `/formulario`.
- El enlace "Solicitar creación" en el menú público.

Si ya existe un `BrowserRouter` en `main.jsx`, reutilizarlo. Solo debe existir un router principal.

## 6. Estilos

Los estilos usan solo la paleta de la guía de marca:

- Marca: `#7DB728` (botones), `#1FACE3` (uso opcional), `#F1F1F1` (fondo) y `#001631` (textos).
- Neutrales: `#F1F1F1`, `#D4D4D4`, `#8F8F8F`, `#525252` y `#303030`.
- Estados: aprobación `#349A00` / `#EBF6E6`, rechazo `#E81C1C` / `#FFE9E9` y advertencia `#FDC300` / `#FFF9E6`.

`SolicitudOcupacion.css` tiene todas sus reglas bajo `.solicitud`, así que no afecta otras pantallas. De `App.css` e `index.css` copiar solo lo necesario, revisando primero si el proyecto institucional tiene un sistema visual propio:

- Priorizar sus variables y componentes.
- Evitar sobrescribir nombres genéricos como `.boton`, `.campo` o `h1`.
- Mantener la adaptación responsive.

## 7. Qué no se debe copiar

No copiar:

- `node_modules/`.
- `dist/`.
- El `package.json` completo si el proyecto institucional ya tiene uno.
- `vite.config.js` si usa otra configuración.
- `eslint.config.js` sin revisar compatibilidad.
- El modo `mock` de `solicitudesService.js` como persistencia definitiva.

## 8. Orden recomendado de integración

1. Revisar framework, versión de React y router del proyecto institucional.
2. Copiar los componentes, vistas, datos y servicios del formulario.
3. Integrar la ruta `/formulario` y el enlace del menú.
4. Configurar el modo `api` contra el backend institucional.
5. Implementar el envío de los archivos adjuntos.
6. Ejecutar pruebas responsive y de accesibilidad.

## 9. Verificación final

Antes de publicar la integración, comprobar:

- Los campos obligatorios no permiten avanzar vacíos.
- El borrador se recupera al recargar la página y se borra al cancelar la solicitud.
- La revisión muestra los obligatorios que falten antes de enviar.
- Al enviar, el backend devuelve el número de radicado y la pantalla de confirmación lo muestra.
- Los datos de prueba del modo `mock` no se mezclan con datos institucionales.
