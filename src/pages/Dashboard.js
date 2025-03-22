import React, {useState, useContext} from "react";
import { Card } from "react-bootstrap";
import { FaUsers, FaHandHoldingUsd, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext"; // ✅ Importar el contexto
import Sidebar from "../components/Sidebar"; 
import Navbar from "../components/Navbar"; // 🔹 Importamos el Navbar global
import "./Dashboard.css";
import logo from "../assets/HB-Logo_mejorado.png.png"; // 📌 Logo principal

const Dashboard = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false); // ✅ Estado para el sidebar
  const { clientes, mensajes } = useContext(GlobalContext); // ✅ Obtener datos desde el contexto

  // 🔹 Filtrar clientes según el estado
  const clientesActivos = clientes.length;
  const prestamosAprobados = clientes.filter((c) => c.estado === "Aprobado").length;
  const prestamosPendientes = clientes.filter((c) => c.estado === "Pendiente" || c.estado === "Verificando").length;
  const prestamosRechazados = clientes.filter((c) => c.estado === "Rechazado").length;

  // 🔹 Obtener últimas solicitudes
  const ultimasSolicitudes = [...clientes]
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)) // Ordenar por fecha
    .slice(0, 4); // Tomar solo las últimas 4

  // 🔹 Obtener últimos mensajes
  const ultimosMensajes = Object.values(mensajes)
  .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  .slice(0, 4);


  return (
    <div className="dashboard-container">
      <Navbar toggleSidebar={() => setMenuAbierto(!menuAbierto)} />
      <Sidebar menuAbierto={menuAbierto} />

      {/* 🔹 Contenido principal */}
      <div className={`main-content ${menuAbierto ? "sidebar-visible" : ""}`}>
        {/* 🔹 Logo principal */}
        <div className="header">
          <img src={logo} alt="HomeBridge Logo" className="logo-img" />
        </div>

        {/* 🔹 Contenedor de tarjetas principales */}
        <div className="card-container">
          <Card className="card-custom">
            <Card.Header>
              <strong><FaUsers /> Clientes Activos</strong>
            </Card.Header>
            <Card.Body>
              <Card.Title>{clientesActivos}</Card.Title>
            </Card.Body>
          </Card>

          <Card className="card-custom active">
            <Card.Header>
              <strong><FaHandHoldingUsd /> Préstamos Aprobados</strong>
            </Card.Header>
            <Card.Body>
              <Card.Title>{prestamosAprobados}</Card.Title>
            </Card.Body>
          </Card>

          <Card className="card-custom">
            <Card.Header>
              <strong><FaHandHoldingUsd /> Préstamos Pendientes</strong>
            </Card.Header>
            <Card.Body>
              <Card.Title>{prestamosPendientes}</Card.Title>
            </Card.Body>
          </Card>

          <Card className="card-custom">
            <Card.Header>
              <strong><FaTimesCircle /> Préstamos Rechazados</strong>
            </Card.Header>
            <Card.Body>
              <Card.Title>{prestamosRechazados}</Card.Title>
            </Card.Body>
          </Card>
        </div>

       {/* 🔹 NUEVOS CUADROS DE INFORMACIÓN */}
       <div className="info-cards-container">
          {/* 📌 Últimas Solicitudes */}
          <Card className="info-card">
            <Card.Header>
              <strong>Las últimas solicitudes</strong> 
              <span className="ver-todo" onClick={() => navigate("/clientes")}>Ver todo</span>
            </Card.Header>
            <Card.Body>
              {ultimasSolicitudes.length > 0 ? (
                ultimasSolicitudes.map((solicitud, index) => (
                  <div key={index} className="request-item">
                    <strong>{solicitud.nombre}</strong> - Préstamo ₲{solicitud.montosolicitado.toLocaleString()} | {solicitud.ciudad} | {new Date(solicitud.fechaCreacion).toLocaleDateString()}
                  </div>
                ))
              ) : (
                <p>No hay solicitudes recientes.</p>
              )}
            </Card.Body>
          </Card>

          {/* 📌 Últimos mensajes */}
          <Card className="info-card">
            <Card.Header>
              <strong>Últimos mensajes</strong> 
              <span className="ver-todo" onClick={() => navigate("/mensajes")}>Ver todo</span>
            </Card.Header>
            <Card.Body>
              {ultimosMensajes.length > 0 ? (
                ultimosMensajes.map((msg, index) => (
                  <div key={index} className="message-item">
                    <strong>{msg.nombre}</strong> | {msg.mensaje} | {new Date(msg.fecha).toLocaleDateString()}
                  </div>
                ))
              ) : (
                <p>No hay mensajes recientes.</p>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;





























