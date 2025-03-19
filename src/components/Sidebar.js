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
      style={{
        textDecoration: "none",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 15px",
        borderRadius: "5px",
        transition: "background 0.3s ease-in-out",
      }}
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
      <Box
        sx={{
          width: "250px",
          height: "100vh",
          backgroundColor: "#000", // 🔹 Fondo negro
          padding: "40px",
          position: "fixed",
          left: 0,
          top: "60px", // No se sobrepone al navbar
          display: "flex",
          flexDirection: "column",
          gap: "1px",
          borderRight: "2px solid #333",
        }}
      >
        {/* 🔹 Dashboard (Visible para todos) */}
        <SidebarLink to="/dashboard" icon={<FaTachometerAlt />} text="Dashboard" />

        {/* ✅ Mostrar Clientes, Mensajes y Ajustes SOLO si es "banco" */}
        {(userRole === "admin" || userRole === "banco" || userRole === "broker") && (
          <>
        {/* 🔹 Enlaces visibles para todos */}
        <SidebarLink to="/clientes" icon={<FaUsers />} text="Clientes" />
            <SidebarLink to="/mensajes" icon={<FaEnvelope />} text="Mensajes" />
            <SidebarLink to="/ajustes" icon={<FaCogs />} text="Ajustes" />
        </>
        )}

         {/* ✅ Mostrar Préstamos y Bancos SOLO si es "admin" */}
         {(userRole === "admin" || userRole === "broker") && (
          <>
            <SidebarLink to="/prestamos" icon={<FaHandHoldingUsd />} text="Préstamos" />
            <SidebarLink to="/bancos" icon={<FaUniversity />} text="Bancos" />
          </>
        )}
      </Box>
    </>
  );
};

export default Sidebar;

























