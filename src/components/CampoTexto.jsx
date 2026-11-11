import { useEffect, useRef, useState } from "react";

// Mismo criterio que la validación al radicar (CAMPOS_OBLIGATORIOS): el correo debe tener dominio con punto.
const PATRON_CORREO = "[^\\s@]+@[^\\s@]+\\.[^\\s@]+";

function mensajeDeError(campo) {
  const { validity } = campo;
  if (validity.valueMissing) return "Este campo es obligatorio.";
  if (validity.customError) return campo.validationMessage;
  if (campo.type === "email" && (validity.typeMismatch || validity.patternMismatch)) return "Escriba un correo válido, por ejemplo nombre@entidad.gov.co.";
  return validity.valid ? "" : campo.validationMessage;
}

// Un obligatorio con solo espacios cuenta como vacío (como marcarCamposSoloEspacios al continuar).
function marcarSoloEspacios(campo) {
  campo.setCustomValidity(campo.required && campo.value !== "" && !campo.value.trim() ? "Este campo no puede quedar solo con espacios." : "");
}

// Campo de texto con validación en línea según los estados del sistema visual:
// rechazo (borde, ícono y mensaje rojos bajo el campo, en lugar de la burbuja del navegador) y
// aprobación (check verde) en los obligatorios bien diligenciados.
// El error aparece al intentar continuar o al salir de un campo mal escrito, y se actualiza mientras se corrige.
function CampoTexto({ id, etiqueta, tipo = "text", valor, onChange, placeholder = "", requerido = false, ayuda, multilinea = false, filas = 4, completo = false, autoComplete }) {
  const [error, setError] = useState("");
  const [valido, setValido] = useState(false);
  // El primer campo con error recibe el foco cuando su mensaje ya está en pantalla,
  // para que el lector de pantalla lea la etiqueta junto con el error.
  const enfocarConError = useRef(false);

  useEffect(() => {
    if (!enfocarConError.current) return;
    enfocarConError.current = false;
    document.getElementById(id)?.focus();
  }, [error, id]);

  const revisar = (campo) => {
    marcarSoloEspacios(campo);
    const mensaje = mensajeDeError(campo);
    setValido(requerido && !mensaje && campo.value.trim() !== "");
    return mensaje;
  };

  const propiedades = {
    id,
    name: id,
    value: valor,
    placeholder,
    required: requerido,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": [ayuda && `${id}-ayuda`, error && `${id}-error`].filter(Boolean).join(" ") || undefined,
    onChange: (evento) => {
      onChange(evento);
      const mensaje = revisar(evento.target);
      if (error) setError(mensaje);
    },
    onBlur: (evento) => {
      const mensaje = revisar(evento.target);
      // Un campo vacío no se marca al salir de él: solo al intentar continuar.
      if (evento.target.value) setError(mensaje);
    },
    onInvalid: (evento) => {
      evento.preventDefault();
      const mensaje = mensajeDeError(evento.target);
      const primerInvalido = evento.target.form?.querySelector("input:invalid, textarea:invalid, select:invalid");
      if (primerInvalido === evento.target) {
        // Si el mensaje no cambia no hay nuevo render: se enfoca de inmediato.
        if (mensaje === error) evento.target.focus();
        else enfocarConError.current = true;
      }
      setError(mensaje);
      setValido(false);
    },
  };

  const estado = error ? "invalido" : valido ? "valido" : "";

  return (
    <div className={["campo", completo && "campo-completo", estado && `campo-${estado}`].filter(Boolean).join(" ")}>
      <label htmlFor={id}>
        {etiqueta} {requerido && <span aria-hidden="true" className="obligatorio">*</span>}
      </label>
      {ayuda && <p id={`${id}-ayuda`} className="ayuda-campo">{ayuda}</p>}
      <div className="campo-control">
        {multilinea
          ? <textarea {...propiedades} rows={filas} />
          : <input {...propiedades} type={tipo} pattern={tipo === "email" ? PATRON_CORREO : undefined} />}
        {estado && <span aria-hidden="true" className="campo-estado-icono material-icons-round">{error ? "error" : "check_circle"}</span>}
      </div>
      {error && <p id={`${id}-error`} className="campo-error">{error}</p>}
    </div>
  );
}

export default CampoTexto;
