import "./App.css";
import { NavLink, Route, Routes } from "react-router-dom";
import AdminOcupaciones from "./views/AdminOcupaciones";
import BuscarOcupacion from "./views/BuscarOcupacion";
import FormularioOcupacion from "./views/FormularioOcupacion";
import FormularioAlterno from "./views/FormularioAlterno";
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
            to="/buscar"
          >
            Buscar ocupación
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? "activo" : "")}
            to="/formulario"
          >
            Solicitar creación
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? "activo" : "")}
            to="/formulario-alterno"
          >
            Formulario alterno
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? "activo" : "")}
            to="/admin"
          >
            Administración
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/buscar" element={<BuscarOcupacion />} />
        <Route path="/formulario" element={<FormularioOcupacion />} />
        <Route path="/formulario-alterno" element={<FormularioAlterno />} />
        <Route path="/admin" element={<AdminOcupaciones />} />
      </Routes>

    </>
  );
}

export default App;