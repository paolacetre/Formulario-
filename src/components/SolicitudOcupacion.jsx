import { useEffect, useState } from "react";
import { eliminarBorrador, guardarBorrador, obtenerBorrador } from "../services/formularioStorage";
import DatosGenerales from "./DatosGenerales";
import PropuestaOcupacion from "./PropuestaOcupacion";
import FuncionesPrincipales from "./FuncionesPrincipales";
import DenominacionesOcupacionales from "./DenominacionesOcupacionales";
import OcupacionesRelacionadas from "./OcupacionesRelacionadas";
import Habilidades from "./Habilidades";
import Conocimientos from "./Conocimientos";
import Justificacion from "./Justificacion";
import ProgresoFormulario from "./ProgresoFormulario";
import RevisionSolicitud from "./RevisionSolicitud";

const formularioInicial = {
  fecha: new Date().toISOString().slice(0, 10), nombreApellidos: "", documentoIdentidad: "", email: "", telefono: "",
  departamento: "", municipio: "", empresaEntidad: "", cargo: "", profesion: "", sector: "",
  nombreOcupacion: "", areaDesempeno: "", nivelCualificacion: "", descripcion: "", justificacion: "",
  funciones: ["", "", ""], denominaciones: ["", ""], ocupacionesRelacionadas: ["", ""], habilidades: [], conocimientos: [],
  otrasHabilidades: "", otrosConocimientos: "",
};

const ultimaSesion = 9;

function combinarFormulario(guardado) {
  return {
    ...formularioInicial,
    ...guardado,
    nombreApellidos: guardado.nombreApellidos || guardado.nombreCompleto || "",
    email: guardado.email || guardado.correo || "",
    funciones: guardado.funciones || formularioInicial.funciones,
    denominaciones: guardado.denominaciones || formularioInicial.denominaciones,
    ocupacionesRelacionadas: guardado.ocupacionesRelacionadas || formularioInicial.ocupacionesRelacionadas,
    habilidades: guardado.habilidades || [],
    conocimientos: guardado.conocimientos || [],
  };
}

