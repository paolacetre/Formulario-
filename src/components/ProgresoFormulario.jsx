const sesiones = [
  "Datos generales",
  "Propuesta de ocupación",
  "Funciones principales",
  "Denominaciones ocupacionales",
  "Ocupaciones relacionadas",
  "Habilidades",
  "Conocimientos",
  "Justificación",
  "Revisión de la solicitud",
];

function ProgresoFormulario({ currentStep, completedSteps = [], onStepChange }) {
  return (
    <nav className="progreso-formulario" aria-label="Progreso de la solicitud">
      <ol>
        {sesiones.map((sesion, indice) => {
          const numero = indice + 1;
          const disponible = numero === currentStep || completedSteps.includes(numero);
          const estado = numero === currentStep ? "actual" : completedSteps.includes(numero) ? "completada" : "pendiente";

          return (
            <li className={`progreso-item ${estado}`} key={sesion}>
              <button type="button" onClick={() => disponible && onStepChange(numero)} disabled={!disponible} aria-current={numero === currentStep ? "step" : undefined}>
                <span className="progreso-numero" aria-hidden="true">{estado === "completada" ? "✓" : estado === "actual" ? "●" : "○"}</span>
                <span className="sr-only">{estado === "completada" ? "Completada: " : estado === "actual" ? "Actual: " : "Pendiente: "}</span>
                <span>{sesion}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default ProgresoFormulario;
