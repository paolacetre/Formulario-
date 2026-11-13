import { Link } from "react-router-dom";

function Inicio() {
  return (
    <main className="pagina">
      <section className="inicio-card">
        <div className="inicio-contenido">
          <span className="etiqueta">CATÁLOGO DE OCUPACIONES</span>
          <h1>Solicitud de creación de ocupaciones</h1>
          <p>
            Proponga una nueva ocupación para la Clasificación Nacional de
            Ocupaciones (CNO). El equipo de analistas evaluará su solicitud.
          </p>
          <div className="inicio-acciones">
            <Link className="boton boton-principal" to="/formulario">
              Solicitar creación de ocupación
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Inicio;
