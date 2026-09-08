import {
  AREAS_DESEMPENO,
  NIVELES_CUALIFICACION,
} from "../data/instrumento3.models";

function CampoSelect({ id, etiqueta, opciones, placeholder, valor, onChange, requerido = false }) {
  return (
    <div className="campo">
      <label htmlFor={id}>
        {etiqueta} {requerido && <span aria-hidden="true" className="obligatorio">*</span>}
      </label>
      <select id={id} name={id} value={valor} onChange={onChange} required={requerido}>
        <option value="">{placeholder}</option>
        {opciones.map((opcion) => <option value={opcion.value} key={opcion.value}>{opcion.label}</option>)}
      </select>
    </div>
  );
}

function PropuestaOcupacion({ formulario, manejarCambio }) {
  return (
    <fieldset className="formulario-seccion instrumento-seccion">
      <legend className="seccion-header">2. Propuesta de ocupación</legend>
      <p>Defina el perfil y el propósito de la nueva ocupación.</p>

      <div className="form-grid">
        <div className="campo">
          <label htmlFor="nombreOcupacion">
            Nombre de la ocupación <span aria-hidden="true" className="obligatorio">*</span>
          </label>
          <input id="nombreOcupacion" name="nombreOcupacion" type="text" value={formulario.nombreOcupacion} onChange={manejarCambio} placeholder="Ejemplo: Analista de datos" required />
        </div>
        <CampoSelect id="areaDesempeno" etiqueta="Área de desempeño" opciones={AREAS_DESEMPENO} placeholder="Seleccione área" valor={formulario.areaDesempeno} onChange={manejarCambio} requerido />
        <CampoSelect id="nivelCualificacion" etiqueta="Nivel de cualificación" opciones={NIVELES_CUALIFICACION} placeholder="Seleccione nivel" valor={formulario.nivelCualificacion} onChange={manejarCambio} requerido />
        <div className="campo campo-completo">
          <label htmlFor="descripcion">
            Descripción de la ocupación <span aria-hidden="true" className="obligatorio">*</span>
          </label>
          <textarea id="descripcion" name="descripcion" value={formulario.descripcion} onChange={manejarCambio} rows="4" placeholder="Describa el propósito y alcance de la ocupación" required />
        </div>
      </div>
    </fieldset>
  );
}

export default PropuestaOcupacion;
