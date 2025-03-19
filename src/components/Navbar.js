import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "react-bootstrap";
import logo from "../assets/HB-Logo.png.png"; // Asegúrate de que la ruta y nombre del archivo sean correctos

const Navbar = ({ setIsAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <nav className="navbar-container">
      {/* ✅ Reemplazar HomeBridge con una imagen */}
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>

      <div className="nav-links">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/clientes" className={({ isActive }) => (isActive ? "active" : "")}>
          Clientes
        </NavLink>
        <NavLink to="/prestamos" className={({ isActive }) => (isActive ? "active" : "")}>
          Préstamos
        </NavLink>
        <NavLink to="/bancos" className={({ isActive }) => (isActive ? "active" : "")}>
          Bancos
        </NavLink>
        <NavLink to="/mensajes" className={({ isActive }) => (isActive ? "active" : "")}>
          Mensajes
        </NavLink>
      </div>

      <Button variant="danger" onClick={handleLogout}>
        CERRAR SESIÓN
      </Button>
    </nav>
  );
};

export default Navbar;


