import React, { useState } from "react";
import { Box, IconButton } from "@mui/material"; // ✅ Agregué IconButton
import { Link } from "react-router-dom";
import { FaUsers, FaHandHoldingUsd, FaUniversity, FaEnvelope, FaCogs, FaTachometerAlt, FaUserCog } from "react-icons/fa";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material"; 
import "./Sidebar.css";

const Sidebar = () => {
  const userRole = localStorage.getItem("userRole");
  const [menuAbierto, setMenuAbierto] = useState(false);

  const SidebarLink = ({ to, icon, text }) => (
    <Link to={to} className="sidebar-link" onClick={() => setMenuAbierto(false)}>
      {icon} {text}
    </Link>
  );

  return (
    <>
      {/* 🔹 Botón Hamburguesa (Solo en móviles) */}
      <IconButton
      sx={{
        color: "white",
        display: { xs: "block", sm: "block", md: "none" },
        position: "absolute",
        right: "20px",
        zIndex: 1200,
   }}
      onClick={() => setMenuAbierto(!menuAbierto)}
>
      {menuAbierto ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      {/* 🔹 Sidebar */}
      <Box className={`sidebar ${menuAbierto ? "sidebar-open" : ""}`}>
        <div className="sidebar-menu">
          <SidebarLink to="/dashboard" icon={<FaTachometerAlt />} text="Dashboard" />
          {(userRole === "admin" || userRole === "broker") && (
            <SidebarLink to="/prestamos" icon={<FaHandHoldingUsd />} text="Solicitudes" />
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
          {userRole === "admin" && (
            <SidebarLink to="/usuarios" icon={<FaUserCog />} text="Usuarios" />
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

























