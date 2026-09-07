function ResultadosOcupacion({ resultados, onSeleccionar }) {
  return (
    <div className="tabla-resultados-wrapper">
      <table className="tabla-resultados">
        <caption>Resultados de búsqueda de ocupaciones</caption>
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((ocupacion) => (
            <tr key={ocupacion.id}>
              <td>
                <button
                  type="button"
                  className="resultado-codigo"
                  onClick={() => onSeleccionar(ocupacion)}
                  aria-label={`Ver detalle de ${ocupacion.nombre}`}
                >
                  {ocupacion.codigo}
                </button>
              </td>
              <td>{ocupacion.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultadosOcupacion;
