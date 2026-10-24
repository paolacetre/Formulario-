import { PASOS } from "./pasosSolicitud";

function ProgresoFormulario({ currentStep, completedSteps = [], onStepChange }) {
  return (
    <nav className="progreso-formulario" aria-label="Progreso de la solicitud">
      {/* En pantallas angostas se muestra solo este resumen con la barra. */}
      <p className="progreso-resumen">
        <span>Paso <strong>{currentStep}</strong> de {PASOS.length} · {PASOS[currentStep - 1].titulo}</span>
        <span className="progreso-barra" aria-hidden="true"><span style={{ width: `${(currentStep / PASOS.length) * 100}%` }} /></span>
      </p>
      <ol style={{ "--pasos": PASOS.length }}>
        {PASOS.map((paso, indice) => {
          const numero = indice + 1;
          const disponible = numero === currentStep || completedSteps.includes(numero);
          const estado = numero === currentStep ? "actual" : completedSteps.includes(numero) ? "completada" : "pendiente";

          return (
            <li className={`progreso-item ${estado}`} key={paso.titulo}>
              <button type="button" onClick={() => disponible && onStepChange(numero)} disabled={!disponible} aria-current={numero === currentStep ? "step" : undefined} title={paso.titulo}>
                <span className="progreso-numero" aria-hidden="true">
                  {estado === "completada" ? <span className="material-icons">check</span> : numero}
                </span>
                <span className="sr-only">{estado === "completada" ? "Completado: " : estado === "actual" ? "Actual: " : "Pendiente: "}</span>
                <span className="progreso-etiqueta">{paso.corto}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default ProgresoFormulario;
