import { useEffect, useState } from "react";
import { CONOCIMIENTOS_CATALOGO, HABILIDADES_CATALOGO } from "../data/instrumento3.models";
import { normalizarTexto } from "../services/catalogosCno";
import { generarRadicado } from "../services/fichaSolicitud";
import { eliminarBorrador, guardarBorrador, obtenerBorrador } from "../services/formularioStorage";
import ConfirmacionSolicitud from "./ConfirmacionSolicitud";
import DatosGenerales from "./DatosGenerales";
import PropuestaOcupacion from "./PropuestaOcupacion";
import FuncionesDenominaciones from "./FuncionesDenominaciones";
import Habilidades from "./Habilidades";
import Conocimientos from "./Conocimientos";
import Justificacion from "./Justificacion";
import { PASOS } from "./pasosSolicitud";
import ProgresoFormulario from "./ProgresoFormulario";
import RevisionSolicitud from "./RevisionSolicitud";
import "./SolicitudOcupacion.css";

// Cambia cuando los catálogos de área, nivel, habilidades o conocimientos cambian de origen.
const VERSION_CATALOGO = "CNO 2026";

// funciones, denominaciones, ocupacionesRelacionadas, habilidadesManuales y conocimientosManuales:
// [{ codigo, nombre, descripcion, ocupacion, manual }]. habilidades y conocimientos: códigos del catálogo.
const formularioInicial = {
  versionCatalogo: VERSION_CATALOGO,
  fecha: new Date().toISOString().slice(0, 10), nombreApellidos: "", documentoIdentidad: "", email: "", telefono: "",
  departamento: "", municipio: "", empresaEntidad: "", cargo: "", sector: "",
  nombreOcupacion: "", areaDesempeno: "", nivelCualificacion: "", descripcion: "", justificacion: "",
  funciones: [], denominaciones: [], ocupacionesRelacionadas: [], habilidades: [], conocimientos: [],
  habilidadesManuales: [], conocimientosManuales: [],
};

const ultimaSesion = 7;

function esBorradorAnterior(borrador) {
  return Boolean(borrador?.formulario) && borrador.formulario.versionCatalogo !== VERSION_CATALOGO;
}

function codigosDelCatalogo(catalogo, valores) {
  return (Array.isArray(valores) ? valores : [])
    .map((valor) => catalogo.find((elemento) => elemento.codigo === valor || normalizarTexto(elemento.nombre) === normalizarTexto(valor))?.codigo)
    .filter(Boolean);
}

// Acepta también el formato anterior { codigo, texto, manual }.
function listaDeElementos(valor) {
  return (Array.isArray(valor) ? valor : [])
    .filter((elemento) => typeof (elemento?.nombre ?? elemento?.texto) === "string")
    .map((elemento) => ({ codigo: elemento.codigo ?? "", nombre: elemento.nombre ?? elemento.texto, descripcion: elemento.descripcion ?? "", ocupacion: elemento.ocupacion ?? null, manual: Boolean(elemento.manual) }));
}

// Los campos de texto anteriores "Otras habilidades" y "Otros conocimientos" separaban los valores con "+".
function manualesDesdeTexto(texto) {
  return String(texto ?? "").split("+").map((nombre) => nombre.trim()).filter(Boolean)
    .map((nombre) => ({ codigo: "", nombre, descripcion: "", ocupacion: null, manual: true }));
}

function combinarFormulario(guardado) {
  const { funcionesDenominaciones, otrasHabilidades, otrosConocimientos, ...resto } = guardado;
  const mismaVersion = guardado.versionCatalogo === VERSION_CATALOGO;
  const funciones = listaDeElementos(guardado.funciones);

  return {
    ...formularioInicial,
    ...resto,
    versionCatalogo: VERSION_CATALOGO,
    nombreApellidos: guardado.nombreApellidos || guardado.nombreCompleto || "",
    email: guardado.email || guardado.correo || "",
    // Los borradores anteriores usaban otras listas de área y nivel: se deben elegir de nuevo.
    areaDesempeno: mismaVersion ? guardado.areaDesempeno || "" : "",
    nivelCualificacion: mismaVersion ? guardado.nivelCualificacion || "" : "",
    // El campo abierto anterior se conserva como una función registrada manualmente.
    funciones: funciones.length > 0 || !funcionesDenominaciones?.trim() ? funciones : [{ codigo: "", nombre: funcionesDenominaciones.trim(), descripcion: "", ocupacion: null, manual: true }],
    denominaciones: listaDeElementos(guardado.denominaciones),
    ocupacionesRelacionadas: listaDeElementos(guardado.ocupacionesRelacionadas),
    habilidades: codigosDelCatalogo(HABILIDADES_CATALOGO, guardado.habilidades),
    conocimientos: codigosDelCatalogo(CONOCIMIENTOS_CATALOGO, guardado.conocimientos),
    habilidadesManuales: [...listaDeElementos(guardado.habilidadesManuales), ...manualesDesdeTexto(otrasHabilidades)],
    conocimientosManuales: [...listaDeElementos(guardado.conocimientosManuales), ...manualesDesdeTexto(otrosConocimientos)],
  };
}

