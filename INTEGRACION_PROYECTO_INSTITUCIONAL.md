# Integración del sistema de ocupaciones

Este documento explica cómo llevar el prototipo React al proyecto institucional cuando esté disponible.


Copiar la siguiente estructura dentro de `src/` del proyecto institucional:

```text
src/
├── components/
│   ├── SolicitudOcupacion.jsx
│   ├── BuscadorOcupacion.jsx       # Si existe en el proyecto final
│   ├── ResultadosOcupacion.jsx
│   ├── DetalleOcupacion.jsx
│   └── TabsOcupacion.jsx
│
├── views/
│   ├── Inicio.jsx                  # Opcional si ya existe una página de inicio
│   ├── BuscarOcupacion.jsx
│   ├── FormularioOcupacion.jsx
│   └── AdminOcupaciones.jsx
│
├── data/
│   └── ocupacionesMock.js          # Solo para desarrollo local
│
├── services/
│   ├── ocupacionesService.js
│   └── excelService.js
│
├── App.jsx
├── App.css
└── index.css
```

El componente existente `SolicitudOcupacion.jsx` debe conservarse. En este prototipo se reutiliza desde `FormularioOcupacion.jsx`.

## 2. Dependencias

El prototipo utiliza:

```bash
npm install react-router-dom xlsx
```

No copiar las carpetas `node_modules/` ni `dist/`.

La dependencia `xlsx` se usa únicamente para leer temporalmente el archivo Excel en el navegador. Antes de producción se recomienda evaluar una alternativa segura o mover el procesamiento al backend.

## 3. Integración del buscador

El buscador está compuesto por:

- `views/BuscarOcupacion.jsx`: página pública.
- `components/ResultadosOcupacion.jsx`: tabla con las columnas `Código` y `Nombre`.
- `components/DetalleOcupacion.jsx`: detalle de la ocupación seleccionada.
- `components/TabsOcupacion.jsx`: pestañas del detalle.
- `services/ocupacionesService.js`: consulta el catálogo activo.
- `services/excelService.js`: transforma el Excel en ocupaciones.

En este prototipo no existe un componente separado llamado
`BuscadorOcupacion.jsx`; los controles de búsqueda están dentro de la vista
`BuscarOcupacion.jsx`.

El código de cada resultado funciona como un enlace interno. Al seleccionarlo muestra:

- General.
- Funciones.
- Habilidades.
- Conocimientos.
- Denominaciones.
- Relaciones.

En el proyecto institucional, `buscarOcupaciones()` debe reemplazarse progresivamente para consultar la API, sin modificar la interfaz pública.

## 4. Integración del formulario

Archivos relacionados:

- `components/SolicitudOcupacion.jsx`
- `views/FormularioOcupacion.jsx`

El formulario conserva sus campos y validaciones actuales. Actualmente usa `console.log` y no guarda información en una base de datos.

Al integrarlo al proyecto real se debe:

1. Mantener los campos y sus reglas obligatorias.
2. Reemplazar `console.log` por el servicio o endpoint institucional.
3. Usar el sistema de autenticación y correo existente si aplica.
4. No duplicar el formulario si ya existe una implementación institucional equivalente.

## 5. Integración del administrador

Archivo principal:

- `views/AdminOcupaciones.jsx`

Servicios utilizados:

- `services/excelService.js`
- `services/ocupacionesService.js`

El flujo del prototipo es:

```text
Seleccionar Excel
        ↓
Validar extensión y contenido
        ↓
Mostrar resumen
        ↓
Confirmar publicación
        ↓
Actualizar catálogo activo
```

La vista administrativa debe protegerse en el proyecto institucional mediante el sistema de autenticación y autorización existente. No se debe confiar únicamente en ocultar el enlace del menú.

## 6. Rutas

El prototipo utiliza estas rutas:

```text
/             Inicio público
/buscar       Buscador público
/formulario   Solicitud de nueva ocupación
/admin        Administración del catálogo
```

