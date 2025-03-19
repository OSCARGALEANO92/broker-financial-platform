import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Clientes from "./pages/Clientes";
import Prestamos from "./pages/Prestamos";
import Bancos from "./pages/Bancos";
import DetallesBanco from "./pages/DetallesBanco";  // ✅ Importado correctamente
import Mensajes from "./pages/Mensajes";
import Ajustes from "./pages/Ajustes";
import ClienteDetalle from "./pages/ClienteDetalle";
import "./styles.css";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("authToken"))
  );

  const userRole = localStorage.getItem("userRole"); // ✅ Obtener el rol

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("authToken")));
    };

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <div className="app-container">
      {/* Navbar solo si está autenticado */}
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}

      <div className="main-layout">
        {/* Sidebar solo si está autenticado */}
        {isAuthenticated && <Sidebar setIsAuthenticated={setIsAuthenticated} />}

        {/* Contenido principal */}
        <div className="content">
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                {/* 🔹 Rutas para "admin" */}
                {userRole === "admin" && (
              <>
                <Route path="/dashboard" element={<Dashboard setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/prestamos" element={<Prestamos />} />
                <Route path="/bancos" element={<Bancos />} />
                <Route path="/bancos/:nombreBanco" element={<DetallesBanco />} />  {/* ✅ Se pasa el nombre en la URL */}
                <Route path="/mensajes" element={<Mensajes />} />
                <Route path="/ajustes" element={<Ajustes />} />
                <Route path="/clientes/:documento" element={<ClienteDetalle />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            )}

              {/* 🔹 Rutas para "banco" */}
              {userRole === "banco" && (
                <>
                  {/* 🔹 Rutas para el usuario "banco" */}
                  <Route path="/dashboard" element={<Dashboard setIsAuthenticated={setIsAuthenticated} />} />
                  <Route path="/clientes" element={<Clientes />} />
                  <Route path="/clientes/:documento" element={<ClienteDetalle />} />
                  <Route path="/mensajes" element={<Mensajes />} />
                  <Route path="/ajustes" element={<Ajustes />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </>
              )}

                {/* 🔹 Rutas para "broker" */}
                {userRole === "broker" && (
                  <>
                    <Route path="/dashboard" element={<Dashboard setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/clientes/:documento" element={<ClienteDetalle />} />
                    <Route path="/bancos" element={<Bancos />} />
                    <Route path="/bancos/:nombreBanco" element={<DetallesBanco />} />
                    <Route path="/mensajes" element={<Mensajes />} />
                    <Route path="/prestamos" element={<Prestamos />} />
                    <Route path="/ajustes" element={<Ajustes />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </>
                )}

                 {/* 🔹 Redirección si el usuario tiene un rol no permitido */}
                 {!["admin", "banco", "broker"].includes(userRole) && <Route path="*" element={<Navigate to="/" replace />} />}
               </>
             )}
           </Routes>
         </div>
       </div>
     </div>
 );
}

export default App;




























