import { useState } from "react";
import DetalleOcupacion from "../components/DetalleOcupacion";
import ResultadosOcupacion from "../components/ResultadosOcupacion";
import {
  buscarOcupaciones,
} from "../services/ocupacionesService";

function BuscarOcupacion() {
  const [termino, setTermino] = useState("");
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [ocupacionSeleccionada, setOcupacionSeleccionada] = useState(null);
  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!termino.trim()) {
      setResultados([]);
      setBusquedaRealizada(true);
      return;
    }

    setResultados(buscarOcupaciones({ termino }));
    setBusquedaRealizada(true);
  };

  const limpiarBusqueda = () => {
    setTermino("");
    setBusquedaRealizada(false);
    setResultados([]);
    setOcupacionSeleccionada(null);
  };

  const volverAResultados = () => setOcupacionSeleccionada(null);

  if (ocupacionSeleccionada) {
    return (
      <main className="pagina">
        <DetalleOcupacion
          ocupacion={ocupacionSeleccionada}
          onVolver={volverAResultados}
        />
      </main>
    );
  }

  return (
    <main className="pagina">
      <section className="busqueda-card">
        <header className="busqueda-header">
          <span className="etiqueta">CONSULTA PUBLICA</span>
          <h1>Buscar ocupación</h1>
          <p>
            Consulte ocupaciones por nombre o código.
          </p>
        </header>

        <form className="busqueda-formulario" onSubmit={manejarEnvio}>
          <div className="campo campo-busqueda">
            <label htmlFor="termino">Nombre o código de la ocupación</label>
            <input
              type="search"
              id="termino"
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              placeholder="Ejemplo: analista o 0211"
            />
          </div>

          <div className="busqueda-acciones busqueda-acciones-unicas">
            <button type="button" className="boton boton-secundario" onClick={limpiarBusqueda}>
              Limpiar
            </button>
            <button type="submit" className="boton boton-principal">
              Buscar
            </button>
          </div>
        </form>

        {busquedaRealizada && !termino.trim() && (
          <p className="mensaje-estado mensaje-advertencia" role="alert">
            Escriba un nombre o código para realizar la búsqueda.
          </p>
        )}

        {!busquedaRealizada && (
          <div className="busqueda-vacia">
            <h2>Inicie una búsqueda</h2>
            <p>Los resultados aparecerán aquí cuando consulte el catálogo.</p>
          </div>
        )}

        {busquedaRealizada && termino.trim() && (
          <section className="resultados-resumen" aria-live="polite">
            <p className="resultado-cantidad">
              {resultados.length} {resultados.length === 1 ? "resultado encontrado" : "resultados encontrados"}
            </p>

            {resultados.length === 0 ? (
              <p className="mensaje-estado mensaje-informacion">
                No se encontraron ocupaciones que coincidan con la búsqueda.
              </p>
            ) : (
              <ResultadosOcupacion
                resultados={resultados}
                onSeleccionar={setOcupacionSeleccionada}
              />
            )}
          </section>
        )}
      </section>
    </main>
  );
}

export default BuscarOcupacion;
