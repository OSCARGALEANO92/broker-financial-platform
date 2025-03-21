import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/HB-Logo_mejorado.png.png"; // Asegúrate de que la ruta sea correcta
import "./Navbar.css";

const Navbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Obtiene la ruta actual

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    if (setIsAuthenticated) {
      setIsAuthenticated(false);
    }
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <nav className="navbar-container">
      {/* ✅ Logo HomeBridge con "Bienvenido" SOLO en el Dashboard */}
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
        {location.pathname === "/dashboard" && <span className="navbar-welcome">Bienvenido</span>}
      </div>
      {/* ✅ Botón de Cerrar Sesión con console.log para verificar */}
      <div className="logout-container">
      <button className="logout-icon" onClick={handleLogout}>
      <FaSignOutAlt />
      </button>
      </div>
    </nav>
  );
};

export default Navbar;




