import { obtenerSeccionesSolicitud } from "../services/fichaSolicitud";
import EncabezadoPaso from "./EncabezadoPaso";
import ListaAdjuntos from "./ListaAdjuntos";

function ValorRevision({ valor, lista = false }) {
  if (lista) {
    const elementos = Array.isArray(valor) ? valor.filter(Boolean) : [];
    if (elementos.length === 0) return <span className="revision-vacio">Sin información</span>;
    return <ul className="revision-lista">{elementos.map((elemento, indice) => <li key={`${elemento}-${indice}`}>{elemento}</li>)}</ul>;
  }

  return valor ? <span>{valor}</span> : <span className="revision-vacio">Sin información</span>;
}

function BotonEditar({ paso, titulo, onEditar }) {
  return (
    <button type="button" className="boton-editar" onClick={() => onEditar(paso)} aria-label={`Editar ${titulo}`}>
      <span aria-hidden="true" className="material-icons-round">edit</span>
      Editar
    </button>
  );
}

// Estado de la solicitud antes de enviar: aprobación si están todos los obligatorios, advertencia si falta alguno.
// faltantes: [{ paso, campo, etiqueta }], con un acceso directo al paso de cada uno.
function EstadoRevision({ faltantes, onEditar }) {
  if (faltantes.length === 0) {
    return (
      <div className="aviso aviso-exito">
        <span aria-hidden="true" className="material-icons-round">check_circle</span>
        <p><strong>Todo listo:</strong> los campos obligatorios están completos. Revise la información y envíe la solicitud.</p>
      </div>
    );
  }

  return (
    <div className="aviso aviso-advertencia">
      <span aria-hidden="true" className="material-icons-round">warning_amber</span>
      <div>
        <p><strong>Faltan campos obligatorios.</strong> Complételos antes de enviar:</p>
        <ul>
          {faltantes.map(({ campo, etiqueta, paso }) => (
            <li key={campo}>
              <button type="button" className="aviso-enlace" onClick={() => onEditar(paso)}>{etiqueta} (paso {paso})</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Los grupos siguen el orden de los pasos 1 a 6; cada uno permite volver a su paso para corregirlo.
function RevisionSolicitud({ formulario, adjuntos = [], faltantes = [], onEditar }) {
  const grupos = obtenerSeccionesSolicitud(formulario);

  return (
    <section className="paso" tabIndex={-1} aria-labelledby="titulo-revision">
      <EncabezadoPaso numero={7} comoTitulo id="titulo-revision" descripcion="Revise toda la información antes de enviar. Puede editar cualquier sección. Al enviarla, la solicitud queda radicada y llega al equipo de analistas." />
      <EstadoRevision faltantes={faltantes} onEditar={onEditar} />
      <div className="tarjetas">
        {grupos.map(([titulo, campos], indice) => (
          <section className="tarjeta revision-grupo" key={titulo} aria-labelledby={`revision-grupo-${indice}`}>
            <header className="revision-grupo-encabezado">
              <h3 id={`revision-grupo-${indice}`}>{titulo}</h3>
              <BotonEditar paso={indice + 1} titulo={titulo} onEditar={onEditar} />
            </header>
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
        <section className="tarjeta revision-grupo" aria-labelledby="revision-adjuntos">
          <header className="revision-grupo-encabezado">
            <h3 id="revision-adjuntos">Documentos adjuntos</h3>
            <BotonEditar paso={6} titulo="Documentos adjuntos" onEditar={onEditar} />
          </header>
          {adjuntos.length > 0
            ? <ListaAdjuntos adjuntos={adjuntos} />
            : <p className="revision-vacio">No se adjuntaron documentos.</p>}
        </section>
      </div>
    </section>
  );
}

export default RevisionSolicitud;
