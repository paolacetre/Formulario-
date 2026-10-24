import { useState } from "react";
import ListaAdjuntos from "./ListaAdjuntos";
import EncabezadoPaso from "./EncabezadoPaso";
import Tarjeta from "./Tarjeta";

const EXTENSIONES_PERMITIDAS = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png"];
const TAMANO_MAXIMO_MB = 10;

function Justificacion({ formulario, manejarCambio, adjuntos, agregarAdjuntos, quitarAdjunto }) {
  const [erroresAdjuntos, setErroresAdjuntos] = useState([]);

  const manejarArchivos = (evento) => {
    const archivos = Array.from(evento.target.files);
    const errores = [];
    const validos = archivos.filter((archivo) => {
      const extension = `.${archivo.name.split(".").pop().toLowerCase()}`;
      if (!EXTENSIONES_PERMITIDAS.includes(extension)) {
        errores.push(`${archivo.name}: formato no permitido.`);
        return false;
      }
      if (archivo.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
        errores.push(`${archivo.name}: supera ${TAMANO_MAXIMO_MB} MB.`);
        return false;
      }
      return true;
    });

    agregarAdjuntos(validos);
    setErroresAdjuntos(errores);
    evento.target.value = "";
  };

  return (
    <fieldset className="paso">
      <EncabezadoPaso numero={6} descripcion="Explique la necesidad de crear esta ocupación y adjunte los documentos que la respalden." />
      <div className="tarjetas">
        <Tarjeta id="tarjeta-justificacion" icono="edit_note" titulo="Justificación" descripcion="Indique si responde a requerimientos del sector productivo o si tiene una aplicación jurídica, normativa o gubernamental.">
          <div className="campo">
            <label htmlFor="justificacion">
              Justificación <span aria-hidden="true" className="obligatorio">*</span>
            </label>
            <textarea id="justificacion" name="justificacion" value={formulario.justificacion} onChange={manejarCambio} rows="5" placeholder="Explique las razones de la solicitud" required />
          </div>
        </Tarjeta>

        <Tarjeta id="tarjeta-adjuntos" icono="attach_file" titulo="Documentos de soporte" descripcion="Adjunte los documentos que considere pertinentes como parte de la solicitud." resumen={`${adjuntos.length} ${adjuntos.length === 1 ? "archivo" : "archivos"}`}>
          <div className="adjuntos-justificacion">
            <label className="zona-carga" htmlFor="adjuntosJustificacion">
              <span aria-hidden="true" className="zona-carga-icono material-icons">upload_file</span>
              <span className="zona-carga-titulo">Seleccionar archivos</span>
              <small id="adjuntos-ayuda">PDF, Word, Excel o imagen · máximo {TAMANO_MAXIMO_MB} MB por archivo</small>
              <input id="adjuntosJustificacion" type="file" multiple accept={EXTENSIONES_PERMITIDAS.join(",")} onChange={manejarArchivos} aria-describedby="adjuntos-ayuda" />
            </label>

            {erroresAdjuntos.length > 0 && (
              <div className="aviso aviso-error" role="alert">
                <span aria-hidden="true" className="material-icons">error_outline</span>
                <div>
                  <strong>Algunos archivos no se adjuntaron.</strong>
                  <ul>{erroresAdjuntos.map((error) => <li key={error}>{error}</li>)}</ul>
                </div>
              </div>
            )}

            {adjuntos.length > 0 && <ListaAdjuntos adjuntos={adjuntos} onQuitar={quitarAdjunto} />}
            <p className="nota-campo">Los archivos no se guardan en el borrador automático: si recarga la página deberá adjuntarlos de nuevo.</p>
          </div>
        </Tarjeta>
      </div>
    </fieldset>
  );
}

export default Justificacion;
