const CLAVE_BORRADOR = "formularioOcupacion";

export function guardarBorrador(formulario, currentStep, completedSteps = []) {
  try {
    localStorage.setItem(CLAVE_BORRADOR, JSON.stringify({ formulario, currentStep, completedSteps }));
  } catch {
    // El formulario sigue funcionando si el navegador bloquea el almacenamiento.
  }
}

export function obtenerBorrador() {
  try {
    const guardado = localStorage.getItem(CLAVE_BORRADOR);
    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null;
  }
}

export function eliminarBorrador() {
  try {
    localStorage.removeItem(CLAVE_BORRADOR);
  } catch {
    // No impedir el flujo si el navegador bloquea el almacenamiento.
  }
}
