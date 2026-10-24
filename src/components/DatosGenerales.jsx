import {
  DEPARTAMENTOS,
  MUNICIPIOS_POR_DEPARTAMENTO,
  SECTORES,
} from "../data/instrumento3.models";
import EncabezadoPaso from "./EncabezadoPaso";
import SelectorBuscable from "./SelectorBuscable";
import Tarjeta from "./Tarjeta";

function Campo({ id, etiqueta, tipo = "text", placeholder = "", valor, onChange, requerido = false }) {
  return (
    <div className="campo">
      <label htmlFor={id}>
        {etiqueta} {requerido && <span aria-hidden="true" className="obligatorio">*</span>}
      </label>
      <input id={id} name={id} type={tipo} value={valor} onChange={onChange} placeholder={placeholder} required={requerido} />
    </div>
  );
}

function DatosGenerales({ formulario, manejarCambio, actualizarCampo }) {
  const municipios = MUNICIPIOS_POR_DEPARTAMENTO[formulario.departamento] || [];

  // Al cambiar de departamento, el municipio elegido deja de ser válido.
  const cambiarDepartamento = (departamento) => {
    if (departamento === formulario.departamento) return;
    actualizarCampo("departamento", departamento);
    actualizarCampo("municipio", "");
  };

  return (
    <fieldset className="paso">
      <EncabezadoPaso numero={1} descripcion="Información de la persona y la entidad que presenta la propuesta." />

      <div className="tarjetas">
        <Tarjeta id="tarjeta-solicitante" icono="person" titulo="Datos del solicitante" descripcion="Persona y entidad que presenta la propuesta.">
          <div className="form-grid">
            <Campo id="fecha" etiqueta="Fecha" tipo="date" valor={formulario.fecha} onChange={manejarCambio} />
            <Campo id="nombreApellidos" etiqueta="Nombre y apellidos" placeholder="Ingrese nombre completo" valor={formulario.nombreApellidos} onChange={manejarCambio} requerido />
            <Campo id="documentoIdentidad" etiqueta="Documento de identidad" placeholder="Número de documento" valor={formulario.documentoIdentidad} onChange={manejarCambio} />
            <Campo id="email" etiqueta="Correo electrónico" tipo="email" placeholder="correo@ejemplo.com" valor={formulario.email} onChange={manejarCambio} requerido />
            <Campo id="telefono" etiqueta="Teléfono de contacto" tipo="tel" placeholder="3001234567" valor={formulario.telefono} onChange={manejarCambio} />
            <Campo id="empresaEntidad" etiqueta="Empresa o entidad" placeholder="Nombre de la entidad" valor={formulario.empresaEntidad} onChange={manejarCambio} />
            <Campo id="cargo" etiqueta="Cargo" placeholder="Cargo actual" valor={formulario.cargo} onChange={manejarCambio} />
          </div>
        </Tarjeta>
        <Tarjeta id="tarjeta-ubicacion" icono="location_on" titulo="Ubicación y sector" descripcion="Lugar desde donde se presenta la solicitud y sector al que pertenece.">
          <div className="form-grid">
            <div className="campo">
              <SelectorBuscable id="departamento" etiqueta="Departamento" icono="map" opciones={DEPARTAMENTOS} valor={formulario.departamento} onCambiar={cambiarDepartamento} placeholder="Seleccione departamento" />
            </div>
            <div className="campo">
              <SelectorBuscable id="municipio" etiqueta="Municipio" icono="location_city" opciones={municipios} valor={formulario.municipio} onCambiar={(municipio) => actualizarCampo("municipio", municipio)} placeholder={formulario.departamento ? "Seleccione municipio" : "Seleccione primero un departamento"} deshabilitado={!formulario.departamento} />
            </div>
            <div className="campo">
              <SelectorBuscable id="sector" etiqueta="Sector" icono="business" opciones={SECTORES} valor={formulario.sector} onCambiar={(sector) => actualizarCampo("sector", sector)} placeholder="Seleccione sector" />
            </div>
          </div>
        </Tarjeta>
      </div>
    </fieldset>
  );
}

export default DatosGenerales;
