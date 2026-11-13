import { HABILIDADES_CATALOGO } from "../data/instrumento3.models";
import { INSTRUCTIVO_INSTRUMENTO_3 as INSTRUCTIVO } from "../data/instructivoInstrumento3";
import ElementosManuales from "./ElementosManuales";
import EncabezadoPaso from "./EncabezadoPaso";
import TablaCatalogo from "./TablaCatalogo";
import Tarjeta from "./Tarjeta";

function Habilidades({ formulario, alternarCatalogo, actualizarCampo }) {
  const total = formulario.habilidades.length + formulario.habilidadesManuales.length;
  return (
    <fieldset className="paso" tabIndex={-1}>
      <EncabezadoPaso numero={4} descripcion="Seleccione en la tabla las habilidades más importantes para desempeñar las funciones. Si falta alguna, agréguela al final." />
      <div className="tarjetas">
        <Tarjeta id="tarjeta-habilidades" icono="psychology" titulo="Habilidades" descripcion={INSTRUCTIVO.habilidades} resumen={`${total} en total`}>
          <TablaCatalogo id="habilidades" titulo="Catálogo de habilidades" columna="Habilidad" catalogo={HABILIDADES_CATALOGO} seleccionados={formulario.habilidades} onAlternar={(codigo) => alternarCatalogo("habilidades", codigo)} textoSeleccion="seleccionadas" />
          <ElementosManuales
            id="habilidadesManuales"
            singular="habilidad"
            plural="habilidades"
            femenino
            ayuda={INSTRUCTIVO.otrasHabilidades}
            catalogo={HABILIDADES_CATALOGO}
            seleccionadosCatalogo={formulario.habilidades}
            onSeleccionarCatalogo={(codigo) => alternarCatalogo("habilidades", codigo)}
            manuales={formulario.habilidadesManuales}
            onCambiar={(lista) => actualizarCampo("habilidadesManuales", lista)}
          />
        </Tarjeta>
      </div>
    </fieldset>
  );
}

export default Habilidades;
