import { INSTRUCTIVO_INSTRUMENTO_3 as INSTRUCTIVO } from "../data/instructivoInstrumento3";
import EncabezadoPaso from "./EncabezadoPaso";
import ListaCasillas from "./ListaCasillas";
import Tarjeta from "./Tarjeta";

// funciones y denominaciones: textos; ocupacionesRelacionadas: [{ codigo, nombre }] ("Cod Ocupación - Nombre Ocupación").
const secciones = [
  {
    campo: "funciones", icono: "checklist", titulo: "Funciones", descripcion: INSTRUCTIVO.funciones,
    singular: "función", textoAgregar: "Agregar función", multilinea: true,
    placeholder: "Ejemplo: Planear y supervisar las operaciones de cubierta y navegación del buque",
  },
  {
    campo: "denominaciones", icono: "badge", titulo: "Denominaciones", descripcion: INSTRUCTIVO.denominaciones,
    singular: "denominación", textoAgregar: "Agregar denominación",
    placeholder: "Ejemplo: Capitán de buque",
  },
  {
    campo: "ocupacionesRelacionadas", icono: "hub", titulo: "Ocupaciones relacionadas", descripcion: INSTRUCTIVO.ocupacionesRelacionadas,
    singular: "ocupación", textoAgregar: "Agregar ocupación",
    campos: [
      { clave: "codigo", etiqueta: "Código", placeholder: "Ej. 2274", corto: true },
      { clave: "nombre", etiqueta: "Nombre de la ocupación", placeholder: "Ej. Oficiales de máquinas" },
    ],
  },
];

function cantidadEscrita(elementos) {
  return elementos.filter((elemento) => (typeof elemento === "string" ? elemento : `${elemento.codigo ?? ""}${elemento.nombre ?? ""}`).trim()).length;
}

function FuncionesDenominaciones({ formulario, actualizarCampo }) {
  return (
    <fieldset className="paso" tabIndex={-1}>
      <EncabezadoPaso numero={3} descripcion="Escriba cada elemento en su propia casilla. Use el botón Agregar para sumar casillas y la papelera para quitarlas." />
      <div className="tarjetas">
        {secciones.map((seccion) => {
          const cantidad = cantidadEscrita(formulario[seccion.campo]);
          return (
            <Tarjeta key={seccion.campo} id={`tarjeta-${seccion.campo}`} icono={seccion.icono} titulo={seccion.titulo} descripcion={seccion.descripcion} resumen={`${cantidad} ${cantidad === 1 ? "registrada" : "registradas"}`}>
              <ListaCasillas
                id={seccion.campo}
                elementos={formulario[seccion.campo]}
                onCambiar={(lista) => actualizarCampo(seccion.campo, lista)}
                singular={seccion.singular}
                textoAgregar={seccion.textoAgregar}
                placeholder={seccion.placeholder}
                multilinea={seccion.multilinea}
                campos={seccion.campos}
              />
            </Tarjeta>
          );
        })}
      </div>
    </fieldset>
  );
}

export default FuncionesDenominaciones;
