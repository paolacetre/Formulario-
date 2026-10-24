import { useState } from "react";
import { buscarOcupaciones, obtenerOcupaciones } from "../services/ocupacionesService";

const MAXIMO_RESULTADOS = 8;

const secciones = [
  ["ocupacion", "Ocupación", "Escriba el nombre de la ocupación propuesta"],
  ["descripcion", "Descripción", "Describa brevemente la ocupación"],
  ["denominaciones", "Denominaciones ocupacionales", "Escriba las denominaciones relacionadas"],
  ["conocimientos", "Conocimientos", "Describa los conocimientos requeridos"],
  ["destrezas", "Destrezas", "Describa las destrezas requeridas"],
  ["afines", "Ocupaciones afines", "Indique las ocupaciones relacionadas"],
  ["nivel", "Nivel de competencia", "Indique el nivel de competencia"],
  ["equivalencias", "Equivalencias", "Describa las equivalencias"],
  ["areaCualificacion", "Área de Cualificación del Marco Nacional de Cualificaciones (MNC)", "Indique el área de cualificación"],
];

const formularioInicial = {
  solicitudNo: "", ciudad: "", fecha: new Date().toISOString().slice(0, 10), tipoPersona: [], nombre: "", entidad: "", cargo: "", telefono: "", celular: "", correo: "", tipoSolicitud: [], seccionesActivas: [], ocupacionBase: "", observacion: "", archivo: null, realizoDane: "", fechaDane: "", numeroSolicitud: "", funcionario: "", observacionesDane: "", respuestas: Object.fromEntries(secciones.map(([id]) => [id, ""])),
};

