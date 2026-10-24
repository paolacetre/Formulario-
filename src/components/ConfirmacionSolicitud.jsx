import { Link } from "react-router-dom";
import { AREAS_DESEMPENO, NIVELES_CUALIFICACION } from "../data/instrumento3.models";
import { obtenerEtiquetaConCodigo, obtenerUbicacion } from "../services/fichaSolicitud";
import ListaAdjuntos from "./ListaAdjuntos";

function contar(cantidad, singular, plural) {
  return `${cantidad} ${cantidad === 1 ? singular : plural}`;
}

function ConfirmacionSolicitud({ solicitud }) {
  const { radicado, formulario, adjuntos } = solicitud;
  const ubicacion = obtenerUbicacion(formulario);

  const resumen = [
    ["Ocupación Propuesta", formulario.nombreOcupacion],
    ["Nivel de Cualificación", obtenerEtiquetaConCodigo(NIVELES_CUALIFICACION, formulario.nivelCualificacion)],
    ["Área de Desempeño", obtenerEtiquetaConCodigo(AREAS_DESEMPENO, formulario.areaDesempeno)],
    ["Solicitante", formulario.email ? `${formulario.nombreApellidos} (${formulario.email})` : formulario.nombreApellidos],
    ["Funciones y relaciones", `${contar(formulario.funciones.length, "función", "funciones")} · ${contar(formulario.denominaciones.length, "denominación", "denominaciones")} · ${contar(formulario.ocupacionesRelacionadas.length, "ocupación relacionada", "ocupaciones relacionadas")}`],
    ["Competencias seleccionadas", `${contar(formulario.habilidades.length + formulario.habilidadesManuales.length, "habilidad", "habilidades")} · ${contar(formulario.conocimientos.length + formulario.conocimientosManuales.length, "conocimiento", "conocimientos")}`],
  ];

  return (
    <main className="pagina solicitud">
      <section className="confirmacion-card" aria-labelledby="confirmacion-titulo">
        <span aria-hidden="true" className="confirmacion-icono material-icons">task_alt</span>
        <h1 id="confirmacion-titulo" className="etiqueta confirmacion-etiqueta">PROPUESTA DE OCUPACIÓN RADICADA</h1>
        <p className="confirmacion-texto">Su propuesta ha sido radicada formalmente ante el Sistema Nacional de Ocupaciones para su evaluación metodológica.</p>

        <div className="confirmacion-radicado" role="status">
          <span>NÚMERO DE RADICADO</span>
          <strong>{radicado}</strong>
          <small>Fecha: {formulario.fecha}{ubicacion && ` · ${ubicacion}`}</small>
        </div>

        <dl className="confirmacion-resumen">
          {resumen.map(([etiqueta, valor]) => (
            <div key={etiqueta}>
              <dt>{etiqueta}:</dt>
              <dd>{valor || <span className="revision-vacio">Sin información</span>}</dd>
            </div>
          ))}
          <div className="confirmacion-adjuntos">
            <dt>Documentos adjuntos:</dt>
            <dd>{adjuntos.length > 0 ? <ListaAdjuntos adjuntos={adjuntos} /> : <span className="revision-vacio">No se adjuntaron documentos</span>}</dd>
          </div>
        </dl>

        <div className="confirmacion-acciones">
          <Link className="boton boton-principal" to="/">
            <span aria-hidden="true" className="material-icons">home</span>
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ConfirmacionSolicitud;
