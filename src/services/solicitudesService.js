// Radicación de la solicitud de nueva ocupación.
//
// Modo "api": envía al backend del proyecto Clasificación de Ocupaciones (módulo solicitud-ocupacion,
// POST /api/public/solicitudes-ocupacion). El backend guarda la solicitud, le asigna el radicado consecutivo
// (SOL-AAAA-000123, tomado de la secuencia del id) y la fecha de registro; solo la consultan los roles
// ANALISTA y ADMINISTRADOR (GET /api/solicitudes-ocupacion).
//
// Modo "mock" (por defecto mientras no hay acceso a la base de datos): simula ese mismo contrato en el
// navegador y guarda las solicitudes en localStorage con la misma forma que la tabla solicitud_ocupacion.
// Se cambia con VITE_MODO_SOLICITUDES en .env.

export const CORREO_CONTACTO = (import.meta.env.VITE_CORREO_CONTACTO ?? "").trim();
const MODO = (import.meta.env.VITE_MODO_SOLICITUDES ?? "mock").trim().toLowerCase();
const URL_API = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/$/, "");
const CLAVE_MOCK = "clasificacion-solicitudes-ocupacion";
// Si el backend no responde en este tiempo, el envío se cancela y se muestra el aviso de error
// (sin esto, el botón quedaría en "Enviando…" indefinidamente).
const TIEMPO_MAXIMO_MS = 30000;

function errorRadicado(codigo, mensaje) {
  const error = new Error(mensaje);
  error.codigo = codigo;
  return error;
}

async function radicarEnApi(tipo, datos) {
  let respuesta;
  try {
    respuesta = await fetch(`${URL_API}/api/public/solicitudes-ocupacion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, datos }),
      signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS),
    });
  } catch (error) {
    if (error?.name === "TimeoutError") throw errorRadicado("SIN_RESPUESTA", `El backend no respondió en ${TIEMPO_MAXIMO_MS / 1000} s.`);
    throw error;
  }
  if (!respuesta.ok) {
    const error = new Error(`El backend respondió ${respuesta.status} al radicar la solicitud.`);
    error.status = respuesta.status;
    throw error;
  }

  // Sin radicado no hay confirmación posible: la respuesta se trata como error.
  // Si la fecha falta o no es válida, se usa la hora del envío.
  const cuerpo = await respuesta.json().catch(() => null);
  const radicado = typeof cuerpo?.radicado === "string" ? cuerpo.radicado.trim() : "";
  if (!radicado) throw errorRadicado("RESPUESTA_INVALIDA", "El backend respondió sin número de radicado.");
  const fechaValida = !Number.isNaN(new Date(cuerpo.fechaRegistro).getTime());
  return { radicado, fechaRegistro: fechaValida ? cuerpo.fechaRegistro : new Date().toISOString() };
}

function leerSolicitudesMock() {
  try {
    const guardadas = JSON.parse(localStorage.getItem(CLAVE_MOCK));
    return Array.isArray(guardadas) ? guardadas : [];
  } catch {
    return [];
  }
}

// Mismo resultado que el backend: el radicado sale del id consecutivo y queda para el rol ANALISTA.
async function radicarEnMock(tipo, datos) {
  await new Promise((listo) => setTimeout(listo, 400));
  const solicitudes = leerSolicitudesMock();
  const id = solicitudes.reduce((mayor, solicitud) => Math.max(mayor, Number(solicitud.id) || 0), 0) + 1;
  const fechaRegistro = new Date().toISOString();
  const radicado = `SOL-${new Date().getFullYear()}-${String(id).padStart(6, "0")}`;
  const correo = typeof datos.email === "string" ? datos.email.trim().slice(0, 255) : "";
  solicitudes.push({ id, radicado, tipo, correo: correo || null, estado: "RADICADA", rolDestino: "ANALISTA", datos, fechaRegistro });
  localStorage.setItem(CLAVE_MOCK, JSON.stringify(solicitudes));
  return { radicado, fechaRegistro };
}

// tipo: "wizard" (formulario de solicitud por pasos). Devuelve { radicado, fechaRegistro }.
export function radicarSolicitud(tipo, datos) {
  return MODO === "api" ? radicarEnApi(tipo, datos) : radicarEnMock(tipo, datos);
}

export function mensajeErrorRadicado(error) {
  if (error?.status === 429) return "Se enviaron demasiadas solicitudes desde este equipo. Espere un minuto e inténtelo de nuevo.";
  if (error?.codigo === "SIN_RESPUESTA") return "El servidor tardó demasiado en responder. Inténtelo de nuevo en unos minutos; sus datos siguen en el formulario.";
  // El backend sí recibió la solicitud: enviarla otra vez podría duplicarla.
  if (error?.codigo === "RESPUESTA_INVALIDA") {
    const contacto = CORREO_CONTACTO ? `comuníquese al correo ${CORREO_CONTACTO}` : "comuníquese con la entidad";
    return `La solicitud llegó al servidor, pero no se recibió el número de radicado. Para no duplicarla, ${contacto} antes de enviarla de nuevo.`;
  }
  return "No fue posible radicar la solicitud. Verifique su conexión e inténtelo de nuevo; sus datos siguen en el formulario.";
}

// "27 de octubre de 2026 a las 3:45 p. m." en hora de Colombia.
export function formatearFechaEnvio(fechaIso) {
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) return fechaIso;
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeStyle: "short", timeZone: "America/Bogota" }).format(fecha);
}
