import { AREAS_DESEMPENO, NIVELES_CUALIFICACION } from "../data/instrumento3.models";

// Listas de la CNO 2026 (CNO_2026_10-09Actualizado (2).xlsx: hojas Ocupaciones, Funciones y Denominaciones;
// solo registros activos). Se cargan cuando se necesitan para no aumentar el tamaño inicial de la aplicación.
// En producción deben venir de la API del backend.
let promesaCatalogos = null;

export function normalizarTexto(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// Opciones para SelectorBuscable: { value, label, detalle, ocupacion?, clave? }.
export const OPCIONES_NIVEL = NIVELES_CUALIFICACION.map((nivel) => ({ value: nivel.value, label: `${nivel.value} · ${nivel.label}`, detalle: nivel.descripcion }));
export const OPCIONES_AREA = AREAS_DESEMPENO.map((area) => ({ value: area.value, label: `${area.value} · ${area.label}`, detalle: area.descripcion }));

function crearOpcion(codigo, nombre, descripcion, ocupacion = null) {
  return {
    value: codigo,
    label: nombre,
    detalle: descripcion,
    ocupacion,
    normal: normalizarTexto(nombre),
    // Se puede buscar por código, nombre, descripción o por la ocupación a la que pertenece.
    clave: normalizarTexto(`${codigo} ${nombre} ${descripcion} ${ocupacion ? `${ocupacion.codigo} ${ocupacion.nombre}` : ""}`),
  };
}

export function cargarCatalogosCno() {
  if (!promesaCatalogos) {
    promesaCatalogos = Promise.all([
      import("../data/cno/ocupaciones.json"),
      import("../data/cno/funciones.json"),
      import("../data/cno/denominaciones.json"),
    ])
      .then(([{ default: ocupaciones }, { default: funciones }, { default: denominaciones }]) => {
        const porCodigo = new Map(ocupaciones.map((ocupacion) => [ocupacion.codigo, { codigo: ocupacion.codigo, nombre: ocupacion.nombre }]));

        return {
          // Las funciones de la CNO solo tienen código y texto; se muestran con la ocupación a la que pertenecen.
          funciones: funciones.map((funcion) => crearOpcion(funcion.codigo, funcion.descripcion, "", porCodigo.get(funcion.ocupacion))),
          // Las denominaciones solo tienen código y nombre; se muestran con la ocupación a la que pertenecen.
          denominaciones: denominaciones.map((denominacion) => crearOpcion(denominacion.codigo, denominacion.nombre, "", porCodigo.get(denominacion.ocupacion))),
          ocupaciones: ocupaciones.map((ocupacion) => crearOpcion(ocupacion.codigo, ocupacion.nombre, ocupacion.descripcion)),
        };
      })
      .catch((error) => {
        promesaCatalogos = null;
        throw error;
      });
  }
  return promesaCatalogos;
}
