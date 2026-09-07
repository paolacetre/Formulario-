import { useState } from "react";
import TabsOcupacion from "./TabsOcupacion";

const pestañas = [
  { id: "general", titulo: "General" },
  { id: "funciones", titulo: "Funciones" },
  { id: "habilidades", titulo: "Habilidades" },
  { id: "conocimientos", titulo: "Conocimientos" },
  { id: "denominaciones", titulo: "Denominaciones" },
  { id: "relaciones", titulo: "Relaciones" },
];

function DetalleOcupacion({ ocupacion, onVolver }) {
  const [pestañaActiva, setPestañaActiva] = useState("general");

  const contenidoLista = (id, titulo, elementos) => {
    if (elementos.length === 0) {
      return (
        <section aria-labelledby={`${id}-titulo`}>
          <h2 id={`${id}-titulo`}>{titulo}</h2>
          <p className="detalle-sin-datos">No hay información disponible para esta ocupación.</p>
        </section>
      );
    }

    return (
      <section aria-labelledby={`${id}-titulo`}>
        <h2 id={`${id}-titulo`}>{titulo}</h2>
        <ul className="detalle-lista">
          {elementos.map((elemento, indice) => (
            <li key={typeof elemento === "string" ? elemento : `${elemento.codigo}-${indice}`}>
              {typeof elemento === "string" ? (
                elemento
              ) : (
                <>
                  {elemento.codigo && <strong>{elemento.codigo}</strong>}
                  <span>{elemento.descripcion}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    );
  };

  const contenidoPestaña = {
    general: (
      <section aria-labelledby="general-titulo">
        <h2 id="general-titulo">Información general</h2>
        <dl className="detalle-general">
          <div><dt>Código</dt><dd>{ocupacion.codigo}</dd></div>
          <div><dt>Nombre</dt><dd>{ocupacion.nombre}</dd></div>
          <div><dt>Clasificación</dt><dd>{ocupacion.clasificacion}</dd></div>
          <div><dt>Nivel</dt><dd>{ocupacion.nivel || "No disponible"}</dd></div>
          <div><dt>Área de desempeño</dt><dd>{ocupacion.areaDesempeno || "No disponible"}</dd></div>
          <div className="detalle-descripcion"><dt>Descripción</dt><dd>{ocupacion.descripcion}</dd></div>
        </dl>
      </section>
    ),
    funciones: contenidoLista("funciones", "Funciones", ocupacion.funciones),
    habilidades: contenidoLista("habilidades", "Habilidades", ocupacion.habilidades),
    conocimientos: contenidoLista("conocimientos", "Conocimientos", ocupacion.conocimientos),
    denominaciones: contenidoLista("denominaciones", "Denominaciones", ocupacion.denominaciones),
    relaciones: contenidoLista("relaciones", "Relaciones", ocupacion.relaciones),
  };

  return (
    <article className="detalle-card" aria-labelledby="detalle-titulo">
      <header className="detalle-cabecera">
        <button type="button" className="boton boton-secundario" onClick={onVolver}>
          Volver a resultados
        </button>
        <span className="etiqueta">DETALLE DE OCUPACIÓN</span>
        <h1 id="detalle-titulo">{ocupacion.nombre}</h1>
        <p>Información completa de la ocupación seleccionada.</p>
      </header>
      <TabsOcupacion
        pestañas={pestañas}
        pestañaActiva={pestañaActiva}
        onCambiar={setPestañaActiva}
      />
      <section
        className="detalle-contenido"
        id="panel-ocupacion"
        role="tabpanel"
        aria-labelledby={`tab-${pestañaActiva}`}
        tabIndex={0}
      >
        {contenidoPestaña[pestañaActiva]}
      </section>
    </article>
  );
}

export default DetalleOcupacion;