function SolicitudOcupacion() {
  const [borradorInicial] = useState(obtenerBorrador);
  const [mostrarFormulario, setMostrarFormulario] = useState(() => Boolean(borradorInicial?.formulario));
  const [solicitudRadicada, setSolicitudRadicada] = useState(null);
  const [formulario, setFormulario] = useState(() => borradorInicial?.formulario ? combinarFormulario(borradorInicial.formulario) : formularioInicial);
  // Un borrador anterior vuelve al paso 2 para elegir de nuevo el área y el nivel.
  const [currentStep, setCurrentStep] = useState(() => Math.min(Math.max(Number(borradorInicial?.currentStep) || 1, 1), esBorradorAnterior(borradorInicial) ? 2 : ultimaSesion));
  const [completedSteps, setCompletedSteps] = useState(() => {
    const completadas = borradorInicial?.completedSteps || Array.from({ length: Math.max((Number(borradorInicial?.currentStep) || 1) - 1, 0) }, (_, indice) => indice + 1);
    return esBorradorAnterior(borradorInicial) ? completadas.filter((paso) => paso < 2) : completadas;
  });
  const [error, setError] = useState("");
  const [guardado, setGuardado] = useState(Boolean(borradorInicial?.formulario));
  // Los archivos no se pueden guardar en localStorage, por eso viven fuera del borrador.
  const [adjuntos, setAdjuntos] = useState([]);

  useEffect(() => {
    if (!mostrarFormulario || solicitudRadicada) return undefined;
    guardarBorrador(formulario, currentStep, completedSteps);
    return undefined;
  }, [formulario, currentStep, completedSteps, mostrarFormulario, solicitudRadicada]);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
    setGuardado(false);
    setError("");
  };

  const actualizarCampo = (nombre, valor) => {
    setFormulario((actual) => ({ ...actual, [nombre]: valor }));
    setGuardado(false);
    setError("");
  };

  const alternarCatalogo = (nombre, valor) => {
    setFormulario((actual) => ({ ...actual, [nombre]: actual[nombre].includes(valor) ? actual[nombre].filter((item) => item !== valor) : [...actual[nombre], valor] }));
    setGuardado(false);
  };

  const agregarAdjuntos = (archivos) => {
    setAdjuntos((actuales) => [...actuales, ...archivos.filter((archivo) => !actuales.some((actual) => actual.name === archivo.name && actual.size === archivo.size))]);
  };

  const quitarAdjunto = (indice) => {
    setAdjuntos((actuales) => actuales.filter((_, itemIndice) => itemIndice !== indice));
  };

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
    irAPaso(Math.min(currentStep + 1, ultimaSesion));
  };

  // Al cambiar de paso se vuelve al inicio de la página para empezar a leerlo desde arriba.
  const irAPaso = (paso) => {
    setCurrentStep(paso);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const enviarSolicitud = (evento) => {
    evento.preventDefault();
    const solicitud = { radicado: generarRadicado(), formulario, adjuntos };
    console.log("Solicitud de ocupación preparada:", solicitud);
    eliminarBorrador();
    setSolicitudRadicada(solicitud);
    setMostrarFormulario(false);
    window.scrollTo({ top: 0 });
  };

  const renderizarSesion = () => {
    if (currentStep === 1) return <DatosGenerales formulario={formulario} manejarCambio={manejarCambio} actualizarCampo={actualizarCampo} />;
    if (currentStep === 2) return <PropuestaOcupacion formulario={formulario} manejarCambio={manejarCambio} actualizarCampo={actualizarCampo} />;
    if (currentStep === 3) return <FuncionesDenominaciones formulario={formulario} actualizarCampo={actualizarCampo} />;
    if (currentStep === 4) return <Habilidades formulario={formulario} alternarCatalogo={alternarCatalogo} actualizarCampo={actualizarCampo} />;
    if (currentStep === 5) return <Conocimientos formulario={formulario} alternarCatalogo={alternarCatalogo} actualizarCampo={actualizarCampo} />;
    if (currentStep === 6) return <Justificacion formulario={formulario} manejarCambio={manejarCambio} adjuntos={adjuntos} agregarAdjuntos={agregarAdjuntos} quitarAdjunto={quitarAdjunto} />;
    return <RevisionSolicitud formulario={formulario} adjuntos={adjuntos} onEditar={irAPaso} />;
  };

  if (solicitudRadicada) {
    return <ConfirmacionSolicitud solicitud={solicitudRadicada} />;
  }

  if (!mostrarFormulario) {
    return (
      <main className="pagina solicitud">
        <section className="solicitud-inicio" aria-labelledby="solicitud-inicio-titulo">
          <span aria-hidden="true" className="tarjeta-icono tarjeta-icono-grande material-icons">assignment</span>
          <p className="solicitud-eyebrow">Solicitud de creación</p>
          <h1 id="solicitud-inicio-titulo">Creación de nueva ocupación</h1>
          <p className="solicitud-inicio-texto">Proponga un nuevo perfil ocupacional para la Clasificación Nacional de Ocupaciones (CNO). La solicitud tiene {PASOS.length} pasos y su avance se guarda automáticamente en este navegador.</p>
          <ol className="solicitud-inicio-pasos">
            {PASOS.map((paso, indice) => (
              <li key={paso.titulo}><span className="paso-circulo" aria-hidden="true">{indice + 1}</span>{paso.titulo}</li>
            ))}
          </ol>
          <button type="button" className="boton boton-principal" onClick={() => setMostrarFormulario(true)}>
            Comenzar solicitud
            <span aria-hidden="true" className="material-icons">arrow_forward</span>
          </button>
        </section>
      </main>
    );
  }

  const esUltimoPaso = currentStep === ultimaSesion;
  const textoContinuar = esUltimoPaso ? "Enviar solicitud" : currentStep === ultimaSesion - 1 ? "Revisar solicitud" : "Guardar y continuar";

  return (
    <main className="pagina solicitud">
      <div className="solicitud-contenedor">
        <header className="solicitud-encabezado">
          <div className="solicitud-encabezado-principal">
            <span aria-hidden="true" className="tarjeta-icono tarjeta-icono-grande material-icons">assignment</span>
            <div>
              <p className="solicitud-eyebrow">Propuesta ocupacional</p>
              <h1>Propuesta de nuevo perfil ocupacional</h1>
              <p className="solicitud-encabezado-texto">Complete la solicitud paso a paso. Su avance se guarda automáticamente.</p>
            </div>
          </div>
          <ProgresoFormulario currentStep={currentStep} completedSteps={completedSteps} onStepChange={irAPaso} />
        </header>

        {/* noValidate: la validación la hace validarSesion para mostrar también el aviso del paso. */}
        <form className="solicitud-formulario" onSubmit={esUltimoPaso ? enviarSolicitud : avanzar} noValidate>
          {currentStep === 1 && (
            <div id="indicacion-obligatorios" className="aviso aviso-info">
              <span aria-hidden="true" className="material-icons">info</span>
              <p><strong>Orientación:</strong> diligencie la propuesta con información clara y verificable. Los campos marcados con <span aria-hidden="true" className="obligatorio">*</span><span className="sr-only">asterisco</span> son obligatorios.</p>
            </div>
          )}
          {renderizarSesion()}
          {error && (
            <div className="aviso aviso-error" role="alert">
              <span aria-hidden="true" className="material-icons">error_outline</span>
              <p>{error}</p>
            </div>
          )}
          <div className="solicitud-acciones">
            <p className="estado-guardado" role="status">
              {!esUltimoPaso && (
                <>
                  <span aria-hidden="true" className="material-icons">cloud_done</span>
                  {guardado ? "Información guardada" : "Guardado automático activo"}
                </>
              )}
            </p>
            <div className="solicitud-acciones-botones">
              <button type="button" className="boton boton-secundario" onClick={() => (currentStep === 1 ? setMostrarFormulario(false) : irAPaso(currentStep - 1))}>
                {currentStep > 1 && <span aria-hidden="true" className="material-icons">arrow_back</span>}
                {currentStep === 1 ? "Cancelar" : "Anterior"}
              </button>
              <button type="submit" className="boton boton-principal">
                {textoContinuar}
                <span aria-hidden="true" className="material-icons">{esUltimoPaso ? "send" : "arrow_forward"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default SolicitudOcupacion;
