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

  const contenidoLista = (elementos) => {
    if (elementos.length === 0) {
      return <p className="detalle-sin-datos">No hay información disponible para esta ocupación.</p>;
    }

    return (
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
    );
  };

  const contenidoPestaña = {
    general: (
      <div className="detalle-general">
        <div><span>Código</span><strong>{ocupacion.codigo}</strong></div>
        <div><span>Nombre</span><strong>{ocupacion.nombre}</strong></div>
        <div><span>Clasificación</span><strong>{ocupacion.clasificacion}</strong></div>
        <div><span>Nivel</span><strong>{ocupacion.nivel || "No disponible"}</strong></div>
        <div><span>Área de desempeño</span><strong>{ocupacion.areaDesempeno || "No disponible"}</strong></div>
        <div className="detalle-descripcion"><span>Descripción</span><p>{ocupacion.descripcion}</p></div>
      </div>
    ),
    funciones: contenidoLista(ocupacion.funciones),
    habilidades: contenidoLista(ocupacion.habilidades),
    conocimientos: contenidoLista(ocupacion.conocimientos),
    denominaciones: contenidoLista(ocupacion.denominaciones),
    relaciones: contenidoLista(ocupacion.relaciones),
  };

  return (
    <section className="detalle-card" aria-labelledby="detalle-titulo">
      <div className="detalle-cabecera">
        <button type="button" className="boton boton-secundario" onClick={onVolver}>
          Volver a resultados
        </button>
        <span className="etiqueta">DETALLE DE OCUPACIÓN</span>
        <h1 id="detalle-titulo">{ocupacion.nombre}</h1>
        <p>Información completa de la ocupación seleccionada.</p>
      </div>
      <TabsOcupacion
        pestañas={pestañas}
        pestañaActiva={pestañaActiva}
        onCambiar={setPestañaActiva}
      />
      <div className="detalle-contenido" role="tabpanel">
        {contenidoPestaña[pestañaActiva]}
      </div>
    </section>
  );
}

export default DetalleOcupacion;
