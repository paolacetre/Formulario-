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

async function radicarEnApi(tipo, datos) {
  const respuesta = await fetch(`${URL_API}/api/public/solicitudes-ocupacion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo, datos }),
  });
  if (!respuesta.ok) {
    const error = new Error(`El backend respondió ${respuesta.status} al radicar la solicitud.`);
    error.status = respuesta.status;
    throw error;
  }
  return respuesta.json();
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

// tipo: "wizard" (formulario por pasos) o "alterno". Devuelve { radicado, fechaRegistro }.
export function radicarSolicitud(tipo, datos) {
  return MODO === "api" ? radicarEnApi(tipo, datos) : radicarEnMock(tipo, datos);
}

export function mensajeErrorRadicado(error) {
  return error?.status === 429
    ? "Se enviaron demasiadas solicitudes desde este equipo. Espere un minuto e inténtelo de nuevo."
    : "No fue posible radicar la solicitud. Verifique su conexión e inténtelo de nuevo; sus datos siguen en el formulario.";
}

// "27 de octubre de 2026 a las 3:45 p. m." en hora de Colombia.
export function formatearFechaEnvio(fechaIso) {
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) return fechaIso;
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeStyle: "short", timeZone: "America/Bogota" }).format(fecha);
}