function SolicitudOcupacion() {
  const [borradorInicial] = useState(obtenerBorrador);
  const [mostrarFormulario, setMostrarFormulario] = useState(() => Boolean(borradorInicial?.formulario));
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [formulario, setFormulario] = useState(() => borradorInicial?.formulario ? combinarFormulario(borradorInicial.formulario) : formularioInicial);
  const [currentStep, setCurrentStep] = useState(() => Math.min(Math.max(Number(borradorInicial?.currentStep) || 1, 1), ultimaSesion));
  const [completedSteps, setCompletedSteps] = useState(() => borradorInicial?.completedSteps || Array.from({ length: Math.max((Number(borradorInicial?.currentStep) || 1) - 1, 0) }, (_, indice) => indice + 1));
  const [error, setError] = useState("");
  const [guardado, setGuardado] = useState(Boolean(borradorInicial?.formulario));

  useEffect(() => {
    if (!mostrarFormulario || mostrarConfirmacion) return undefined;
    guardarBorrador(formulario, currentStep, completedSteps);
    return undefined;
  }, [formulario, currentStep, completedSteps, mostrarFormulario, mostrarConfirmacion]);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value, ...(name === "departamento" ? { municipio: "" } : {}) }));
    setGuardado(false);
    setError("");
  };

  const manejarLista = (nombre, indice, valor) => {
    setFormulario((actual) => ({ ...actual, [nombre]: actual[nombre].map((item, itemIndice) => itemIndice === indice ? valor : item) }));
    setGuardado(false);
    setError("");
  };

  const agregarElemento = (nombre) => {
    setFormulario((actual) => ({ ...actual, [nombre]: [...actual[nombre], ""] }));
    setGuardado(false);
  };

  const quitarElemento = (nombre, indice) => {
    setFormulario((actual) => ({ ...actual, [nombre]: actual[nombre].filter((_, itemIndice) => itemIndice !== indice) }));
    setGuardado(false);
  };

  const alternarCatalogo = (nombre, valor) => {
    setFormulario((actual) => ({ ...actual, [nombre]: actual[nombre].includes(valor) ? actual[nombre].filter((item) => item !== valor) : [...actual[nombre], valor] }));
    setGuardado(false);
  };

  const listaEditable = (nombre, tipo, texto, placeholder) => (
    <div className="lista-editable">
      {formulario[nombre].map((valor, indice) => (
        <div className="elemento-editable" key={`${nombre}-${indice}`}>
          <label className="sr-only" htmlFor={`${nombre}-${indice}`}>{texto} {indice + 1}</label>
          {tipo === "textarea" ? <textarea id={`${nombre}-${indice}`} name={`${nombre}-${indice}`} value={valor} onChange={(evento) => manejarLista(nombre, indice, evento.target.value)} rows="3" placeholder={placeholder} /> : <input id={`${nombre}-${indice}`} name={`${nombre}-${indice}`} value={valor} onChange={(evento) => manejarLista(nombre, indice, evento.target.value)} placeholder={placeholder} />}
          {formulario[nombre].length > 1 && <button type="button" className="boton-quitar" onClick={() => quitarElemento(nombre, indice)} aria-label={`Quitar ${texto.toLowerCase()} ${indice + 1}`}>×</button>}
        </div>
      ))}
      <button type="button" className="boton-agregar" onClick={() => agregarElemento(nombre)}>+ Agregar {texto.toLowerCase()}</button>
    </div>
  );

  const validarSesion = (evento) => {
    if (!evento.currentTarget.checkValidity()) {
      evento.currentTarget.reportValidity();
      setError("Complete los campos obligatorios de esta sesión antes de continuar.");
      return false;
    }
    return true;
  };

  const avanzar = (evento) => {
    evento.preventDefault();
    if (!validarSesion(evento)) return;
    const sesionesCompletadas = completedSteps.includes(currentStep) ? completedSteps : [...completedSteps, currentStep].sort((a, b) => a - b);
    guardarBorrador(formulario, currentStep, sesionesCompletadas);
    setCompletedSteps(sesionesCompletadas);
    setGuardado(true);
    setError("");
    setCurrentStep((actual) => Math.min(actual + 1, ultimaSesion));
  };

  const enviarSolicitud = (evento) => {
    evento.preventDefault();
    console.log("Solicitud de ocupación preparada:", formulario);
    eliminarBorrador();
    setMostrarConfirmacion(true);
    setMostrarFormulario(false);
  };

  const renderizarSesion = () => {
    if (currentStep === 1) return <DatosGenerales formulario={formulario} manejarCambio={manejarCambio} />;
    if (currentStep === 2) return <PropuestaOcupacion formulario={formulario} manejarCambio={manejarCambio} />;
    if (currentStep === 3) return <FuncionesPrincipales formulario={formulario} manejarLista={manejarLista} agregarElemento={agregarElemento} quitarElemento={quitarElemento} />;
    if (currentStep === 4) return <DenominacionesOcupacionales listaEditable={listaEditable} />;
    if (currentStep === 5) return <OcupacionesRelacionadas listaEditable={listaEditable} />;
    if (currentStep === 6) return <Habilidades formulario={formulario} alternarCatalogo={alternarCatalogo} manejarCambio={manejarCambio} />;
    if (currentStep === 7) return <Conocimientos formulario={formulario} alternarCatalogo={alternarCatalogo} manejarCambio={manejarCambio} />;
    if (currentStep === 8) return <Justificacion formulario={formulario} manejarCambio={manejarCambio} />;
    return <RevisionSolicitud formulario={formulario} />;
  };

  if (!mostrarFormulario) {
    return <main className="pagina"><section className="inicio-card"><div className="inicio-contenido"><span className="etiqueta">SOLICITUD</span><h1>{mostrarConfirmacion ? "Solicitud enviada correctamente" : "Creación de nueva ocupación"}</h1><p>{mostrarConfirmacion ? "La información quedó preparada para que posteriormente el servicio institucional pueda enviarla o notificarla." : "Solicite la creación de una nueva ocupación diligenciando la información requerida."}</p>{!mostrarConfirmacion && <button type="button" className="boton boton-principal" onClick={() => { setMostrarConfirmacion(false); setMostrarFormulario(true); }}>Solicitar nueva ocupación</button>}</div></section></main>;
  }

  return (
    <main className="pagina">
      <section className="formulario-card">
        <header className="formulario-header">
          <span className="etiqueta">PROPUESTA OCUPACIONAL</span>
          <h1>Propuesta de nuevo perfil ocupacional</h1>
          <p>Complete la solicitud por sesiones. Los datos se guardan automáticamente.</p>
          <ProgresoFormulario currentStep={currentStep} completedSteps={completedSteps} onStepChange={(paso) => { setCurrentStep(paso); setError(""); }} />
        </header>

        <form onSubmit={currentStep === ultimaSesion ? enviarSolicitud : avanzar} aria-describedby="indicacion-obligatorios">
          {currentStep === 1 && <p id="indicacion-obligatorios" className="referencia-formulario"><strong>Orientación:</strong> diligencie las casillas de propuesta con información clara y verificable. Los campos marcados con <span aria-hidden="true" className="obligatorio">*</span> son obligatorios.</p>}
          {renderizarSesion()}
          {error && <p className="error-formulario" role="alert">{error}</p>}
          {currentStep < ultimaSesion && <p className="estado-guardado" role="status">{guardado ? "✓ Información guardada" : "✓ Información guardada automáticamente"}</p>}
          <div className="acciones">
            <button type="button" className="boton boton-secundario" onClick={() => currentStep === 1 ? setMostrarFormulario(false) : setCurrentStep((actual) => actual - 1)}>{currentStep === 1 ? "Cancelar" : "Anterior"}</button>
            <button type="submit" className="boton boton-principal">{currentStep === ultimaSesion ? "Enviar solicitud" : currentStep === ultimaSesion - 1 ? "Revisar solicitud" : "Guardar y continuar"}</button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default SolicitudOcupacion;
