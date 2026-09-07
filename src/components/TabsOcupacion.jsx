import { useRef } from "react";

function TabsOcupacion({ pestañas, pestañaActiva, onCambiar }) {
  const referencias = useRef([]);

  const manejarTeclado = (evento, indice) => {
    const teclas = {
      ArrowRight: (indice + 1) % pestañas.length,
      ArrowLeft: (indice - 1 + pestañas.length) % pestañas.length,
      Home: 0,
      End: pestañas.length - 1,
    };
    const siguienteIndice = teclas[evento.key];

    if (siguienteIndice === undefined) {
      return;
    }

    evento.preventDefault();
    const siguientePestaña = pestañas[siguienteIndice];
    onCambiar(siguientePestaña.id);
    referencias.current[siguienteIndice]?.focus();
  };

  return (
    <div className="detalle-tabs" role="tablist" aria-label="Información de la ocupación">
      {pestañas.map((pestaña, indice) => (
        <button
          key={pestaña.id}
          id={`tab-${pestaña.id}`}
          type="button"
          role="tab"
          aria-selected={pestaña.id === pestañaActiva}
          aria-controls="panel-ocupacion"
          tabIndex={pestaña.id === pestañaActiva ? 0 : -1}
          className={pestaña.id === pestañaActiva ? "tab-activa" : ""}
          onClick={() => onCambiar(pestaña.id)}
          onKeyDown={(evento) => manejarTeclado(evento, indice)}
          ref={(elemento) => { referencias.current[indice] = elemento; }}
        >
          {pestaña.titulo}
        </button>
      ))}
    </div>
  );
}

export default TabsOcupacion;
