import { useState } from "react";

// Formulario en línea para crear un elemento que no está en el catálogo.
// campos: [{ nombre, etiqueta, requerido?, multilinea? }]. onAgregar devuelve un mensaje de error o "".
// No usa el atributo required para no bloquear el envío del paso cuando queda abierto y vacío.
function FormularioManual({ id, textoBoton, campos, onAgregar }) {
  const [abierto, setAbierto] = useState(false);
  const [valores, setValores] = useState({});
  const [error, setError] = useState("");

  const cerrar = () => {
    setAbierto(false);
    setValores({});
    setError("");
  };

  const agregar = () => {
    const limpios = Object.fromEntries(campos.map((campo) => [campo.nombre, (valores[campo.nombre] ?? "").trim().replace(/\s+/g, " ")]));
    const faltante = campos.find((campo) => campo.requerido && !limpios[campo.nombre]);
    if (faltante) {
      setError(`Escriba ${faltante.etiqueta.toLowerCase()}.`);
      return;
    }
    const mensaje = onAgregar(limpios);
    if (mensaje) {
      setError(mensaje);
      return;
    }
    cerrar();
  };

  if (!abierto) {
    return (
      <button type="button" className="boton-crear-manual" onClick={() => setAbierto(true)}>
        <span aria-hidden="true" className="material-icons">add</span>
        {textoBoton}
      </button>
    );
  }

  return (
    <div className="formulario-manual" role="group" aria-labelledby={`${id}-titulo`}>
      <p id={`${id}-titulo`} className="formulario-manual-titulo">{textoBoton}</p>
      {campos.map((campo, indice) => {
        const propiedades = {
          id: `${id}-${campo.nombre}`,
          value: valores[campo.nombre] ?? "",
          onChange: (evento) => { setValores((actuales) => ({ ...actuales, [campo.nombre]: evento.target.value })); setError(""); },
          autoFocus: indice === 0,
          "aria-describedby": error ? `${id}-error` : undefined,
        };
        return (
          <div className="campo" key={campo.nombre}>
            <label htmlFor={propiedades.id}>
              {campo.etiqueta} {campo.requerido && <span aria-hidden="true" className="obligatorio">*</span>}
            </label>
            {campo.multilinea
              ? <textarea {...propiedades} rows="3" />
              : <input {...propiedades} onKeyDown={(evento) => { if (evento.key === "Enter") { evento.preventDefault(); agregar(); } }} />}
          </div>
        );
      })}
      {error && <p id={`${id}-error`} className="formulario-manual-error" role="alert">{error}</p>}
      <div className="formulario-manual-acciones">
        <button type="button" className="boton boton-secundario" onClick={cerrar}>Cancelar</button>
        <button type="button" className="boton boton-principal" onClick={agregar}>Agregar</button>
      </div>
    </div>
  );
}

export default FormularioManual;
