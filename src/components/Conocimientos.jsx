import { CONOCIMIENTOS_CATALOGO } from "../data/instrumento3.models";

function Conocimientos({ formulario, alternarCatalogo, manejarCambio }) {
  return (
    <fieldset className="formulario-seccion instrumento-seccion">
      <legend className="seccion-header">7. Conocimientos</legend>
      <p>Seleccione los conocimientos necesarios para la ocupación.</p>
      <div className="opciones-catalogo">
        {CONOCIMIENTOS_CATALOGO.map((conocimiento) => (
          <label className={`opcion-catalogo ${formulario.conocimientos.includes(conocimiento) ? "seleccionada" : ""}`} key={conocimiento}>
            <input type="checkbox" name="conocimientos" value={conocimiento} checked={formulario.conocimientos.includes(conocimiento)} onChange={() => alternarCatalogo("conocimientos", conocimiento)} />
            {conocimiento}
          </label>
        ))}
      </div>
      <div className="campo campo-completo">
        <label htmlFor="otrosConocimientos">Otros conocimientos</label>
        <input id="otrosConocimientos" name="otrosConocimientos" value={formulario.otrosConocimientos} onChange={manejarCambio} placeholder="Sepárelos con un signo +" />
      </div>
    </fieldset>
  );
}

export default Conocimientos;
