import { AREAS_DESEMPENO, NIVELES_CUALIFICACION } from "../data/instrumento3.models";

// Utilidades de los catálogos de la CNO usados en el formulario.
export function normalizarTexto(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// Opciones para SelectorBuscable: { value, label, detalle }.
export const OPCIONES_NIVEL = NIVELES_CUALIFICACION.map((nivel) => ({ value: nivel.value, label: `${nivel.value} · ${nivel.label}`, detalle: nivel.descripcion }));
export const OPCIONES_AREA = AREAS_DESEMPENO.map((area) => ({ value: area.value, label: `${area.value} · ${area.label}`, detalle: area.descripcion }));
