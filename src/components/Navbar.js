import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/HB-Logo_mejorado.png.png";
import "./Navbar.css";

const Navbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = localStorage.getItem("userRole") || "";
  const nombreUsuario = localStorage.getItem(`${userRole}_nombreUsuario`) || "Usuario";

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
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
        {location.pathname === "/dashboard" && (
          <span className="navbar-welcome">
            Bienvenido, <strong>{nombreUsuario}</strong>
          </span>
        )}
      </div>
      <div className="logout-container">
        <button className="logout-icon" onClick={handleLogout}>
          <FaSignOutAlt />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;





