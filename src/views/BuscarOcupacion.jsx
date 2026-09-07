import { useState } from "react";
import DetalleOcupacion from "../components/DetalleOcupacion";
import ResultadosOcupacion from "../components/ResultadosOcupacion";
import {
  buscarOcupaciones,
} from "../services/ocupacionesService";

function BuscarOcupacion() {
  const [termino, setTermino] = useState("");
  const [terminoConsultado, setTerminoConsultado] = useState("");
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [ocupacionSeleccionada, setOcupacionSeleccionada] = useState(null);
  const manejarEnvio = (e) => {
    e.preventDefault();
    const terminoNormalizado = termino.trim();

    if (!terminoNormalizado) {
      setResultados([]);
      setTerminoConsultado("");
      setTermino("");
      setBusquedaRealizada(true);
      return;
    }

    setResultados(buscarOcupaciones({ termino: terminoNormalizado }));
    setTerminoConsultado(terminoNormalizado);
    setTermino("");
    setBusquedaRealizada(true);
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
          <h1>Consulta de ocupaciones</h1>
          <p>
            Consulte ocupaciones por nombre o código.
          </p>
        </header>

        <section aria-labelledby="titulo-buscador">
          <h2 id="titulo-buscador">Buscar ocupación</h2>
          <form className="busqueda-formulario" onSubmit={manejarEnvio}>
            <div className="campo campo-busqueda">
              <label htmlFor="termino">Nombre o código de la ocupación</label>
              <input
                type="search"
                id="termino"
                value={termino}
                onChange={(e) => setTermino(e.target.value)}
                placeholder="Ejemplo: analista o 0211"
                aria-describedby={busquedaRealizada && !terminoConsultado ? "mensaje-busqueda" : undefined}
                aria-invalid={busquedaRealizada && !terminoConsultado}
              />
            </div>

            <div className="busqueda-acciones busqueda-acciones-unicas">
              <button type="submit" className="boton boton-principal">
                Buscar
              </button>
            </div>
          </form>
        </section>

        {busquedaRealizada && !terminoConsultado && (
          <p id="mensaje-busqueda" className="mensaje-estado mensaje-advertencia" role="alert">
            Escriba un nombre o código para realizar la búsqueda.
          </p>
        )}

        <section className="resultados-resumen" aria-labelledby="titulo-resultados" aria-live="polite">
          <h2 id="titulo-resultados">Resultados de búsqueda</h2>
          {!busquedaRealizada && (
            <div className="busqueda-vacia">
              <p>Inicie una búsqueda para consultar el catálogo.</p>
            </div>
          )}

          {busquedaRealizada && terminoConsultado && (
            <p className="resultado-cantidad">
              {resultados.length} {resultados.length === 1 ? "resultado encontrado" : "resultados encontrados"}
            </p>
          )}

          {busquedaRealizada && terminoConsultado && resultados.length === 0 ? (
              <p className="mensaje-estado mensaje-informacion">
                No se encontraron ocupaciones que coincidan con la búsqueda.
              </p>
          ) : busquedaRealizada && terminoConsultado ? (
              <ResultadosOcupacion
                resultados={resultados}
                onSeleccionar={setOcupacionSeleccionada}
              />
          ) : null}
        </section>
      </section>
    </main>
  );
}

export default BuscarOcupacion;
