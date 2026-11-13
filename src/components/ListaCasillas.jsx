import { useEffect, useRef } from "react";
import { normalizarTexto } from "../services/catalogosCno";

// Para detectar repetidos se ignoran mayúsculas, tildes, espacios y signos de puntuación.
function claveComparacion(texto) {
  return normalizarTexto(texto).replace(/[^\p{L}\p{N} ]/gu, "").replace(/\s+/g, " ").trim();
}

function evitarEnvio(evento) {
  if (evento.key === "Enter") evento.preventDefault();
}

// Lista de casillas para escribir un elemento por casilla ("+ Agregar …" y papelera en cada una).
// Sin `campos`, cada elemento es un texto. Con `campos` ([{ clave, etiqueta, placeholder, corto }]),
// cada elemento es un objeto con esas claves (p. ej. código y nombre de una ocupación).
// Siempre muestra al menos una casilla.
function ListaCasillas({ id, elementos, onCambiar, singular, textoAgregar, placeholder, multilinea = false, campos }) {
  const conCampos = Boolean(campos);
  const vacio = conCampos ? Object.fromEntries(campos.map((campo) => [campo.clave, ""])) : "";
  const lista = elementos.length > 0 ? elementos : [vacio];
  const enfocarCasilla = useRef(null);

  const textoDe = (elemento) => (conCampos ? campos.map((campo) => elemento[campo.clave] ?? "").join(" ") : elemento);
  const estaVacio = (elemento) => !String(textoDe(elemento)).trim();

  // Marca las casillas que repiten un texto ya escrito más arriba.
  const vistos = new Set();
  const repetidas = lista.map((elemento) => {
    const normal = claveComparacion(textoDe(elemento));
    if (!normal) return false;
    if (vistos.has(normal)) return true;
    vistos.add(normal);
    return false;
  });

  useEffect(() => {
    if (enfocarCasilla.current === null) return;
    document.getElementById(`${id}-${enfocarCasilla.current}-0`)?.focus();
    enfocarCasilla.current = null;
  }, [id, lista.length]);

  const actualizar = (indice, valor) => onCambiar(lista.map((elemento, itemIndice) => (itemIndice === indice ? valor : elemento)));

  const agregar = () => {
    enfocarCasilla.current = lista.length;
    onCambiar([...lista, vacio]);
  };

  const quitar = (indice) => onCambiar(lista.filter((_, itemIndice) => itemIndice !== indice));

  // Enter en la última casilla con texto agrega una nueva; en las demás no envía el formulario.
  const manejarEnter = (evento, indice) => {
    evitarEnvio(evento);
    if (evento.key === "Enter" && indice === lista.length - 1 && !estaVacio(lista[indice])) agregar();
  };

  return (
    <div className="lista-casillas">
      {conCampos && (
        <div className="lista-casillas-columnas" aria-hidden="true">
          {campos.map((campo) => <span key={campo.clave} className={campo.corto ? "corto" : ""}>{campo.etiqueta}</span>)}
        </div>
      )}
      <ol className="lista-casillas-filas">
        {lista.map((elemento, indice) => (
          <li className={repetidas[indice] ? "lista-casillas-fila repetida" : "lista-casillas-fila"} key={indice}>
            <span className="paso-circulo" aria-hidden="true">{indice + 1}</span>
            <div className="lista-casillas-contenido">
              <div className="lista-casillas-campos">
                {conCampos
                  ? campos.map((campo, posicion) => (
                    <input
                      key={campo.clave}
                      id={`${id}-${indice}-${posicion}`}
                      className={campo.corto ? "corto" : ""}
                      value={elemento[campo.clave] ?? ""}
                      onChange={(evento) => actualizar(indice, { ...elemento, [campo.clave]: evento.target.value })}
                      onKeyDown={(evento) => manejarEnter(evento, indice)}
                      placeholder={campo.placeholder}
                      aria-label={`${campo.etiqueta} ${indice + 1}`}
                    />
                  ))
                  : multilinea
                    ? <textarea id={`${id}-${indice}-0`} rows="2" value={elemento} onChange={(evento) => actualizar(indice, evento.target.value)} placeholder={placeholder} aria-label={`${singular} ${indice + 1}`} />
                    : <input id={`${id}-${indice}-0`} value={elemento} onChange={(evento) => actualizar(indice, evento.target.value)} onKeyDown={(evento) => manejarEnter(evento, indice)} placeholder={placeholder} aria-label={`${singular} ${indice + 1}`} />}
              </div>
              {repetidas[indice] && (
                <p className="lista-casillas-aviso" role="status">
                  <span aria-hidden="true" className="material-icons-round">warning_amber</span>
                  Esta {singular} ya está en la lista.
                </p>
              )}
            </div>
            <button type="button" className="boton-icono boton-icono-quitar" onClick={() => quitar(indice)} disabled={lista.length === 1 && estaVacio(elemento)} aria-label={`Quitar ${singular} ${indice + 1}`} title="Quitar">
              <span aria-hidden="true" className="material-icons-round">delete_outline</span>
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="boton-crear-manual" onClick={agregar}>
        <span aria-hidden="true" className="material-icons-round">add</span>
        {textoAgregar}
      </button>
    </div>
  );
}

export default ListaCasillas;
