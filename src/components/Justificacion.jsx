function Justificacion({ formulario, manejarCambio }) {
  return (
    <fieldset className="formulario-seccion instrumento-seccion">
      <legend className="seccion-header">8. Justificación</legend>
      <p>Explique la necesidad de crear esta ocupación.</p>
      <div className="campo">
        <label htmlFor="justificacion">
          Justificación <span aria-hidden="true" className="obligatorio">*</span>
        </label>
        <textarea id="justificacion" name="justificacion" value={formulario.justificacion} onChange={manejarCambio} rows="5" placeholder="Explique las razones de la solicitud" required />
      </div>
    </fieldset>
  );
}

export default Justificacion;
