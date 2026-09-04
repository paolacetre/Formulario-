import { useEffect, useState } from "react";
import {
  AREAS_DESEMPENO,
  DEPARTAMENTOS,
  HABILIDADES_CATALOGO,
  CONOCIMIENTOS_CATALOGO,
  MUNICIPIOS_POR_DEPARTAMENTO,
  NIVELES_CUALIFICACION,
  SECTORES,
} from "../data/instrumento3.models";

const formularioInicial = {
  fecha: new Date().toISOString().slice(0, 10), nombreCompleto: "", documentoIdentidad: "", correo: "", telefono: "",
  departamento: "", municipio: "", empresaEntidad: "", cargo: "", profesion: "", sector: "",
  nombreOcupacion: "", areaDesempeno: "", nivelCualificacion: "", descripcion: "", justificacion: "",
  funciones: ["", "", ""], denominaciones: ["", "", ""], ocupacionesRelacionadas: ["", ""], habilidades: [], conocimientos: [],
  otrasHabilidades: "", otrosConocimientos: "",
};

function SolicitudOcupacion() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const [formulario, setFormulario] = useState(formularioInicial);

  useEffect(() => {
    if (!mostrarConfirmacion) {
      return undefined;
    }

    const temporizador = setTimeout(() => {
      setMostrarConfirmacion(false);
    }, 20000);

    return () => clearTimeout(temporizador);
  }, [mostrarConfirmacion]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
      ...(name === "departamento" ? { municipio: "" } : {}),
    });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    console.log("Datos del formulario:", formulario);
    setFormulario({ ...formularioInicial, fecha: new Date().toISOString().slice(0, 10) });
    setMostrarConfirmacion(true);
  };

  const manejarLista = (nombre, indice, valor) => {
    setFormulario({ ...formulario, [nombre]: formulario[nombre].map((item, itemIndice) => itemIndice === indice ? valor : item) });
  };

  const agregarElemento = (nombre) => setFormulario({ ...formulario, [nombre]: [...formulario[nombre], ""] });
  const quitarElemento = (nombre, indice) => setFormulario({ ...formulario, [nombre]: formulario[nombre].filter((_, itemIndice) => itemIndice !== indice) });
  const alternarCatalogo = (nombre, valor) => setFormulario({ ...formulario, [nombre]: formulario[nombre].includes(valor) ? formulario[nombre].filter((item) => item !== valor) : [...formulario[nombre], valor] });

  const campo = (id, etiqueta, tipo = "text", placeholder = "", requerido = false) => (
    <div className="campo" key={id}>
      <label htmlFor={id}>{etiqueta} {requerido && <span className="obligatorio">*</span>}</label>
      <input id={id} name={id} type={tipo} value={formulario[id]} onChange={manejarCambio} placeholder={placeholder} required={requerido} />
    </div>
  );

  const campoSelect = (id, etiqueta, opciones, placeholder, requerido = false, deshabilitado = false) => (
    <div className="campo" key={id}>
      <label htmlFor={id}>{etiqueta} {requerido && <span className="obligatorio">*</span>}</label>
      <select id={id} name={id} value={formulario[id]} onChange={manejarCambio} required={requerido} disabled={deshabilitado}>
        <option value="">{placeholder}</option>
        {opciones.map((opcion) => <option value={opcion.value} key={opcion.value}>{opcion.label}</option>)}
      </select>
    </div>
  );

  const listaEditable = (nombre, tipo, texto, placeholder) => (
    <div className="lista-editable">
      {formulario[nombre].map((valor, indice) => (
        <div className="elemento-editable" key={`${nombre}-${indice}`}>
          {tipo === "textarea" ? <textarea value={valor} onChange={(e) => manejarLista(nombre, indice, e.target.value)} rows="3" placeholder={placeholder} /> : <input value={valor} onChange={(e) => manejarLista(nombre, indice, e.target.value)} placeholder={placeholder} />}
          {formulario[nombre].length > 1 && <button type="button" className="boton-quitar" onClick={() => quitarElemento(nombre, indice)} aria-label={`Quitar ${texto.toLowerCase()} ${indice + 1}`}>×</button>}
        </div>
      ))}
      <button type="button" className="boton-agregar" onClick={() => agregarElemento(nombre)}>+ Agregar {texto.toLowerCase()}</button>
    </div>
  );

  return (
    <main className="pagina">
      {!mostrarFormulario ? (
        <section className="inicio-card">
          <div className="inicio-contenido">
            <span className="etiqueta">SOLICITUD</span>

            <h1>Creación de nueva ocupación</h1>

            <p>
              Solicite la creación de una nueva ocupación diligenciando
              la información requerida.
            </p>

            <button
              type="button"
              className="boton boton-principal"
              onClick={() => {
                setMostrarConfirmacion(false);
                setMostrarFormulario(true);
              }}
            >
              Solicitar nueva ocupación
            </button>
          </div>
        </section>
      ) : (
        <section className="formulario-card">
          <header className="formulario-header">
            <span className="etiqueta">INSTRUMENTO 3 · PROPUESTA OCUPACIONAL</span>

            <h1>Propuesta de nuevo perfil ocupacional</h1>

            <p>
              Complete los datos generales y construya la propuesta de la nueva ocupación.
            </p>
          </header>

          <form onSubmit={manejarEnvio}>
            <section className="formulario-seccion">
              <div className="seccion-header">
                <h2>1. Datos generales</h2>
                <p>Información de la persona y entidad que presenta la propuesta.</p>
              </div>

              <div className="form-grid">
                {campo("fecha", "Fecha", "date")}
                {campo("nombreCompleto", "Nombre y apellidos", "text", "Ingrese nombre completo", true)}
                {campo("documentoIdentidad", "Documento de identidad", "text", "Número de documento")}
                {campo("correo", "Correo electrónico", "email", "correo@ejemplo.com", true)}
                {campo("telefono", "Teléfono de contacto", "tel", "3001234567")}
                {campo("empresaEntidad", "Empresa o entidad", "text", "Nombre de la entidad")}
                <div className="campo">
                  <label htmlFor="cargo"><span lang="es" translate="no">Cargo</span></label>
                  <input id="cargo" name="cargo" type="text" value={formulario.cargo} onChange={manejarCambio} placeholder="Cargo actual" />
                </div>
                {campo("profesion", "Profesión", "text", "Profesión o formación")}
                {campoSelect("departamento", "Departamento", DEPARTAMENTOS, "Seleccione departamento")}
                {campoSelect("municipio", "Municipio", MUNICIPIOS_POR_DEPARTAMENTO[formulario.departamento] || [], formulario.departamento ? "Seleccione municipio" : "Seleccione primero un departamento", false, !formulario.departamento)}
                {campoSelect("sector", "Sector", SECTORES, "Seleccione sector")}
              </div>
            </section>

            <div className="referencia-formulario"><strong>Orientación:</strong> diligencie las casillas de propuesta con información clara y verificable. Los campos marcados con <span className="obligatorio">*</span> son obligatorios.</div>

            <section className="formulario-seccion instrumento-seccion"><div className="seccion-header"><h2>2. Propuesta de ocupación</h2><p>Defina el perfil y el propósito de la nueva ocupación.</p></div><div className="form-grid">{campo("nombreOcupacion", "Nombre de la ocupación", "text", "Ejemplo: Analista de datos", true)}{campoSelect("areaDesempeno", "Área de desempeño", AREAS_DESEMPENO, "Seleccione área", true)}{campoSelect("nivelCualificacion", "Nivel de cualificación", NIVELES_CUALIFICACION, "Seleccione nivel", true)}<div className="campo campo-completo"><label htmlFor="descripcion">Descripción de la ocupación <span className="obligatorio">*</span></label><textarea id="descripcion" name="descripcion" value={formulario.descripcion} onChange={manejarCambio} rows="4" placeholder="Describa el propósito y alcance de la ocupación" required /></div></div></section>
            <section className="formulario-seccion instrumento-seccion"><div className="seccion-header"><h2>3. Funciones principales</h2><p>Describa las funciones más representativas del perfil.</p></div>{listaEditable("funciones", "textarea", "función", "Escriba una función principal")}</section>
            <section className="formulario-seccion instrumento-seccion"><div className="seccion-header"><h2>4. Denominaciones ocupacionales</h2><p>Agregue cargos o nombres equivalentes de esta ocupación.</p></div>{listaEditable("denominaciones", "input", "denominación", "Ejemplo: Coordinador de operaciones")}</section>
            <section className="formulario-seccion instrumento-seccion"><div className="seccion-header"><h2>5. Ocupaciones relacionadas</h2><p>Indique perfiles que tengan relación con la propuesta.</p></div>{listaEditable("ocupacionesRelacionadas", "input", "ocupación relacionada", "Nombre de ocupación relacionada")}</section>
            <section className="formulario-seccion instrumento-seccion"><div className="seccion-header"><h2>6. Habilidades</h2><p>Seleccione las habilidades más importantes para desempeñar las funciones.</p></div><div className="opciones-catalogo">{HABILIDADES_CATALOGO.map((habilidad) => <label className={`opcion-catalogo ${formulario.habilidades.includes(habilidad) ? "seleccionada" : ""}`} key={habilidad}><input type="checkbox" checked={formulario.habilidades.includes(habilidad)} onChange={() => alternarCatalogo("habilidades", habilidad)} />{habilidad}</label>)}</div><div className="campo campo-completo"><label htmlFor="otrasHabilidades">Otras habilidades</label><input id="otrasHabilidades" name="otrasHabilidades" value={formulario.otrasHabilidades} onChange={manejarCambio} placeholder="Sepárelas con un signo +" /></div></section>
            <section className="formulario-seccion instrumento-seccion"><div className="seccion-header"><h2>7. Conocimientos</h2><p>Seleccione los conocimientos necesarios para la ocupación.</p></div><div className="opciones-catalogo">{CONOCIMIENTOS_CATALOGO.map((conocimiento) => <label className={`opcion-catalogo ${formulario.conocimientos.includes(conocimiento) ? "seleccionada" : ""}`} key={conocimiento}><input type="checkbox" checked={formulario.conocimientos.includes(conocimiento)} onChange={() => alternarCatalogo("conocimientos", conocimiento)} />{conocimiento}</label>)}</div><div className="campo campo-completo"><label htmlFor="otrosConocimientos">Otros conocimientos</label><input id="otrosConocimientos" name="otrosConocimientos" value={formulario.otrosConocimientos} onChange={manejarCambio} placeholder="Sepárelos con un signo +" /></div></section>
            <section className="formulario-seccion instrumento-seccion"><div className="seccion-header"><h2>8. Justificación</h2><p>Explique la necesidad de crear esta ocupación.</p></div><div className="campo"><label htmlFor="justificacion">Justificación <span className="obligatorio">*</span></label><textarea id="justificacion" name="justificacion" value={formulario.justificacion} onChange={manejarCambio} rows="5" placeholder="Explique las razones de la solicitud" required /></div></section>

            {/* INFORMACIÓN DE CONTACTO */}
            <div className="informacion">
              <div className="informacion-icono">i</div>

              <div>
                <strong>¿Necesita más información?</strong>

                <p>
                  Para más información sobre esta solicitud, puede
                  escribir al correo{" "}
                  <strong>correo@ejemplo.com</strong>.
                </p>
              </div>
            </div>

            {/* BOTONES */}
            <div className="acciones">
              <button
                type="button"
                className="boton boton-secundario"
                onClick={() => {
                  setMostrarConfirmacion(false);
                  setMostrarFormulario(false);
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="boton boton-principal"
              >
                Enviar solicitud
              </button>
            </div>

            {mostrarConfirmacion && (
              <div className="mensaje-exito" role="status">
                <strong>Solicitud procesada correctamente.</strong>
                <span>
                  Los datos fueron capturados y están listos para su revisión.
                  Para más información, comunicarse al correo xxxx.
                </span>
              </div>
            )}
          </form>
        </section>
      )}
    </main>
  );
}

export default SolicitudOcupacion;