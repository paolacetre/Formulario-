import "./App.css";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import FormularioOcupacion from "./views/FormularioOcupacion";
import Inicio from "./views/Inicio";

function App() {
  return (
    <>
      <header className="barra-navegacion">
        <NavLink className="marca" to="/">
          Ocupaciones
        </NavLink>

        <nav className="navegacion-principal" aria-label="Navegación principal">
          <NavLink
            className={({ isActive }) => (isActive ? "activo" : "")}
            to="/formulario"
          >
            Solicitar creación
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/formulario" element={<FormularioOcupacion />} />
        {/* Las rutas que ya no existen (como /buscar o /admin) llevan al inicio. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
