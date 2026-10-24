import { useState } from "react";
import { normalizarTexto } from "../services/catalogosCno";
import FormularioManual from "./FormularioManual";
import SelectorBuscable from "./SelectorBuscable";
import TarjetaElemento from "./TarjetaElemento";

function contenidoOpcion(opcion, { bloqueada }) {
  return (
    <>
      <span className="opcion-catalogo-cabecera">
        <span className="codigo-cno">{opcion.value}</span>
        {bloqueada && <span className="insignia-agregada">Agregada</span>}
      </span>
      <span className="selector-buscable-opcion-titulo">{opcion.label}</span>
      {opcion.detalle && <small>{opcion.detalle}</small>}
      {opcion.ocupacion && <small className="opcion-catalogo-ocupacion">Ocupación CNO {opcion.ocupacion.codigo} · {opcion.ocupacion.nombre}</small>}
    </>
  );
}

// Selección desde el catálogo de la CNO más registro manual. Cada elemento agregado se muestra como tarjeta.
function ListaCatalogo({ id, opciones = [], cargando, errorCarga, seleccionados, onCambiar, singular, plural, placeholder, camposManuales }) {
  const [aviso, setAviso] = useState("");
  const nombresAgregados = new Set(seleccionados.map((elemento) => normalizarTexto(elemento.nombre)));
  const estaAgregada = (opcion) => seleccionados.some((elemento) => elemento.codigo === opcion.value) || nombresAgregados.has(opcion.normal);
  const Plural = plural.charAt(0).toUpperCase() + plural.slice(1);

  const desdeOpcion = (opcion) => ({ codigo: opcion.value, nombre: opcion.label, descripcion: opcion.detalle ?? "", ocupacion: opcion.ocupacion ?? null, manual: false });

  const agregarDelCatalogo = (_, opcion) => {
    onCambiar([...seleccionados, desdeOpcion(opcion)]);
    setAviso("");
  };

  const agregarManual = ({ nombre, descripcion = "" }) => {
    const normal = normalizarTexto(nombre);
    if (nombresAgregados.has(normal)) return `Esa ${singular} ya está agregada.`;
    const delCatalogo = opciones.find((opcion) => opcion.normal === normal);
    if (delCatalogo) {
      onCambiar([...seleccionados, desdeOpcion(delCatalogo)]);
      setAviso(`"${delCatalogo.label}" ya existe en el catálogo de la CNO; se agregó con el código ${delCatalogo.value}.`);
      return "";
    }
    onCambiar([...seleccionados, { codigo: "", nombre, descripcion, ocupacion: null, manual: true }]);
    setAviso("");
    return "";
  };

  return (
    <div className="lista-catalogo">
      <SelectorBuscable
        id={`${id}-catalogo`}
        etiqueta={`Catálogo de ${plural} de la CNO`}
        icono="search"
        opciones={opciones}
        valor=""
        onCambiar={agregarDelCatalogo}
        placeholder={cargando ? "Cargando catálogo de la CNO…" : errorCarga ? "No fue posible cargar el catálogo" : placeholder}
        deshabilitado={cargando || errorCarga}
        maximoVisible={60}
        renderOpcion={contenidoOpcion}
        opcionDeshabilitada={estaAgregada}
      />
      {errorCarga && <p className="aviso aviso-error" role="alert"><span aria-hidden="true" className="material-icons">error_outline</span>No fue posible cargar el catálogo. Puede crear {plural} manualmente.</p>}
      {aviso && <p className="aviso aviso-info" role="status"><span aria-hidden="true" className="material-icons">info</span>{aviso}</p>}

      <FormularioManual id={`${id}-manual`} textoBoton={`Crear ${singular} manualmente`} campos={camposManuales} onAgregar={agregarManual} />

      <div className="lista-catalogo-agregados">
        <p className="lista-catalogo-subtitulo">{Plural} agregadas ({seleccionados.length})</p>
        {seleccionados.length === 0
          ? (
            <div className="estado-vacio">
              <span aria-hidden="true" className="estado-vacio-icono material-icons">playlist_add</span>
              <strong>Aún no ha agregado {plural}</strong>
              <p>Selecciónelas en el catálogo de arriba o créelas manualmente.</p>
            </div>
          )
          : (
            <ul className="tarjetas-elementos" aria-label={`${Plural} agregadas`}>
              {seleccionados.map((elemento, indice) => (
                <TarjetaElemento key={`${elemento.codigo || "manual"}-${elemento.nombre}`} elemento={elemento} onQuitar={() => onCambiar(seleccionados.filter((_, itemIndice) => itemIndice !== indice))} />
              ))}
            </ul>
          )}
      </div>
    </div>
  );
}

export default ListaCatalogo;
