import React from "react";
import { Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers, FaHandHoldingUsd, FaUniversity, FaEnvelope, FaCogs, FaTachometerAlt } from "react-icons/fa";
import logo from "../assets/HB-Logo_mejorado.png.png"; // Asegúrate de que la ruta sea correcta

const Sidebar = () => {
  const navigate = useNavigate(); // Hook para manejar la navegación en React Router
  const userRole = localStorage.getItem("userRole"); // ✅ Obtener el rol del usuario

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole"); // ✅ Borrar el rol al cerrar sesión
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 100);
  };

  // 🔹 Función para renderizar enlaces
  const SidebarLink = ({ to, icon, text }) => (
    <Link
      to={to}
      className="sidebar-link"
    >
      {icon} {text}
    </Link>
  );

  return (
    <>
      {/* 🔹 Navbar Barra de navegación superior */}
      <Box
        sx={{
          width: "100%",
          height: "60px",
          backgroundColor: "#212529", // Fondo oscuro
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        {/* ✅ Reemplazar HomeBridge con un logo */}
        <Link to="/dashboard" style={{ textDecoration: "none" }}>
          <img
            src={logo}
            alt="HomeBridge Logo"
            style={{
              height: "60px",  // Ajustar tamaño sin deformar
              width: "auto",
              maxWidth: "450px",
              objectFit: "contain",
            }}
          />
        </Link>
      </Box>

      {/* 🔹 Barra lateral */}
      <Box className="sidebar">
        <div className="sidebar-menu">
          {/* ✅ Orden fijo */}
          <SidebarLink to="/dashboard" icon={<FaTachometerAlt />} text="Dashboard" />
          {(userRole === "admin" || userRole === "broker") && (
            <SidebarLink to="/Prestamos" icon={<FaHandHoldingUsd />} text="Solicitudes" />
          )}
          {(userRole === "admin" || userRole === "banco" || userRole === "broker") && (
            <SidebarLink to="/clientes" icon={<FaUsers />} text="Clientes" />
          )}
          {(userRole === "admin" || userRole === "banco" || userRole === "broker") && (
            <SidebarLink to="/mensajes" icon={<FaEnvelope />} text="Mensajes" />
          )}
          {(userRole === "admin" || userRole === "broker") && (
            <SidebarLink to="/bancos" icon={<FaUniversity />} text="Bancos" />
          )}
        </div>

        {/* 🔹 Espaciador dinámico para empujar "Ajustes" al final */}
        <div style={{ flexGrow: 0.9 }}></div>

        {/* 🔹 Ajustes al final */}
        <SidebarLink to="/ajustes" icon={<FaCogs />} text="Ajustes" />
      </Box>
    </>
  );
};

export default Sidebar;

























