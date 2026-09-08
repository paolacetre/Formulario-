import { HABILIDADES_CATALOGO } from "../data/instrumento3.models";

function Habilidades({ formulario, alternarCatalogo, manejarCambio }) {
  return (
    <fieldset className="formulario-seccion instrumento-seccion">
      <legend className="seccion-header">6. Habilidades</legend>
      <p>Seleccione las habilidades más importantes para desempeñar las funciones.</p>
      <div className="opciones-catalogo">
        {HABILIDADES_CATALOGO.map((habilidad) => (
          <label className={`opcion-catalogo ${formulario.habilidades.includes(habilidad) ? "seleccionada" : ""}`} key={habilidad}>
            <input type="checkbox" name="habilidades" value={habilidad} checked={formulario.habilidades.includes(habilidad)} onChange={() => alternarCatalogo("habilidades", habilidad)} />
            {habilidad}
          </label>
        ))}
      </div>
      <div className="campo campo-completo">
        <label htmlFor="otrasHabilidades">Otras habilidades</label>
        <input id="otrasHabilidades" name="otrasHabilidades" value={formulario.otrasHabilidades} onChange={manejarCambio} placeholder="Sepárelas con un signo +" />
      </div>
    </fieldset>
  );
}

export default Habilidades;
