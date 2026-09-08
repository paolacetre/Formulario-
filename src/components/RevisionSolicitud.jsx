import {
  AREAS_DESEMPENO,
  DEPARTAMENTOS,
  MUNICIPIOS_POR_DEPARTAMENTO,
  NIVELES_CUALIFICACION,
  SECTORES,
} from "../data/instrumento3.models";

function obtenerEtiqueta(opciones, valor) {
  return opciones.find((opcion) => opcion.value === valor)?.label || valor;
}

function obtenerMunicipio(departamento, municipio) {
  return obtenerEtiqueta(MUNICIPIOS_POR_DEPARTAMENTO[departamento] || [], municipio);
}

function ValorRevision({ valor, lista = false }) {
  if (lista) {
    const elementos = Array.isArray(valor) ? valor.filter(Boolean) : [];
    if (elementos.length === 0) return <span className="revision-vacio">Sin información</span>;
    return <ul className="revision-lista">{elementos.map((elemento, indice) => <li key={`${elemento}-${indice}`}>{elemento}</li>)}</ul>;
  }

  return valor ? <span>{valor}</span> : <span className="revision-vacio">Sin información</span>;
}

function RevisionSolicitud({ formulario }) {
  const grupos = [
    ["Datos generales", [
      ["Fecha", formulario.fecha],
      ["Nombre y apellidos", formulario.nombreApellidos],
      ["Documento de identidad", formulario.documentoIdentidad],
      ["Correo electrónico", formulario.email],
      ["Teléfono de contacto", formulario.telefono],
      ["Empresa o entidad", formulario.empresaEntidad],
      ["Cargo", formulario.cargo],
      ["Profesión", formulario.profesion],
      ["Departamento", obtenerEtiqueta(DEPARTAMENTOS, formulario.departamento)],
      ["Municipio", obtenerMunicipio(formulario.departamento, formulario.municipio)],
      ["Sector", obtenerEtiqueta(SECTORES, formulario.sector)],
    ]],
    ["Propuesta de ocupación", [
      ["Nombre de la ocupación", formulario.nombreOcupacion],
      ["Área de desempeño", obtenerEtiqueta(AREAS_DESEMPENO, formulario.areaDesempeno)],
      ["Nivel de cualificación", obtenerEtiqueta(NIVELES_CUALIFICACION, formulario.nivelCualificacion)],
      ["Descripción de la ocupación", formulario.descripcion, false, true],
    ]],
    ["3. Funciones principales", [["Funciones principales", formulario.funciones, true, true]]],
    ["4. Denominaciones ocupacionales", [["Denominaciones ocupacionales", formulario.denominaciones, true, true]]],
    ["5. Ocupaciones relacionadas", [["Ocupaciones relacionadas", formulario.ocupacionesRelacionadas, true, true]]],
    ["6. Habilidades", [
      ["Habilidades seleccionadas", formulario.habilidades, true, true],
      ["Otras habilidades", formulario.otrasHabilidades, false, true],
    ]],
    ["7. Conocimientos", [
      ["Conocimientos seleccionados", formulario.conocimientos, true, true],
      ["Otros conocimientos", formulario.otrosConocimientos, false, true],
    ]],
    ["8. Justificación", [["Justificación", formulario.justificacion, false, true]]],
  ];

  return (
    <section className="formulario-seccion revision-seccion" aria-labelledby="titulo-revision">
      <h2 id="titulo-revision">9. Revisión de la solicitud</h2>
      <p>Revise toda la información diligenciada antes de enviar la solicitud completa.</p>
      {grupos.map(([titulo, campos]) => (
        <section className="revision-grupo" key={titulo} aria-labelledby={`revision-${titulo}`}>
          <h3 id={`revision-${titulo}`}>{titulo}</h3>
          <dl>
            {campos.map(([etiqueta, valor, lista, completo]) => (
              <div className={completo ? "revision-campo-completo" : ""} key={etiqueta}>
                <dt>{etiqueta}</dt>
                <dd><ValorRevision valor={valor} lista={lista} /></dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </section>
  );
}

export default RevisionSolicitud;
