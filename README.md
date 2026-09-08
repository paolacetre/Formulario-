# Formulario de ocupaciones

Aplicacion web construida con React y Vite para consultar, solicitar y administrar informacion de ocupaciones laborales.

## Que hace el proyecto

El sistema permite:

- Consultar ocupaciones por nombre o codigo.
- Ver el detalle de una ocupacion en secciones de informacion general, funciones, habilidades, conocimientos, denominaciones y relaciones.
- Diligenciar una solicitud para crear una nueva ocupacion.
- Diligenciar un formulario alterno para ajustes o inclusion de ocupaciones.
- Cargar archivos Excel de ocupaciones desde el area administrativa.
- Validar y publicar un catalogo de ocupaciones.
- Consultar el historial de versiones del catalogo.

La aplicacion usa datos de prueba incluidos en el proyecto. El catalogo activo y las versiones publicadas se almacenan en `localStorage` del navegador.

## Tecnologias

- React 19
- React DOM 19
- React Router DOM 7
- Vite 8
- JavaScript (JSX)
- XLSX para leer archivos `.xlsx` y `.xls`
- ESLint
- Work Sans como tipografia principal

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
   cd Formulario-/formulario-ocupacion
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
| `/` | Pagina de inicio y accesos principales. |
| `/buscar` | Buscador y consulta publica de ocupaciones. |
| `/formulario` | Solicitud de creacion de una nueva ocupacion. |
| `/formulario-alterno` | Formulario alterno para ajustes o inclusion de ocupaciones. |
| `/admin` | Carga, validacion y publicacion del catalogo Excel. |

## Estructura principal

```text
formulario-ocupacion/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── DetalleOcupacion.jsx
│   │   ├── ResultadosOcupacion.jsx
│   │   ├── SolicitudOcupacion.jsx
│   │   └── TabsOcupacion.jsx
│   ├── data/
│   │   ├── instrumento3.models.js
│   │   └── ocupacionesMock.js
│   ├── services/
│   │   ├── excelService.js
│   │   └── ocupacionesService.js
│   ├── views/
│   │   ├── AdminOcupaciones.jsx
│   │   ├── BuscarOcupacion.jsx
│   │   ├── FormularioAlterno.jsx
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
- `components/` contiene piezas reutilizables como resultados, detalle, tabs y formulario.
- `services/ocupacionesService.js` consulta, filtra, guarda y publica el catalogo.
- `services/excelService.js` procesa los archivos Excel cargados desde administracion.
- `data/` contiene los datos mock y catalogos usados durante el desarrollo.
- `App.css` e `index.css` contienen los estilos y tokens visuales institucionales.

## Accesibilidad y semantica

El proyecto utiliza HTML semantico y controles accesibles, entre ellos:

- `header`, `nav`, `main`, `section`, `article`, `aside` y `footer` cuando corresponde.
- Formularios con `form`, `fieldset`, `legend`, `label`, `input`, `textarea`, `select` y `button`.
- Labels asociados a sus campos mediante `htmlFor` e `id`.
- Campos obligatorios con `required`.
- Tabla semantica para los resultados del buscador.
- Listas `ul` y `li` para conjuntos de informacion.
- Pestanas con estados ARIA y navegacion por teclado.
- Mensajes de error y confirmacion con roles accesibles.
- Diseno responsive para pantallas moviles, tabletas y escritorio.

## Catalogo y almacenamiento local

Durante el desarrollo, el catalogo se carga desde `ocupacionesMock.js`. Cuando se publica un archivo Excel, la informacion se guarda en el almacenamiento local del navegador con estas claves:

- `catalogo-ocupaciones-activo`
- `catalogo-ocupaciones-versiones`

Para reiniciar los datos de prueba, se deben eliminar esas claves desde las herramientas de almacenamiento del navegador.

## Flujo administrativo

1. Seleccionar un archivo Excel con extension `.xlsx` o `.xls`.
2. Validar la extension y el contenido del archivo.
3. Revisar el resumen de registros encontrados, validos y con errores.
4. Confirmar la publicacion del catalogo.
5. Consultar el estado de la version en el historial.

Este prototipo no incluye autenticacion ni backend. En una integracion institucional, la vista administrativa debe protegerse mediante el sistema real de autenticacion y autorizacion.

## Integracion futura

Para llevar el proyecto a un entorno institucional se recomienda:

- Reemplazar los datos mock por una API o servicio institucional.
- Reemplazar `localStorage` por persistencia en backend.
- Proteger la ruta administrativa.
- Sustituir el `console.log` del formulario de solicitud por un endpoint real.
- Mantener las interfaces publicas de los componentes y servicios para reducir el impacto de la integracion.

## Estado del proyecto

El proyecto esta preparado como prototipo funcional frontend. Incluye navegacion, formularios, consulta de ocupaciones, detalle, carga de Excel, validaciones basicas, estilos institucionales y estructura semantica accesible.
