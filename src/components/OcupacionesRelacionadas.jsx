function OcupacionesRelacionadas({ listaEditable }) {
  return (
    <fieldset className="formulario-seccion instrumento-seccion">
      <legend className="seccion-header">5. Ocupaciones relacionadas</legend>
      <p>Indique perfiles que tengan relación con la propuesta.</p>
      {listaEditable("ocupacionesRelacionadas", "input", "ocupación relacionada", "Nombre de ocupación relacionada")}
    </fieldset>
  );
}

export default OcupacionesRelacionadas;