function FormularioAlterno() {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [guardado, setGuardado] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState("");
  const [referenciasVisibles, setReferenciasVisibles] = useState({});
  const esAjuste = formulario.tipoSolicitud.includes("Ajuste");
  const ocupacionSeleccionada = obtenerOcupaciones().find((ocupacion) => ocupacion.id === formulario.ocupacionBase);

  const cambiar = (evento) => {
    const { name, value, files, checked } = evento.target;
    if (evento.target.type === "file") {
      setFormulario({ ...formulario, [name]: files[0] || null });
      return;
    }
    if (evento.target.type === "checkbox") {
      if (name === "tipoPersona") {
        setFormulario({ ...formulario, tipoPersona: checked ? [value] : [] });
        return;
      }
      if (name === "tipoSolicitud") {
        setFormulario({ ...formulario, tipoSolicitud: checked ? [value] : [], ...(value === "Inclusión de nueva ocupación" ? { ocupacionBase: "", seccionesActivas: [] } : {}) });
        return;
      }
      setFormulario({ ...formulario, [name]: checked ? [...formulario[name], value] : formulario[name].filter((item) => item !== value) });
      return;
    }
    setFormulario({ ...formulario, [name]: value });
  };

  const enviar = (evento) => {
    evento.preventDefault();
    const datosObligatorios = [formulario.ciudad, formulario.fecha, formulario.nombre, formulario.entidad, formulario.cargo, formulario.telefono, formulario.celular, formulario.correo];
    const respuestasIncompletas = formulario.seccionesActivas.some((id) => !formulario.respuestas[id].trim());

    if (datosObligatorios.some((valor) => !valor.trim()) || formulario.tipoPersona.length === 0 || formulario.tipoSolicitud.length === 0 || (esAjuste && !formulario.ocupacionBase) || respuestasIncompletas) {
      setGuardado(false);
      setErrorValidacion("Complete todos los campos obligatorios antes de enviar la solicitud.");
      return;
    }

    setErrorValidacion("");
    setGuardado(true);
  };

  return (
    <main className="pagina formulario-alterno-pagina">
      <form className="formulario-alterno" onSubmit={enviar}>
        <header className="alterno-cabecera">
          <span className="etiqueta">FORMULARIO DE SOLICITUD</span>
          <h1>Solicitud de actualización ocupacional</h1>
          <p>Complete la información de la solicitud y detalle los cambios requeridos.</p>
        </header>

        <fieldset className="alterno-datos-superiores">
          <legend className="sr-only">Datos iniciales de la solicitud</legend>
          <div className="alterno-campo"><label htmlFor="solicitudNo">SOLICITUD No.</label><input id="solicitudNo" name="solicitudNo" value={formulario.solicitudNo} onChange={cambiar} placeholder="Solicitud No." disabled /></div>
          <div className="alterno-campo"><label htmlFor="ciudad">CIUDAD:</label><input id="ciudad" name="ciudad" value={formulario.ciudad} onChange={cambiar} placeholder="Ciudad" /></div>
          <div className="alterno-campo"><label htmlFor="fecha">FECHA:</label><input id="fecha" name="fecha" type="date" value={formulario.fecha} onChange={cambiar} /></div>
        </fieldset>

        <Seccion titulo="DATOS DEL SOLICITANTE">
          <fieldset className="alterno-grupo-opciones">
            <legend className="alterno-label">Tipo de persona</legend>
            <div className="alterno-opciones"><Check name="tipoPersona" value="Natural" checked={formulario.tipoPersona.includes("Natural")} onChange={cambiar} /><Check name="tipoPersona" value="Jurídica" checked={formulario.tipoPersona.includes("Jurídica")} onChange={cambiar} /></div>
          </fieldset>
          <div className="alterno-campo alterno-completo"><label htmlFor="nombre">Nombres y apellidos:</label><input id="nombre" name="nombre" value={formulario.nombre} onChange={cambiar} placeholder="Nombres y apellidos" /></div>
          <div className="alterno-grid"><Campo id="entidad" label="Entidad" value={formulario.entidad} onChange={cambiar} placeholder="Entidad" /><Campo id="cargo" label="Cargo" value={formulario.cargo} onChange={cambiar} placeholder="Cargo" /><Campo id="telefono" label="Teléfono" value={formulario.telefono} onChange={cambiar} placeholder="999-9999" /><Campo id="celular" label="Celular" value={formulario.celular} onChange={cambiar} placeholder="999-9999" /><Campo id="correo" label="Correo" type="email" value={formulario.correo} onChange={cambiar} placeholder="Correo electrónico" /></div>
        </Seccion>

        <Seccion titulo="DATOS DE LA SOLICITUD">
          <fieldset className="alterno-grupo-opciones">
            <legend className="alterno-label">Tipo de solicitud</legend>
            <div className="alterno-opciones"><Check name="tipoSolicitud" value="Ajuste" checked={formulario.tipoSolicitud.includes("Ajuste")} onChange={cambiar} /><Check name="tipoSolicitud" value="Inclusión de nueva ocupación" checked={formulario.tipoSolicitud.includes("Inclusión de nueva ocupación")} onChange={cambiar} /></div>
          </fieldset>
          <fieldset className="alterno-grupo-opciones" disabled={!esAjuste}>
            <legend className="alterno-select-label">Busque por código o por término la ocupación sobre la cual tiene observaciones:</legend>
            <div className="alterno-buscadores">
              <BuscadorOcupacion clasificacion="CNO" seleccionadaId={formulario.ocupacionBase} onSeleccionar={(id) => setFormulario({ ...formulario, ocupacionBase: id })} deshabilitado={!esAjuste} />
              <BuscadorOcupacion clasificacion="CUOC" seleccionadaId={formulario.ocupacionBase} onSeleccionar={(id) => setFormulario({ ...formulario, ocupacionBase: id })} deshabilitado={!esAjuste} />
            </div>
          </fieldset>
          {ocupacionSeleccionada && <div className="ocupacion-seleccionada" role="status"><strong>{ocupacionSeleccionada.clasificacion} · {ocupacionSeleccionada.codigo} · {ocupacionSeleccionada.nombre}</strong><span>{ocupacionSeleccionada.descripcion}</span></div>}
          <div className="alterno-secciones">
            {secciones.map(([id, titulo, placeholder]) => (
              <div className="alterno-fila" key={id}>
                <div className="alterno-fila-etiqueta">
                  <label htmlFor={`respuesta-${id}`}>
                    <input type="checkbox" name="seccionesActivas" value={id} checked={formulario.seccionesActivas.includes(id)} onChange={cambiar} disabled={!ocupacionSeleccionada && esAjuste} />
                    {titulo}
                  </label>
                  {ocupacionSeleccionada && <button type="button" className="alterno-ver" onClick={() => setReferenciasVisibles({ ...referenciasVisibles, [id]: !referenciasVisibles[id] })}>+ {referenciasVisibles[id] ? "Ocultar" : "Ver"} {titulo}</button>}
                  {referenciasVisibles[id] && <span className="alterno-info">{obtenerInformacion(ocupacionSeleccionada, id)}</span>}
                </div>
                <div className="alterno-respuesta">
                  <label className="sr-only" htmlFor={`respuesta-${id}`}>Respuesta para {titulo}</label>
                  <textarea id={`respuesta-${id}`} name={`respuesta-${id}`} value={formulario.respuestas[id]} onChange={(evento) => setFormulario({ ...formulario, respuestas: { ...formulario.respuestas, [id]: evento.target.value } })} placeholder={esAjuste ? "Escriba aquí el ajuste propuesto" : placeholder} rows="4" disabled={esAjuste && !formulario.seccionesActivas.includes(id)} />
                  {["conocimientos", "destrezas", "areaCualificacion"].includes(id) && <div className="alterno-referencia"><label className="sr-only" htmlFor={`referencia-${id}`}>Lista de {titulo}</label><select id={`referencia-${id}`} className="alterno-select" disabled={esAjuste && !formulario.seccionesActivas.includes(id)}><option>{titulo}</option></select><button type="button" className="alterno-pdf" title={`Abrir información de ${titulo}`} aria-label={`Abrir información de ${titulo}`} onClick={() => window.open(`/referencias/${id}.pdf`, "_blank", "noopener,noreferrer")}><span aria-hidden="true" className="material-icons">picture_as_pdf</span></button><small>Puede proponer más de la lista desplegable</small></div>}
                </div>
              </div>
            ))}
          </div>
          <div className="alterno-campo alterno-completo"><label htmlFor="observacion">Observación, propuesta o requerimiento:</label><textarea id="observacion" name="observacion" value={formulario.observacion} onChange={cambiar} placeholder="Observaciones" rows="5" /></div>
          <div className="alterno-adjunto"><span className="alterno-adjunto-titulo">Anexar archivo</span><label className="alterno-archivo-boton" htmlFor="archivo">Seleccionar archivo</label><input id="archivo" name="archivo" type="file" onChange={cambiar} /><span className="alterno-archivo-nombre">{formulario.archivo?.name || "Ningún archivo seleccionado"}</span></div>
        </Seccion>

        <Seccion titulo="SEGUIMIENTO DE LA SOLICITUD">
          <fieldset className="alterno-grupo-opciones">
            <legend className="alterno-pregunta">¿Había realizado anteriormente esta solicitud?</legend>
            <div className="alterno-opciones"><Check name="realizoDane" value="Sí" type="radio" checked={formulario.realizoDane === "Sí"} onChange={cambiar} /><Check name="realizoDane" value="No" type="radio" checked={formulario.realizoDane === "No"} onChange={cambiar} /></div>
          </fieldset>
          <div className="alterno-grid"><Campo id="fechaDane" label="Fecha" type="date" value={formulario.fechaDane} onChange={cambiar} /><Campo id="numeroSolicitud" label="Número de la solicitud" value={formulario.numeroSolicitud} onChange={cambiar} placeholder="Solicitud No." /><Campo id="funcionario" label="Nombre del funcionario que atendió la solicitud" value={formulario.funcionario} onChange={cambiar} placeholder="Funcionario que atendió la solicitud" /></div>
          <div className="alterno-campo alterno-completo"><label htmlFor="observacionesDane">Observaciones:</label><textarea id="observacionesDane" name="observacionesDane" value={formulario.observacionesDane} onChange={cambiar} placeholder="Observaciones" rows="5" /></div>
        </Seccion>
        {errorValidacion && <p className="alterno-error" role="alert">{errorValidacion}</p>}
        {guardado && <p className="alterno-exito" role="status">La solicitud fue guardada correctamente.</p>}
        <button className="alterno-guardar" type="submit"><span aria-hidden="true" className="material-icons">save</span> Guardar solicitud</button>
      </form>
    </main>
  );
}

