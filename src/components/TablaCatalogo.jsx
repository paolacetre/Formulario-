import { useState } from "react";
import { normalizarTexto } from "../services/catalogosCno";

// catalogo: [{ codigo, nombre, descripcion }]. seleccionados guarda los códigos.
function TablaCatalogo({ id, titulo, columna, catalogo, seleccionados, onAlternar, textoSeleccion }) {
  const [filtro, setFiltro] = useState("");
  const palabras = normalizarTexto(filtro).split(" ").filter(Boolean);
  const visibles = catalogo.filter((elemento) => {
    const texto = normalizarTexto(`${elemento.codigo} ${elemento.nombre} ${elemento.descripcion}`);
    return palabras.every((palabra) => texto.includes(palabra));
  });

  return (
    <div className="tabla-catalogo-contenedor">
      <div className="tabla-catalogo-herramientas">
        <div className="filtro-busqueda">
          <label htmlFor={`${id}-filtro`} className="filtro-etiqueta"><span aria-hidden="true" className="material-icons">search</span>Búsqueda</label>
          <div className="campo-con-icono">
            <span aria-hidden="true" className="material-icons">search</span>
            <input id={`${id}-filtro`} type="search" value={filtro} onChange={(evento) => setFiltro(evento.target.value)} onKeyDown={(evento) => { if (evento.key === "Enter") evento.preventDefault(); }} placeholder="Código, nombre o descripción" autoComplete="off" />
          </div>
        </div>
        <p className="tabla-catalogo-contador" aria-live="polite">
          <strong>{seleccionados.length}</strong> de {catalogo.length} {textoSeleccion}
          {palabras.length > 0 && <span> · {visibles.length} coinciden con la búsqueda</span>}
        </p>
      </div>

      <div className="tabla-catalogo-wrapper">
        <table className="tabla-catalogo">
          <caption className="sr-only">{titulo}</caption>
          <thead>
            <tr>
              <th scope="col" className="tabla-catalogo-check"><span className="sr-only">Seleccionar</span></th>
              <th scope="col" className="tabla-catalogo-codigo">Código</th>
              <th scope="col">{columna}</th>
              <th scope="col">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map(({ codigo, nombre, descripcion }) => {
              const idOpcion = `${id}-${codigo}`;
              const seleccionado = seleccionados.includes(codigo);

              return (
                <tr className={seleccionado ? "seleccionada" : ""} key={codigo}>
                  <td className="tabla-catalogo-check">
                    <input id={idOpcion} type="checkbox" name={id} value={codigo} checked={seleccionado} onChange={() => onAlternar(codigo)} aria-describedby={`${idOpcion}-descripcion`} />
                  </td>
                  <td className="tabla-catalogo-codigo"><span className="codigo-cno">{codigo}</span></td>
                  <th scope="row"><label htmlFor={idOpcion}>{nombre}</label></th>
                  <td id={`${idOpcion}-descripcion`}>{descripcion || <span className="revision-vacio">Sin descripción en la fuente</span>}</td>
                </tr>
              );
            })}
            {visibles.length === 0 && (
              <tr><td colSpan="4" className="tabla-catalogo-vacia">No hay registros que coincidan con la búsqueda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablaCatalogo;