Si el proyecto institucional ya utiliza React Router, agregar únicamente las rutas equivalentes:

```jsx
<Route path="/buscar" element={<BuscarOcupacion />} />
<Route path="/formulario" element={<FormularioOcupacion />} />
<Route path="/admin" element={<AdminOcupaciones />} />
```

No crear un segundo `BrowserRouter` si el proyecto institucional ya tiene uno.

## 7. Cambios en `App.jsx` y `main.jsx`

Si el proyecto institucional ya tiene un `App.jsx`, no reemplazarlo completo. Integrar solamente:

- Las importaciones de las vistas.
- Las rutas.
- Los enlaces del menú público.
- El enlace administrativo según permisos.

Si ya existe un `BrowserRouter` en `main.jsx`, reutilizarlo. Solo debe existir un router principal.

## 8. Estilos

Copiar las reglas necesarias de `App.css` e `index.css`, pero revisar primero si el proyecto institucional tiene un sistema visual propio.

Si existen estilos globales institucionales:

- Priorizar sus variables y componentes.
- Evitar sobrescribir nombres genéricos como `.boton`, `.campo` o `h1`.
- Considerar agregar un prefijo, por ejemplo `.ocupaciones-buscador`.
- Mantener la adaptación responsive.

## 9. Datos mock y catálogo real

`data/ocupacionesMock.js` solo sirve para desarrollo local. No debe utilizarse como fuente definitiva en producción.

Actualmente `ocupacionesService.js` guarda el catálogo activo en `localStorage`. Esto permite probar el flujo, pero no es persistencia institucional.

En el proyecto real, reemplazarlo por:

```text
Componentes y vistas
        ↓
Servicios frontend
        ↓
API institucional
        ↓
Base de datos
```

El backend deberá encargarse de:

- Guardar versiones.
- Validar archivos.
- Publicar catálogos.
- Mantener históricos.
- Garantizar que exista un único catálogo vigente.
- Controlar permisos administrativos.

## 10. Estructura del Excel

El prototipo reconoce provisionalmente columnas como:

- `Código`.
- `Nombre`.
- `Descripción`.
- `Clasificación`.
- `Nivel`.
- `Área de desempeño`.

También intenta leer hojas llamadas:

- `Funciones`.
- `Habilidades`.
- `Conocimientos`.
- `Denominaciones`.
- `Relaciones`.

Estos nombres no son definitivos. Antes de integrar el importador real:

1. Analizar el Excel institucional.
2. Documentar sus hojas y columnas.
3. Definir el mapeo oficial.
4. Validar tipos, códigos duplicados y campos obligatorios.
5. Implementar la carga definitiva en el backend si es posible.

## 11. Qué no se debe copiar

No copiar:

- `node_modules/`.
- `dist/`.
- El `package.json` completo si el proyecto institucional ya tiene uno.
- `vite.config.js` si usa otra configuración.
- `eslint.config.js` sin revisar compatibilidad.
- `ocupacionesMock.js` como datos de producción.
- La lógica de `localStorage` como persistencia definitiva.

## 12. Orden recomendado de integración

1. Revisar framework, versión de React y router del proyecto institucional.
2. Copiar los componentes públicos.
3. Integrar las rutas de búsqueda y formulario.
4. Conectar `ocupacionesService.js` con la API institucional.
5. Integrar el detalle y sus pestañas.
6. Proteger `/admin` con autenticación y permisos.
7. Reemplazar la lectura local del Excel por el flujo backend.
8. Probar catálogo vigente, borrador e histórico.
9. Ejecutar pruebas responsive y de accesibilidad.

## 13. Verificación final

Antes de publicar la integración, comprobar:

- La consulta pública no permite editar ni eliminar.
- El código abre el detalle interno.
- El buscador usa el catálogo vigente.
- Un Excel inválido no reemplaza el catálogo vigente.
- Una nueva publicación conserva la versión anterior como histórica.
- Solo usuarios autorizados pueden acceder al administrador.
- Los datos de prueba no se mezclan con datos institucionales.
