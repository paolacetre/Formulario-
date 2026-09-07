import { Link } from "react-router-dom";

function Inicio() {
  return (
    <main className="pagina">
      <section className="inicio-card">
        <div className="inicio-contenido">
          <span className="etiqueta">CATALOGO DE OCUPACIONES</span>
          <h1>Consulta y gestión de ocupaciones laborales</h1>
          <p>
            Consulte información de ocupaciones CNO y CUOC o solicite la
            creación de una nueva ocupación.
          </p>
          <nav className="inicio-acciones" aria-label="Acciones principales">
            <Link className="boton boton-principal" to="/buscar">
              Buscar ocupación
            </Link>
            <Link className="boton boton-opcional" to="/formulario">
              Solicitar creación de ocupación
            </Link>
          </nav>
        </div>
      </section>
    </main>
  );
}

export default Inicio;
