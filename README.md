# Formulario de ocupaciones

Aplicacion web construida con React y Vite para solicitar la creacion de una nueva ocupacion en la Clasificacion Nacional de Ocupaciones (CNO).

## Que hace el proyecto

El sistema permite:

- Diligenciar en 7 pasos una solicitud para crear una nueva ocupacion: datos generales, propuesta, funciones y relaciones, habilidades, conocimientos, justificacion y revision.
- Guardar el avance automaticamente en el navegador y retomarlo despues.
- Adjuntar documentos de soporte.
- Revisar la solicitud completa antes de enviarla.
- Radicar la solicitud y obtener un numero de radicado consecutivo.

## Tecnologias

- React 19
- React DOM 19
- React Router DOM 7
- Vite 8
- JavaScript (JSX)
- ESLint
- Work Sans como tipografia principal y Material Icons Round para los iconos

## Requisitos

- Node.js instalado.
- npm instalado.

Se recomienda utilizar una version reciente de Node.js compatible con Vite 8.

## Instalacion

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/paolacetre/Formulario-.git
   ```

2. Entrar en la carpeta del proyecto:

   ```bash
   cd Formulario-
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

## Ejecutar en desarrollo

```bash
npm run dev
```

Vite mostrara en la terminal la URL local, normalmente `http://localhost:5173`. Si el puerto esta ocupado, Vite utilizara otro puerto disponible.

## Comandos disponibles

```bash
# Servidor de desarrollo
npm run dev

# Validar el codigo
npm run lint

# Crear el build de produccion en dist/
npm run build

# Previsualizar el build
npm run preview
```

## Rutas de la aplicacion

| Ruta | Descripcion |
| --- | --- |
| `/` | Pagina de inicio con el acceso a la solicitud. |
| `/formulario` | Solicitud de creacion de una nueva ocupacion. |

Cualquier otra ruta redirige al inicio.

## Estructura principal

```text
Formulario-/
├── public/
├── src/
│   ├── components/
│   │   ├── SolicitudOcupacion.jsx    # Flujo completo de la solicitud
│   │   ├── SolicitudOcupacion.css    # Estilos del formulario
│   │   ├── DatosGenerales.jsx … RevisionSolicitud.jsx   # Un componente por paso
│   │   ├── CampoTexto.jsx            # Campo con validacion en linea
│   │   ├── SelectorBuscable.jsx      # Lista desplegable con buscador
│   │   ├── DialogoConfirmacion.jsx   # Confirmacion de acciones que no se pueden deshacer
│   │   └── ConfirmacionSolicitud.jsx # Pantalla con el numero de radicado
│   ├── data/
│   │   ├── instructivoInstrumento3.js
│   │   └── instrumento3.models.js
│   ├── services/
│   │   ├── catalogosCno.js
│   │   ├── fichaSolicitud.js
│   │   ├── formularioStorage.js
│   │   └── solicitudesService.js
│   ├── views/
│   │   ├── FormularioOcupacion.jsx
│   │   └── Inicio.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Organizacion de la interfaz

- `App.jsx` define la navegacion principal y las rutas.
- `views/` contiene las pantallas de la aplicacion.
- `components/` contiene los pasos de la solicitud y sus piezas reutilizables.
- `services/solicitudesService.js` radica la solicitud (modo `mock` en el navegador o modo `api` contra el backend).
- `services/formularioStorage.js` guarda y recupera el borrador de la solicitud.
- `data/` contiene los catalogos de la CNO y las descripciones del instructivo del Instrumento 3.
- `App.css`, `index.css` y `SolicitudOcupacion.css` contienen los estilos con la paleta de la guia de marca.

## Accesibilidad y semantica

El proyecto utiliza HTML semantico y controles accesibles, entre ellos:

- `header`, `nav`, `main` y `section` cuando corresponde.
- Formularios con `form`, `fieldset`, `legend`, `label`, `input`, `textarea` y `button`.
- Labels asociados a sus campos mediante `htmlFor` e `id`.
- Campos obligatorios con `required` y errores en linea asociados con `aria-invalid` y `aria-describedby`.
- Tablas semanticas para los catalogos de habilidades y conocimientos.
- Dialogo de confirmacion con `<dialog>` y foco en la opcion segura.
- Anuncio del paso actual al cambiar de paso y respeto a la preferencia de reducir movimiento.
- Diseno responsive para pantallas moviles, tabletas y escritorio.

## Borrador y radicacion

El avance de la solicitud se guarda en el `localStorage` del navegador con la clave `formularioOcupacion-v2`. Los archivos adjuntos no se guardan en el borrador. Al cancelar la solicitud, el borrador se elimina.

El modo de radicacion se configura en `.env` con `VITE_MODO_SOLICITUDES`:

- `mock`: simula el backend en el navegador y guarda las solicitudes en `localStorage` con la clave `clasificacion-solicitudes-ocupacion`.
- `api`: envia la solicitud a `POST /api/public/solicitudes-ocupacion` en la URL indicada por `VITE_API_URL` y espera `{ radicado, fechaRegistro }`. Si el backend no responde en 30 segundos o responde sin radicado, se muestra un aviso y los datos siguen en el formulario.

En desarrollo, `.env.development` deja `VITE_API_URL` vacio y Vite reenvia `/api` al backend indicado en `API_PROXY_DESTINO` (por defecto `http://localhost:3000`), asi no hace falta configurar CORS. En produccion, Nginx cumple ese papel.

## Integracion futura

Para llevar el proyecto a un entorno institucional se recomienda:

- Usar el modo `api` contra el backend institucional.
- Enviar los archivos adjuntos al backend (hoy solo se registran sus nombres).
- Mantener las interfaces publicas de los componentes y servicios para reducir el impacto de la integracion.

## Estado del proyecto

El proyecto esta preparado como prototipo funcional frontend. Incluye la solicitud de creacion de ocupaciones paso a paso, guardado automatico, validaciones, radicacion, estilos institucionales y estructura semantica accesible.
