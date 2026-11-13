import { Link } from "react-router-dom";

function Inicio() {
  return (
    <main className="pagina">
      <section className="inicio-card">
        <div className="inicio-contenido">
          <h1>Solicitud nueva ocupación</h1>
          <p>
            Proponga una nueva ocupación para la Clasificación Nacional de
            Ocupaciones (CNO). El equipo de analistas evaluará su solicitud.
          </p>
          <div className="inicio-acciones">
            <Link className="boton boton-principal" to="/formulario">
              Solicitar nueva ocupación
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Inicio;
