import {
  AREAS_DESEMPENO,
  CONOCIMIENTOS_CATALOGO,
  DEPARTAMENTOS,
  HABILIDADES_CATALOGO,
  MUNICIPIOS_POR_DEPARTAMENTO,
  NIVELES_CUALIFICACION,
  SECTORES,
} from "../data/instrumento3.models";

export function obtenerEtiqueta(opciones, valor) {
  return opciones.find((opcion) => opcion.value === valor)?.label || valor;
}

// "0 · Dirección y Gerencia", "Nivel 1 (A) · Profesionales, Dirección y Gerencia"
export function obtenerEtiquetaConCodigo(opciones, valor) {
  const opcion = opciones.find((elemento) => elemento.value === valor);
  return opcion ? `${opcion.value} · ${opcion.label}` : valor;
}

function describirCodigos(catalogo, codigos) {
  return codigos.map((codigo) => {
    const elemento = catalogo.find((item) => item.codigo === codigo);
    return elemento ? `${elemento.codigo} · ${elemento.nombre}` : codigo;
  });
}

function describirElementos(elementos) {
  return elementos.map((elemento) => (elemento.manual
    ? `${elemento.nombre}${elemento.descripcion ? `: ${elemento.descripcion}` : ""} (creado manualmente)`
    : `${elemento.codigo} · ${elemento.nombre}`));
}

export function obtenerUbicacion(formulario) {
  const departamento = obtenerEtiqueta(DEPARTAMENTOS, formulario.departamento);
  const municipio = obtenerEtiqueta(MUNICIPIOS_POR_DEPARTAMENTO[formulario.departamento] || [], formulario.municipio);
  return [municipio, departamento].filter(Boolean).join(", ");
}

export function formatearTamano(bytes) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Prototipo: en producción el número de radicado debe asignarlo el servicio institucional.
export function generarRadicado(fecha = new Date()) {
  return `SOL-${fecha.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

// Cada campo: [etiqueta, valor, esLista, ocupaFilaCompleta]
export function obtenerSeccionesSolicitud(formulario) {
  return [
    ["1. Datos generales", [
      ["Fecha", formulario.fecha],
      ["Nombre y apellidos", formulario.nombreApellidos],
      ["Documento de identidad", formulario.documentoIdentidad],
      ["Correo electrónico", formulario.email],
      ["Teléfono de contacto", formulario.telefono],
      ["Empresa o entidad", formulario.empresaEntidad],
      ["Cargo", formulario.cargo],
      ["Departamento", obtenerEtiqueta(DEPARTAMENTOS, formulario.departamento)],
      ["Municipio", obtenerEtiqueta(MUNICIPIOS_POR_DEPARTAMENTO[formulario.departamento] || [], formulario.municipio)],
      ["Sector", obtenerEtiqueta(SECTORES, formulario.sector)],
    ]],
    ["2. Propuesta de ocupación", [
      ["Nombre de la ocupación", formulario.nombreOcupacion],
      ["Descripción de la ocupación", formulario.descripcion, false, true],
      ["Nivel de cualificación", obtenerEtiquetaConCodigo(NIVELES_CUALIFICACION, formulario.nivelCualificacion)],
      ["Área de desempeño", obtenerEtiquetaConCodigo(AREAS_DESEMPENO, formulario.areaDesempeno)],
    ]],
    ["3. Funciones, denominaciones y ocupaciones relacionadas", [
      ["Funciones", describirElementos(formulario.funciones), true, true],
      ["Denominaciones", describirElementos(formulario.denominaciones), true, true],
      ["Ocupaciones relacionadas", describirElementos(formulario.ocupacionesRelacionadas), true, true],
    ]],
    ["4. Habilidades", [
      ["Habilidades seleccionadas", describirCodigos(HABILIDADES_CATALOGO, formulario.habilidades), true, true],
      ["Otras habilidades", describirElementos(formulario.habilidadesManuales), true, true],
    ]],
    ["5. Conocimientos", [
      ["Conocimientos seleccionados", describirCodigos(CONOCIMIENTOS_CATALOGO, formulario.conocimientos), true, true],
      ["Otros conocimientos", describirElementos(formulario.conocimientosManuales), true, true],
    ]],
    ["6. Justificación", [["Justificación", formulario.justificacion, false, true]]],
  ];
}
