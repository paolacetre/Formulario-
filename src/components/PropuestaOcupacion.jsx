import { AREAS_DESEMPENO, NIVELES_CUALIFICACION } from "../data/instrumento3.models";
import { OPCIONES_AREA, OPCIONES_NIVEL } from "../services/catalogosCno";
import EncabezadoPaso from "./EncabezadoPaso";
import SelectorBuscable from "./SelectorBuscable";
import Tarjeta from "./Tarjeta";

function DescripcionSeleccion({ titulo, descripcion }) {
  if (!descripcion) return null;
  return (
    <div className="descripcion-seleccion">
      <strong>{titulo}</strong>
      <p>{descripcion}</p>
    </div>
  );
}

function PropuestaOcupacion({ formulario, manejarCambio, actualizarCampo }) {
  const nivel = NIVELES_CUALIFICACION.find((opcion) => opcion.value === formulario.nivelCualificacion);
  const area = AREAS_DESEMPENO.find((opcion) => opcion.value === formulario.areaDesempeno);

  return (
    <fieldset className="paso">
      <EncabezadoPaso numero={2} descripcion="Defina el perfil y el propósito de la nueva ocupación, y ubíquela en la CNO." />

      <div className="tarjetas">
        <Tarjeta id="tarjeta-propuesta" icono="work_outline" titulo="Datos de la ocupación" descripcion="Nombre y propósito de la ocupación que propone.">
          <div className="form-grid">
            <div className="campo campo-completo">
              <label htmlFor="nombreOcupacion">
                Nombre de la ocupación <span aria-hidden="true" className="obligatorio">*</span>
              </label>
              <input id="nombreOcupacion" name="nombreOcupacion" type="text" value={formulario.nombreOcupacion} onChange={manejarCambio} placeholder="Ejemplo: Analista de datos" required />
            </div>
            <div className="campo campo-completo">
              <label htmlFor="descripcion">
                Descripción de la ocupación <span aria-hidden="true" className="obligatorio">*</span>
              </label>
              <textarea id="descripcion" name="descripcion" value={formulario.descripcion} onChange={manejarCambio} rows="4" placeholder="Describa el propósito y alcance de la ocupación" required />
            </div>
          </div>
        </Tarjeta>

        <Tarjeta id="tarjeta-clasificacion" icono="category" titulo="Información de clasificación" descripcion="Nivel de cualificación y área de desempeño según la Clasificación Nacional de Ocupaciones (CNO).">
          <div className="clasificacion-campos">
            <div className="campo">
              <SelectorBuscable id="nivelCualificacion" etiqueta="Nivel de cualificación" icono="groups" opciones={OPCIONES_NIVEL} valor={formulario.nivelCualificacion} onCambiar={(valor) => actualizarCampo("nivelCualificacion", valor)} placeholder="Seleccione el nivel de cualificación" requerido />
              <DescripcionSeleccion titulo={nivel && `${nivel.value} · ${nivel.label}`} descripcion={nivel?.descripcion} />
            </div>
            <div className="campo">
              <SelectorBuscable id="areaDesempeno" etiqueta="Área de desempeño" icono="track_changes" opciones={OPCIONES_AREA} valor={formulario.areaDesempeno} onCambiar={(valor) => actualizarCampo("areaDesempeno", valor)} placeholder="Seleccione el área de desempeño" requerido />
              <DescripcionSeleccion titulo={area && `${area.value} · ${area.label}`} descripcion={area?.descripcion} />
            </div>
          </div>
        </Tarjeta>
      </div>
    </fieldset>
  );
}

export default PropuestaOcupacion;
