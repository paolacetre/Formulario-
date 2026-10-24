// Elemento agregado a una lista: { codigo, nombre, descripcion, ocupacion?, manual }.
function TarjetaElemento({ elemento, onQuitar }) {
  return (
    <li className={elemento.manual ? "tarjeta-elemento manual" : "tarjeta-elemento"}>
      <div className="tarjeta-elemento-cabecera">
        <span className={elemento.manual ? "codigo-cno codigo-manual" : "codigo-cno"}>{elemento.manual ? "Creado manualmente" : elemento.codigo}</span>
        <button type="button" className="boton-icono boton-icono-quitar" onClick={onQuitar} aria-label={`Quitar ${elemento.nombre}`} title="Quitar">
          <span aria-hidden="true" className="material-icons">delete_outline</span>
        </button>
      </div>
      <p className={elemento.nombre.length > 70 ? "tarjeta-elemento-nombre largo" : "tarjeta-elemento-nombre"}>{elemento.nombre}</p>
      {elemento.descripcion && <p className="tarjeta-elemento-descripcion">{elemento.descripcion}</p>}
      {elemento.ocupacion && (
        <p className="tarjeta-elemento-ocupacion">
          <span aria-hidden="true" className="material-icons">work_outline</span>
          Ocupación CNO {elemento.ocupacion.codigo} · {elemento.ocupacion.nombre}
        </p>
      )}
    </li>
  );
}

export default TarjetaElemento;
