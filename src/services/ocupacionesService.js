import ocupacionesMock from "../data/ocupacionesMock";

const claveCatalogo = "catalogo-ocupaciones-activo";
const claveVersiones = "catalogo-ocupaciones-versiones";

function cargarCatalogoInicial() {
  try {
    const catalogoGuardado = window.localStorage.getItem(claveCatalogo);
    return catalogoGuardado ? JSON.parse(catalogoGuardado) : ocupacionesMock;
  } catch {
    return ocupacionesMock;
  }
}

let catalogoActivo = typeof window === "undefined" ? ocupacionesMock : cargarCatalogoInicial();
const suscriptores = new Set();

function cargarVersionesIniciales() {
  try {
    const versionesGuardadas = window.localStorage.getItem(claveVersiones);
    return versionesGuardadas ? JSON.parse(versionesGuardadas) : [];
  } catch {
    return [];
  }
}

let versiones = typeof window === "undefined" ? [] : cargarVersionesIniciales();

export function obtenerOcupaciones() {
  return catalogoActivo;
}

export function publicarCatalogo(ocupaciones) {
  catalogoActivo = ocupaciones;
  window.localStorage.setItem(claveCatalogo, JSON.stringify(ocupaciones));
  suscriptores.forEach((suscriptor) => suscriptor());
}

export function obtenerVersiones() {
  return versiones;
}

export function guardarVersion(version) {
  versiones = [version, ...versiones.filter((item) => item.id !== version.id)];
  window.localStorage.setItem(claveVersiones, JSON.stringify(versiones));
}

export function publicarVersion(versionId, ocupaciones) {
  publicarCatalogo(ocupaciones);
  versiones = versiones.map((version) => ({
    ...version,
    estado: version.id === versionId ? "Vigente" : "Histórico",
  }));
  window.localStorage.setItem(claveVersiones, JSON.stringify(versiones));
}

export function suscribirseAlCatalogo(suscriptor) {
  suscriptores.add(suscriptor);
  return () => suscriptores.delete(suscriptor);
}

export function buscarOcupaciones({ termino, clasificacion = "todas", catalogo }) {
  const textoNormalizado = termino.trim().toLocaleLowerCase();
  const codigoNormalizado = textoNormalizado
    .replace(/[^a-z0-9]/gi, "")
    .replace(/^0+(?=\d)/, "");

  return (catalogo || obtenerOcupaciones()).filter((ocupacion) => {
    const coincideClasificacion =
      clasificacion === "todas" ||
      ocupacion.clasificacion.toLocaleLowerCase() === clasificacion;
    const codigo = String(ocupacion.codigo).toLocaleLowerCase();
    const codigoComparable = codigo
      .replace(/[^a-z0-9]/gi, "")
      .replace(/^0+(?=\d)/, "");
    const coincideTexto =
      ocupacion.nombre.toLocaleLowerCase().includes(textoNormalizado) ||
      codigo.includes(textoNormalizado) ||
      codigoComparable.includes(codigoNormalizado);

    return coincideClasificacion && coincideTexto;
  });
}
