import { CONOCIMIENTOS_CATALOGO } from "../data/instrumento3.models";
import ElementosManuales from "./ElementosManuales";
import EncabezadoPaso from "./EncabezadoPaso";
import TablaCatalogo from "./TablaCatalogo";
import Tarjeta from "./Tarjeta";

function Conocimientos({ formulario, alternarCatalogo, actualizarCampo }) {
  const total = formulario.conocimientos.length + formulario.conocimientosManuales.length;
  return (
    <fieldset className="paso">
      <EncabezadoPaso numero={5} descripcion="Seleccione en la tabla los conocimientos necesarios para la ocupación. Si falta alguno, agréguelo al final." />
      <div className="tarjetas">
        <Tarjeta id="tarjeta-conocimientos" icono="school" titulo="Conocimientos" descripcion="Catálogo completo de conocimientos de la CNO con su código y descripción." resumen={`${total} en total`}>
          <TablaCatalogo id="conocimientos" titulo="Catálogo de conocimientos" columna="Conocimiento" catalogo={CONOCIMIENTOS_CATALOGO} seleccionados={formulario.conocimientos} onAlternar={(codigo) => alternarCatalogo("conocimientos", codigo)} textoSeleccion="seleccionados" />
          <ElementosManuales
            id="conocimientosManuales"
            singular="conocimiento"
            plural="conocimientos"
            catalogo={CONOCIMIENTOS_CATALOGO}
            seleccionadosCatalogo={formulario.conocimientos}
            onSeleccionarCatalogo={(codigo) => alternarCatalogo("conocimientos", codigo)}
            manuales={formulario.conocimientosManuales}
            onCambiar={(lista) => actualizarCampo("conocimientosManuales", lista)}
          />
        </Tarjeta>
      </div>
    </fieldset>
  );
}

export default Conocimientos;
