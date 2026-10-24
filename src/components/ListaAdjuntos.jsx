import { formatearTamano } from "../services/fichaSolicitud";

function abrirArchivo(archivo) {
  const url = URL.createObjectURL(archivo);
  window.open(url, "_blank");
  // Se libera la memoria cuando la pestaña ya tuvo tiempo de cargar el archivo.
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function ListaAdjuntos({ adjuntos, onQuitar }) {
  return (
    <ul className="lista-adjuntos" aria-label="Archivos adjuntos">
      {adjuntos.map((archivo, indice) => (
        <li key={`${archivo.name}-${archivo.size}`}>
          <span aria-hidden="true" className="material-icons lista-adjuntos-icono">description</span>
          <span className="lista-adjuntos-archivo">
            {archivo.name}
            <small>{archivo.name.split(".").pop().toUpperCase()} · {formatearTamano(archivo.size)}</small>
          </span>
          <button type="button" className="boton-ver-adjunto" onClick={() => abrirArchivo(archivo)} aria-label={`Ver ${archivo.name}`}>
            <span aria-hidden="true" className="material-icons">visibility</span>
            Ver
          </button>
          {onQuitar && (
            <button type="button" className="boton-icono boton-icono-quitar" onClick={() => onQuitar(indice)} aria-label={`Quitar ${archivo.name}`} title="Quitar">
              <span aria-hidden="true" className="material-icons">delete_outline</span>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default ListaAdjuntos;
