import { useEffect, useState } from "react";

const formularioInicial = {
  nombreCompleto: "",
  documentoIdentidad: "",
  correo: "",
  telefono: "",
  cargoProfesion: "",
  nombreOcupacion: "",
  justificacion: "",
};

function SolicitudOcupacion() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const [formulario, setFormulario] = useState(formularioInicial);

  useEffect(() => {
    if (!mostrarConfirmacion) {
      return undefined;
    }

    const temporizador = setTimeout(() => {
      setMostrarConfirmacion(false);
    }, 20000);

    return () => clearTimeout(temporizador);
  }, [mostrarConfirmacion]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    console.log("Datos del formulario:", formulario);
    setFormulario(formularioInicial);
    setMostrarConfirmacion(true);
  };

  return (
    <main className="pagina">
      {!mostrarFormulario ? (
        <section className="inicio-card">
          <div className="inicio-contenido">
            <span className="etiqueta">SOLICITUD</span>

            <h1>Creación de nueva ocupación</h1>

            <p>
              Solicite la creación de una nueva ocupación diligenciando
              la información requerida.
            </p>

            <button
              type="button"
              className="boton boton-principal"
              onClick={() => {
                setMostrarConfirmacion(false);
                setMostrarFormulario(true);
              }}
            >
              Solicitar creación de ocupación
            </button>
          </div>
        </section>
      ) : (
        <section className="formulario-card">
          <header className="formulario-header">
            <span className="etiqueta">SOLICITUD DE OCUPACIÓN</span>

            <h1>Solicitud de creación de ocupación</h1>

            <p>
              Complete la información para solicitar la creación de una
              nueva ocupación.
            </p>
          </header>

          <form onSubmit={manejarEnvio}>
            {/* DATOS DEL SOLICITANTE */}
            <section className="formulario-seccion">
              <div className="seccion-header">
                <h2>Datos del solicitante</h2>
                <p>Información de la persona que realiza la solicitud.</p>
              </div>

              <div className="form-grid">
                <div className="campo">
                  <label htmlFor="nombreCompleto">
                    Nombre completo <span className="obligatorio">*</span>
                  </label>

                  <input
                    type="text"
                    id="nombreCompleto"
                    name="nombreCompleto"
                    value={formulario.nombreCompleto}
                    onChange={manejarCambio}
                    placeholder="Ingrese su nombre completo"
                    required
                  />
                </div>

                <div className="campo">
                  <label htmlFor="documentoIdentidad">
                    Documento de identidad{" "}
                    <span className="obligatorio">*</span>
                  </label>

                  <input
                    type="text"
                    id="documentoIdentidad"
                    name="documentoIdentidad"
                    value={formulario.documentoIdentidad}
                    onChange={manejarCambio}
                    placeholder="Ingrese su documento"
                    required
                  />
                </div>

                <div className="campo">
                  <label htmlFor="correo">
                    Correo electrónico{" "}
                    <span className="obligatorio">*</span>
                  </label>

                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formulario.correo}
                    onChange={manejarCambio}
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>

                <div className="campo">
                  <label htmlFor="telefono">
                    Teléfono <span className="obligatorio">*</span>
                  </label>

                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formulario.telefono}
                    onChange={manejarCambio}
                    placeholder="Ingrese su teléfono"
                    required
                  />
                </div>

                <div className="campo campo-completo">
                  <label htmlFor="cargoProfesion">
                    Cargo o profesión <span className="obligatorio">*</span>
                  </label>

                  <input
                    type="text"
                    id="cargoProfesion"
                    name="cargoProfesion"
                    value={formulario.cargoProfesion}
                    onChange={manejarCambio}
                    placeholder="Ingrese su cargo o profesión"
                    required
                  />
                </div>
              </div>
            </section>

            {/* INFORMACIÓN DE LA OCUPACIÓN */}
            <section className="formulario-seccion">
              <div className="seccion-header">
                <h2>Información de la ocupación</h2>
                <p>
                  Indique la ocupación que desea solicitar y explique
                  el motivo de la solicitud.
                </p>
              </div>

              <div className="campo">
                <label htmlFor="nombreOcupacion">
                  Nombre de la ocupación que se desea crear{" "}
                  <span className="obligatorio">*</span>
                </label>

                <input
                  type="text"
                  id="nombreOcupacion"
                  name="nombreOcupacion"
                  value={formulario.nombreOcupacion}
                  onChange={manejarCambio}
                  placeholder="Ingrese el nombre de la nueva ocupación"
                  required
                />
              </div>

              <div className="campo">
                <label htmlFor="justificacion">
                  Justificación <span className="obligatorio">*</span>
                </label>

                <textarea
                  id="justificacion"
                  name="justificacion"
                  value={formulario.justificacion}
                  onChange={manejarCambio}
                  rows="6"
                  placeholder="Explique las razones por las cuales solicita la creación de esta ocupación"
                  required
                />
              </div>
            </section>

            {/* INFORMACIÓN DE CONTACTO */}
            <div className="informacion">
              <div className="informacion-icono">i</div>

              <div>
                <strong>¿Necesita más información?</strong>

                <p>
                  Para más información sobre esta solicitud, puede
                  escribir al correo{" "}
                  <strong>correo@ejemplo.com</strong>.
                </p>
              </div>
            </div>

            {/* BOTONES */}
            <div className="acciones">
              <button
                type="button"
                className="boton boton-secundario"
                onClick={() => {
                  setMostrarConfirmacion(false);
                  setMostrarFormulario(false);
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="boton boton-principal"
              >
                Enviar solicitud
              </button>
            </div>

            {mostrarConfirmacion && (
              <div className="mensaje-exito" role="status">
                <strong>Solicitud procesada correctamente.</strong>
                <span>
                  Los datos fueron capturados y están listos para su revisión.
                  Para más información, comunicarse al correo xxxx.
                </span>
              </div>
            )}
          </form>
        </section>
      )}
    </main>
  );
}

export default SolicitudOcupacion;