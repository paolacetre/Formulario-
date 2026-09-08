function FuncionesPrincipales({ formulario, manejarLista, agregarElemento, quitarElemento }) {
  return (
    <fieldset className="formulario-seccion instrumento-seccion">
      <legend className="seccion-header">3. Funciones principales</legend>
      <p>Describa las funciones más representativas del perfil.</p>

      <div className="lista-editable">
        {formulario.funciones.map((valor, indice) => (
          <div className="elemento-editable" key={`funciones-${indice}`}>
            <label className="sr-only" htmlFor={`funciones-${indice}`}>
              Función {indice + 1}
            </label>
            <textarea id={`funciones-${indice}`} name={`funciones-${indice}`} value={valor} onChange={(evento) => manejarLista("funciones", indice, evento.target.value)} rows="3" placeholder="Escriba una función principal" />
            {formulario.funciones.length > 1 && (
              <button type="button" className="boton-quitar" onClick={() => quitarElemento("funciones", indice)} aria-label={`Quitar función ${indice + 1}`}>
                ×
              </button>
            )}
          </div>
        ))}
        <button type="button" className="boton-agregar" onClick={() => agregarElemento("funciones")}>
          + Agregar función
        </button>
      </div>
    </fieldset>
  );
}

export default FuncionesPrincipales;
