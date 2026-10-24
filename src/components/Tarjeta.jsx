// Tarjeta del sistema visual: ícono en círculo, título, descripción y un resumen opcional a la derecha.
function Tarjeta({ id, titulo, descripcion, resumen, icono, children }) {
  return (
    <section className="tarjeta" aria-labelledby={`${id}-titulo`}>
      <header className="tarjeta-encabezado">
        {icono && <span aria-hidden="true" className="tarjeta-icono material-icons">{icono}</span>}
        <div className="tarjeta-encabezado-texto">
          <h3 id={`${id}-titulo`}>{titulo}</h3>
          {descripcion && <p>{descripcion}</p>}
        </div>
        {resumen && <span className="tarjeta-resumen">{resumen}</span>}
      </header>
      {children}
    </section>
  );
}

export default Tarjeta;
