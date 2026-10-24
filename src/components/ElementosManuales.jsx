import { useState } from "react";
import { normalizarTexto } from "../services/catalogosCno";
import FormularioManual from "./FormularioManual";
import TarjetaElemento from "./TarjetaElemento";

// Elementos creados manualmente junto a una tabla de catálogo (habilidades o conocimientos).
// Si el nombre ya existe en el catálogo, se marca en la tabla en lugar de duplicarlo.
function ElementosManuales({ id, singular, plural, femenino, catalogo, seleccionadosCatalogo, onSeleccionarCatalogo, manuales, onCambiar }) {
  const [aviso, setAviso] = useState("");
  const ese = femenino ? "Esa" : "Ese";
  const agregado = femenino ? "agregada" : "agregado";
  const seleccionado = femenino ? "seleccionada" : "seleccionado";

  const agregar = ({ nombre, descripcion = "" }) => {
    const normal = normalizarTexto(nombre);
    const delCatalogo = catalogo.find((elemento) => normalizarTexto(elemento.nombre) === normal);
    if (delCatalogo) {
      if (!seleccionadosCatalogo.includes(delCatalogo.codigo)) onSeleccionarCatalogo(delCatalogo.codigo);
      setAviso(`"${delCatalogo.nombre}" ya está en la tabla con el código ${delCatalogo.codigo} y quedó ${seleccionado}.`);
      return "";
    }
    if (manuales.some((elemento) => normalizarTexto(elemento.nombre) === normal)) return `${ese} ${singular} ya está ${agregado}.`;
    onCambiar([...manuales, { codigo: "", nombre, descripcion, ocupacion: null, manual: true }]);
    setAviso("");
    return "";
  };

  return (
    <div className="elementos-manuales">
      <p className="lista-catalogo-subtitulo">¿No está en la tabla? Agregue otr{femenino ? "as" : "os"} {plural}</p>
      <FormularioManual
        id={id}
        textoBoton={`Agregar otr${femenino ? "a" : "o"} ${singular}`}
        campos={[{ nombre: "nombre", etiqueta: `Nombre de${femenino ? " la" : "l"} ${singular}`, requerido: true }, { nombre: "descripcion", etiqueta: "Descripción", multilinea: true }]}
        onAgregar={agregar}
      />
      {aviso && <p className="aviso aviso-info" role="status"><span aria-hidden="true" className="material-icons">info</span>{aviso}</p>}
      {manuales.length > 0 && (
        <ul className="tarjetas-elementos" aria-label={`Otr${femenino ? "as" : "os"} ${plural} ${femenino ? "agregadas" : "agregados"}`}>
          {manuales.map((elemento, indice) => (
            <TarjetaElemento key={elemento.nombre} elemento={elemento} onQuitar={() => onCambiar(manuales.filter((_, itemIndice) => itemIndice !== indice))} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default ElementosManuales;
