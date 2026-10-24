import { useEffect, useMemo, useRef, useState } from "react";
import { normalizarTexto } from "../services/catalogosCno";

function contenidoPorDefecto(opcion) {
  return (
    <>
      <span className="selector-buscable-opcion-titulo">{opcion.label}</span>
      {opcion.detalle && <small>{opcion.detalle}</small>}
    </>
  );
}

// Lista desplegable con buscador interno. opciones: [{ value, label, detalle?, clave? }].
// - textoTodas agrega una primera opción vacía (útil para filtros).
// - maximoVisible limita las opciones dibujadas en catálogos grandes; el buscador recorre todas.
// - renderOpcion y opcionDeshabilitada permiten personalizar cada opción.
function SelectorBuscable({
  id, etiqueta, icono, opciones, valor, onCambiar, textoTodas, placeholder = "Seleccione una opción",
  requerido = false, deshabilitado = false, maximoVisible = Infinity, renderOpcion = contenidoPorDefecto, opcionDeshabilitada,
}) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [activo, setActivo] = useState(0);
  const [invalido, setInvalido] = useState(false);
  const contenedor = useRef(null);
  const boton = useRef(null);
  const mostrarError = invalido && !valor;
  const seleccionada = opciones.find((opcion) => opcion.value === valor);

  const filtradas = useMemo(() => {
    if (!abierto) return [];
    const palabras = normalizarTexto(busqueda).split(" ").filter(Boolean);
    if (palabras.length === 0) return opciones;
    return opciones.filter((opcion) => {
      const texto = opcion.clave ?? normalizarTexto(`${opcion.value} ${opcion.label} ${opcion.detalle ?? ""}`);
      return palabras.every((palabra) => texto.includes(palabra));
    });
  }, [abierto, busqueda, opciones]);
  const conTodas = textoTodas && !busqueda.trim() ? [{ value: "", label: textoTodas }, ...filtradas] : filtradas;
  const lista = conTodas.slice(0, maximoVisible);
  const ocultas = conTodas.length - lista.length;

  useEffect(() => {
    if (!abierto) return undefined;
    const cerrarAlTocarFuera = (evento) => {
      if (!contenedor.current?.contains(evento.target)) setAbierto(false);
    };
    document.addEventListener("pointerdown", cerrarAlTocarFuera);
    return () => document.removeEventListener("pointerdown", cerrarAlTocarFuera);
  }, [abierto]);

  useEffect(() => {
    if (abierto) document.getElementById(`${id}-opcion-${activo}`)?.scrollIntoView({ block: "nearest" });
  }, [abierto, activo, id]);

  const abrir = () => {
    const todas = textoTodas ? [{ value: "" }, ...opciones] : opciones;
    setBusqueda("");
    setActivo(Math.min(Math.max(0, todas.findIndex((opcion) => opcion.value === valor)), maximoVisible - 1));
    setAbierto(true);
  };

  const cerrar = () => {
    setAbierto(false);
    boton.current?.focus();
  };

  const elegir = (opcion) => {
    if (opcionDeshabilitada?.(opcion)) return;
    onCambiar(opcion.value, opcion);
    cerrar();
  };

  const manejarTeclado = (evento) => {
    if (evento.key === "ArrowDown") {
      evento.preventDefault();
      setActivo((actual) => Math.min(actual + 1, lista.length - 1));
    } else if (evento.key === "ArrowUp") {
      evento.preventDefault();
      setActivo((actual) => Math.max(actual - 1, 0));
    } else if (evento.key === "Enter") {
      evento.preventDefault();
      if (lista[activo]) elegir(lista[activo]);
    } else if (evento.key === "Escape") {
      evento.preventDefault();
      cerrar();
    } else if (evento.key === "Tab") {
      setAbierto(false);
    }
  };

  return (
    <div className="selector-buscable" ref={contenedor}>
      <label id={`${id}-etiqueta`} htmlFor={id} className="filtro-etiqueta">
        {icono && <span aria-hidden="true" className="material-icons">{icono}</span>}
        {etiqueta}
        {requerido && <span aria-hidden="true" className="obligatorio">*</span>}
      </label>
      <button
        id={id}
        ref={boton}
        type="button"
        className={mostrarError ? "selector-buscable-boton invalido" : "selector-buscable-boton"}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-controls={abierto ? `${id}-lista` : undefined}
        aria-invalid={mostrarError || undefined}
        aria-describedby={mostrarError ? `${id}-error` : undefined}
        disabled={deshabilitado}
        onClick={() => (abierto ? setAbierto(false) : abrir())}
        onKeyDown={(evento) => {
          if (!abierto && (evento.key === "ArrowDown" || evento.key === "ArrowUp")) {
            evento.preventDefault();
            abrir();
          }
        }}
      >
        <span className={seleccionada ? "" : "selector-buscable-vacio"}>{seleccionada ? seleccionada.label : textoTodas || placeholder}</span>
        <span aria-hidden="true" className="material-icons">expand_more</span>
      </button>
      {/* Campo oculto para que el formulario siga validando los obligatorios con checkValidity.
          El aviso se muestra junto al selector en lugar de la burbuja del navegador. */}
      {requerido && (
        <input
          className="selector-buscable-validacion"
          tabIndex={-1}
          aria-hidden="true"
          required
          value={valor}
          onChange={() => {}}
          onInvalid={(evento) => {
            evento.preventDefault();
            setInvalido(true);
            const primerInvalido = evento.target.form?.querySelector("input:invalid, textarea:invalid, select:invalid");
            if (primerInvalido === evento.target) boton.current?.focus();
          }}
        />
      )}
      {mostrarError && <p id={`${id}-error`} className="selector-buscable-error">Seleccione una opción de {etiqueta.toLowerCase()}.</p>}

      {abierto && (
        <div className="selector-buscable-panel">
          <input
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${id}-lista`}
            aria-activedescendant={lista[activo] ? `${id}-opcion-${activo}` : undefined}
            aria-label={`Buscar en ${etiqueta.toLowerCase()}`}
            autoFocus
            autoComplete="off"
            value={busqueda}
            onChange={(evento) => { setBusqueda(evento.target.value); setActivo(0); }}
            onKeyDown={manejarTeclado}
            placeholder="Buscar..."
          />
          <ul id={`${id}-lista`} role="listbox" aria-labelledby={`${id}-etiqueta`}>
            {lista.map((opcion, indice) => {
              const bloqueada = Boolean(opcionDeshabilitada?.(opcion));
              return (
                <li
                  key={opcion.value || "todas"}
                  id={`${id}-opcion-${indice}`}
                  role="option"
                  aria-selected={opcion.value === valor}
                  aria-disabled={bloqueada || undefined}
                  className={[indice === activo && "activa", opcion.value === valor && "elegida", !opcion.value && "todas", bloqueada && "bloqueada"].filter(Boolean).join(" ")}
                  onPointerDown={(evento) => evento.preventDefault()}
                  onMouseEnter={() => setActivo(indice)}
                  onClick={() => elegir(opcion)}
                >
                  {opcion.value ? renderOpcion(opcion, { bloqueada }) : <span>{opcion.label}</span>}
                </li>
              );
            })}
            {lista.length === 0 && <li className="selector-buscable-sin-resultados">Sin coincidencias</li>}
          </ul>
          {ocultas > 0 && (
            <p className="selector-buscable-pie">
              Mostrando {lista.length} de {conTodas.length.toLocaleString("es-CO")}. Escriba para precisar la búsqueda.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SelectorBuscable;
