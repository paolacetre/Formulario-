function DenominacionesOcupacionales({ listaEditable }) {
  return (
    <fieldset className="formulario-seccion instrumento-seccion">
      <legend className="seccion-header">4. Denominaciones ocupacionales</legend>
      <p>Agregue cargos o nombres equivalentes de esta ocupación.</p>
      {listaEditable("denominaciones", "input", "denominación", "Ejemplo: Coordinador de operaciones")}
    </fieldset>
  );
}

export default DenominacionesOcupacionales;
