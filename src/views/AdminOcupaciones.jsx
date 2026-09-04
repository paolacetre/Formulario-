import { useState } from "react";
import { procesarArchivoExcel } from "../services/excelService";
import {
  guardarVersion,
  obtenerVersiones,
  publicarVersion,
} from "../services/ocupacionesService";

const extensionesPermitidas = [".xlsx", ".xls"];

function AdminOcupaciones() {
  const [archivo, setArchivo] = useState(null);
  const [errores, setErrores] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [publicado, setPublicado] = useState(false);
  const [catalogoPendiente, setCatalogoPendiente] = useState(null);
  const [versiones, setVersiones] = useState(obtenerVersiones);
  const [versionPendiente, setVersionPendiente] = useState(null);

  const manejarArchivo = (e) => {
    const archivoSeleccionado = e.target.files[0];
    setArchivo(archivoSeleccionado || null);
    setResumen(null);
    setPublicado(false);
    setCatalogoPendiente(null);
    setVersionPendiente(null);

    if (!archivoSeleccionado) {
      setErrores([]);
      return;
    }

    const extension = `.${archivoSeleccionado.name.split(".").pop().toLowerCase()}`;
    const nuevosErrores = [];

    if (!extensionesPermitidas.includes(extension)) {
      nuevosErrores.push("El archivo debe tener formato .xlsx o .xls.");
    }

    if (archivoSeleccionado.size === 0) {
      nuevosErrores.push("El archivo seleccionado está vacío.");
    }

    setErrores(nuevosErrores);
  };

  const validarArchivo = async () => {
    if (!archivo || errores.length > 0) {
      return;
    }

    const resultado = await procesarArchivoExcel(archivo);
    setErrores(resultado.errores);
    setCatalogoPendiente(resultado.ocupaciones);
    const nuevaVersion = {
      id: `version-${Date.now()}`,
      anio: new Date().getFullYear(),
      archivo: archivo.name,
      fecha: new Date().toLocaleString("es-CO"),
      estado: "Borrador",
      registros: resultado.total,
      errores: resultado.errores.length,
    };
    guardarVersion(nuevaVersion);
    setVersionPendiente(nuevaVersion);
    setVersiones(obtenerVersiones());
    setResumen({
      registrosEncontrados: resultado.total,
      registrosValidos: resultado.ocupaciones.length,
      registrosConErrores: resultado.errores.length,
    });
  };

  const confirmarPublicacion = () => {
    if (!catalogoPendiente || errores.length > 0) {
      return;
    }

    publicarVersion(versionPendiente.id, catalogoPendiente);
    setVersiones(obtenerVersiones());
    setPublicado(true);
  };

  return (
    <main className="pagina">
      <section className="admin-card">
        <header className="admin-header">
          <span className="etiqueta">AREA ADMINISTRATIVA</span>
          <h1>Actualización anual del catálogo</h1>
          <p>
            Cargue una nueva versión del catálogo para validarla antes de
            publicarla. El catálogo vigente se conservará hasta confirmar el
            cambio.
          </p>
        </header>

        <section className="admin-seccion">
          <div className="seccion-header">
            <h2>1. Cargar archivo</h2>
            <p>Formatos permitidos: Excel .xlsx o .xls.</p>
          </div>

          <label className="carga-archivo" htmlFor="archivo-catalogo">
            <span>Seleccionar archivo Excel</span>
            <small>{archivo ? archivo.name : "Aún no ha seleccionado un archivo"}</small>
            <input
              id="archivo-catalogo"
              type="file"
              accept=".xlsx,.xls"
              onChange={manejarArchivo}
            />
          </label>

          {errores.length > 0 && (
            <div className="admin-mensaje admin-error" role="alert">
              <strong>No se puede validar el archivo.</strong>
              <ul>
                {errores.map((error) => <li key={error}>{error}</li>)}
              </ul>
            </div>
          )}

          <button
            type="button"
            className="boton boton-principal"
            disabled={!archivo || errores.length > 0}
            onClick={validarArchivo}
          >
            Validar archivo
          </button>
        </section>

        {resumen && (
          <section className="admin-seccion admin-resumen">
            <div className="seccion-header">
              <h2>2. Resumen de validación</h2>
              <p>Revise el resultado antes de publicar la nueva versión.</p>
            </div>
            <dl className="resumen-grid">
              <div><dt>Registros encontrados</dt><dd>{resumen.registrosEncontrados}</dd></div>
              <div><dt>Registros válidos</dt><dd>{resumen.registrosValidos}</dd></div>
              <div><dt>Registros con errores</dt><dd>{resumen.registrosConErrores}</dd></div>
            </dl>
            <button
              type="button"
              className="boton boton-principal"
              disabled={!catalogoPendiente || !versionPendiente || errores.length > 0}
              onClick={confirmarPublicacion}
            >
              Confirmar publicación de borrador
            </button>
          </section>
        )}

        {publicado && (
          <div className="admin-mensaje admin-exito" role="status">
            Catálogo publicado correctamente para esta prueba. Ahora el buscador utilizará los datos del Excel.
          </div>
        )}

        <section className="admin-seccion">
          <div className="seccion-header">
            <h2>Versiones del catálogo</h2>
            <p>El historial se conservará cuando exista persistencia real.</p>
          </div>
          <div className="versiones-tabla">
            {versiones.length === 0 ? (
              <p className="versiones-vacias">Aún no existen versiones cargadas.</p>
            ) : (
              versiones.map((version) => (
                <div key={version.id}>
                  <strong>Catálogo {version.anio}<small>{version.archivo} · {version.fecha}</small></strong>
                  <span className={`estado-version ${version.estado.toLocaleLowerCase()}`}>
                    {version.estado}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default AdminOcupaciones;
