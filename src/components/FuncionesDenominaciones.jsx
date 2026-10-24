import { useEffect, useState } from "react";
import { cargarCatalogosCno } from "../services/catalogosCno";
import EncabezadoPaso from "./EncabezadoPaso";
import ListaCatalogo from "./ListaCatalogo";
import Tarjeta from "./Tarjeta";

const secciones = [
  {
    campo: "funciones", catalogo: "funciones", icono: "checklist", titulo: "Funciones", singular: "función", plural: "funciones",
    descripcion: "Seleccione funciones del catálogo de la CNO o cree las que no estén en la lista.",
    placeholder: "Seleccione una función",
    camposManuales: [{ nombre: "nombre", etiqueta: "Descripción de la función", requerido: true, multilinea: true }],
  },
  {
    campo: "denominaciones", catalogo: "denominaciones", icono: "badge", titulo: "Denominaciones", singular: "denominación", plural: "denominaciones",
    descripcion: "Cargos o nombres equivalentes con los que se conoce la ocupación.",
    placeholder: "Seleccione una denominación",
    camposManuales: [{ nombre: "nombre", etiqueta: "Nombre de la denominación", requerido: true }, { nombre: "descripcion", etiqueta: "Descripción", multilinea: true }],
  },
  {
    campo: "ocupacionesRelacionadas", catalogo: "ocupaciones", icono: "hub", titulo: "Ocupaciones relacionadas", singular: "ocupación", plural: "ocupaciones",
    descripcion: "Ocupaciones de la CNO que tienen relación con la propuesta.",
    placeholder: "Seleccione una ocupación",
    camposManuales: [{ nombre: "nombre", etiqueta: "Nombre de la ocupación", requerido: true }, { nombre: "descripcion", etiqueta: "Descripción", multilinea: true }],
  },
];

function FuncionesDenominaciones({ formulario, actualizarCampo }) {
  const [catalogos, setCatalogos] = useState(null);
  const [errorCarga, setErrorCarga] = useState(false);

  useEffect(() => {
    let vigente = true;
    cargarCatalogosCno()
      .then((datos) => { if (vigente) setCatalogos(datos); })
      .catch((error) => {
        console.error("No se pudo cargar el catálogo de la CNO:", error);
        if (vigente) setErrorCarga(true);
      });
    return () => { vigente = false; };
  }, []);

  return (
    <fieldset className="paso">
      <EncabezadoPaso numero={3} descripcion="Seleccione registros del catálogo de la CNO o créelos manualmente. Cada uno se agrega al listado de su tarjeta." />
      <div className="tarjetas">
        {secciones.map((seccion) => {
          const cantidad = formulario[seccion.campo].length;
          return (
            <Tarjeta key={seccion.campo} id={`tarjeta-${seccion.campo}`} icono={seccion.icono} titulo={seccion.titulo} descripcion={seccion.descripcion} resumen={`${cantidad} ${cantidad === 1 ? "agregada" : "agregadas"}`}>
              <ListaCatalogo
                id={seccion.campo}
                opciones={catalogos?.[seccion.catalogo]}
                cargando={!catalogos && !errorCarga}
                errorCarga={errorCarga}
                seleccionados={formulario[seccion.campo]}
                onCambiar={(lista) => actualizarCampo(seccion.campo, lista)}
                singular={seccion.singular}
                plural={seccion.plural}
                placeholder={seccion.placeholder}
                camposManuales={seccion.camposManuales}
              />
            </Tarjeta>
          );
        })}
      </div>
    </fieldset>
  );
}

export default FuncionesDenominaciones;
