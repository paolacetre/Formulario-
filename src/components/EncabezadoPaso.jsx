import { PASOS } from "./pasosSolicitud";

// Título de cada paso. Dentro de un <fieldset> va como <legend>; en la revisión, como <h2>.
function EncabezadoPaso({ numero, descripcion, comoTitulo = false, id }) {
  const contenido = (
    <>
      <span className="paso-numero">Paso {numero} de {PASOS.length}</span>
      <span className="paso-titulo">{PASOS[numero - 1].titulo}</span>
    </>
  );

  return (
    <>
      {comoTitulo ? <h2 id={id} className="paso-encabezado">{contenido}</h2> : <legend className="paso-encabezado">{contenido}</legend>}
      {descripcion && <p className="paso-descripcion">{descripcion}</p>}
    </>
  );
}

export default EncabezadoPaso;
