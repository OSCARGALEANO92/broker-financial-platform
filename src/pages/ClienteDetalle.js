import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ClienteDetalle.css";

const ClienteDetalle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cliente = location.state?.cliente;

  if (!cliente) {
    return <p>No se encontró información del cliente.</p>;
  }

  return (
    <div className="cliente-detalle-container">
      <h1>Ficha del Cliente</h1>

      <div className="detalle-content">
        {/* 📌 Ficha del Cliente */}
        <div className="ficha-cliente">
          <h2>Información Personal</h2>
          <p><strong>Documento:</strong> {cliente.documento}</p>
          <p><strong>Nombre:</strong> {cliente.nombre}</p>
          <p><strong>Teléfono:</strong> {cliente.telefono}</p>
          <p><strong>Dirección:</strong> {cliente.direccion}</p>
        </div>

        {/* 📌 Datos Adicionales */}
        <div className="datos-adicionales">
          <h2>Datos del Préstamo</h2>
          <p><strong>Banco:</strong> {cliente.banco}</p>
          <p><strong>Monto del Préstamo:</strong> {cliente.prestamo}</p>
          <p><strong>Fecha de Solicitud:</strong> {cliente.fecha}</p>
          <p><strong>Estado:</strong> {cliente.estado}</p>
        </div>

        {/* 📌 Documentos Adjuntos */}
        <div className="documentos-adjuntos">
          <h2>Documentos Adjuntos</h2>
          <ul>
            {cliente.documentos && Object.entries(cliente.documentos).length > 0 ? (
              Object.entries(cliente.documentos).map(([tipo, archivo], index) => (
                <li key={index}>
                  <strong>{tipo.toUpperCase()}:</strong>{" "}
                  {archivo ? (
                    <a href={URL.createObjectURL(archivo)} target="_blank" rel="noopener noreferrer">
                      Ver Documento 📄
                    </a>
                  ) : (
                    "No adjuntado"
                  )}
                </li>
              ))
            ) : (
              <p>No se adjuntaron documentos.</p>
            )}
          </ul>
        </div>
      </div>

      <button className="volver-button" onClick={() => navigate(-1)}>⬅ Volver</button>
    </div>
  );
};

export default ClienteDetalle;