function Campo({ id, label, type = "text", value, onChange, placeholder }) { return <div className="alterno-campo"><label htmlFor={id}>{label}:</label><input id={id} name={id} type={type} value={value} onChange={onChange} placeholder={placeholder} /></div>; }
function Check({ name, value, type = "checkbox", checked, onChange }) { return <label className="alterno-check"><input name={name} value={value} type={type} checked={checked} onChange={onChange} />{value}</label>; }
function BuscadorOcupacion({ clasificacion, seleccionadaId, onSeleccionar, deshabilitado }) {
  const [termino, setTermino] = useState("");
  const id = `buscar-${clasificacion.toLowerCase()}`;
  const hayTermino = termino.trim() !== "";
  const resultados = hayTermino ? buscarOcupaciones({ termino, clasificacion: clasificacion.toLowerCase() }) : [];
  const estado = deshabilitado
    ? "No aplica para inclusión de nueva ocupación"
    : !hayTermino
      ? `Escriba un código o un término de la ${clasificacion}`
      : resultados.length === 0
        ? `No hay ocupaciones ${clasificacion} que coincidan`
        : resultados.length > MAXIMO_RESULTADOS
          ? `Mostrando ${MAXIMO_RESULTADOS} de ${resultados.length} resultados; precise la búsqueda`
          : `${resultados.length} ${resultados.length === 1 ? "resultado" : "resultados"} en ${clasificacion}`;

  return (
    <div className="alterno-buscador">
      <label htmlFor={id}>Buscar en {clasificacion}</label>
      <input id={id} type="search" value={termino} onChange={(evento) => setTermino(evento.target.value)} placeholder={`Código o término ${clasificacion}`} aria-describedby={`${id}-estado`} />
      <p id={`${id}-estado`} className="alterno-buscador-estado" aria-live="polite">{estado}</p>
      {resultados.length > 0 && (
        <ul className="alterno-buscador-resultados" aria-label={`Resultados ${clasificacion}`}>
          {resultados.slice(0, MAXIMO_RESULTADOS).map((ocupacion) => (
            <li key={ocupacion.id}>
              <button type="button" aria-pressed={ocupacion.id === seleccionadaId} onClick={() => { onSeleccionar(ocupacion.id); setTermino(""); }}>
                <strong>{ocupacion.codigo}</strong> {ocupacion.nombre}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
function Seccion({ titulo, children }) { return <fieldset className="alterno-bloque"><legend>{titulo}</legend>{children}</fieldset>; }
function obtenerInformacion(ocupacion, id) {
  if (!ocupacion) return "";
  if (id === "ocupacion") return `${ocupacion.codigo} ${ocupacion.nombre}`;
  if (id === "descripcion") return ocupacion.descripcion;
  if (id === "funciones") return ocupacion.funciones.map((funcion) => funcion.descripcion).join("; ");
  if (id === "denominaciones") return ocupacion.denominaciones.join(", ");
  if (id === "afines") return ocupacion.relaciones.join(", ");
  if (id === "conocimientos") return ocupacion.conocimientos.join(", ");
  if (id === "destrezas") return ocupacion.habilidades.join(", ");
  if (id === "nivel") return ocupacion.nivel;
  return ocupacion.areaDesempeno;
}

export default FormularioAlterno;
