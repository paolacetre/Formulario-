import { useEffect, useRef } from "react";

// Diálogo modal para confirmar una acción que no se puede deshacer.
// Usa <dialog> con showModal(): el navegador bloquea el resto de la página, mantiene el foco dentro
// y lo cierra con Escape. El foco inicial queda en la opción segura (textoCancelar).
function DialogoConfirmacion({ id, abierto, icono = "warning_amber", titulo, texto, textoConfirmar, textoCancelar, onConfirmar, onCerrar }) {
  const dialogo = useRef(null);

  useEffect(() => {
    const elemento = dialogo.current;
    if (!elemento) return;
    if (abierto && !elemento.open) elemento.showModal();
    if (!abierto && elemento.open) elemento.close();
  }, [abierto]);

  return (
    <dialog ref={dialogo} className="dialogo" aria-labelledby={`${id}-titulo`} aria-describedby={`${id}-texto`} onClose={onCerrar}>
      <span aria-hidden="true" className="dialogo-icono material-icons-round">{icono}</span>
      <h2 id={`${id}-titulo`}>{titulo}</h2>
      <p id={`${id}-texto`}>{texto}</p>
      <div className="dialogo-acciones">
        <button type="button" className="boton boton-secundario" onClick={onCerrar} autoFocus>{textoCancelar}</button>
        <button type="button" className="boton boton-peligro" onClick={onConfirmar}>{textoConfirmar}</button>
      </div>
    </dialog>
  );
}

export default DialogoConfirmacion;
