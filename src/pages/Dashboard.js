import React, {useState} from "react";
import { Card } from "react-bootstrap";
import { FaUsers, FaHandHoldingUsd, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; 
import Navbar from "../components/Navbar"; // 🔹 Importamos el Navbar global
import "./Dashboard.css";
import logo from "../assets/HomeBridge.png.png"; // 📌 Logo principal

const Dashboard = () => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false); // ✅ Estado para el sidebar

  return (
    <div className="dashboard-container">
      {/* ✅ Navbar (solo un navbar global) */}
      <Navbar toggleSidebar={() => setMenuAbierto(!menuAbierto)} />

      {/* 🔹 Barra lateral */}
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
              <Card.Title>1,245</Card.Title>
            </Card.Body>
          </Card>

          <Card className="card-custom active">
            <Card.Header>
              <strong><FaHandHoldingUsd /> Préstamos Aprobados</strong>
            </Card.Header>
            <Card.Body>
              <Card.Title>850</Card.Title>
            </Card.Body>
          </Card>

          <Card className="card-custom">
            <Card.Header>
              <strong><FaHandHoldingUsd /> Préstamos Pendientes</strong>
            </Card.Header>
            <Card.Body>
              <Card.Title>300</Card.Title>
            </Card.Body>
          </Card>

          <Card className="card-custom">
            <Card.Header>
              <strong><FaTimesCircle /> Préstamos Rechazados</strong>
            </Card.Header>
            <Card.Body>
              <Card.Title>120</Card.Title>
            </Card.Body>
          </Card>
        </div>

        {/* 🔹 NUEVOS CUADROS DE INFORMACIÓN */}
        <div className="info-cards-container">
          <Card className="info-card">
            <Card.Header>
              <strong>Las últimas solicitudes</strong> <span className="ver-todo" onClick={() => navigate("/clientes")}>Ver todo</span>
            </Card.Header>
            <Card.Body>
              <div className="request-item highlight">
                <strong>Marcos Vera</strong> - Préstamo $ 50.000 | Asunción | 15-Mar-2025
              </div>
              <div className="request-item">Tibério Costa - Inversión $ 150.000 | CDE | 15-Mar-2025</div>
              <div className="request-item">Thalia Moura - Préstamo $ 60.000 | Encarnación | 15-Mar-2025</div>
              <div className="request-item">Pedro Gonzalez - Préstamo $ 50.000 | Luque | 15-Mar-2025</div>
            </Card.Body>
          </Card>

          {/* 🔹 Últimos mensajes */}
          <Card className="info-card">
            <Card.Header>
              <strong>Últimos mensajes</strong> <span className="ver-todo" onClick={() => navigate("/mensajes")}>Ver todo</span>
            </Card.Header>
            <Card.Body>
              <div className="message-item">
                <strong>Paulo Barrios</strong> | Envío de documentos | 15-Mar-2025 <span className="badge">HOY</span>
              </div>
              <div className="message-item">
                <strong>Rodrigo Noguera</strong> | Solicitud aprobada | 15-Mar-2025 <span className="badge">HOY</span>
              </div>
              <div className="message-item">Flávia Santos | Mensaje del sitio | 14-Mar-2025</div>
              <div className="message-item">Remax | ¿Conoces nuestras soluciones? | 14-Mar-2025</div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;





























