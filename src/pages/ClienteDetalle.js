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
          <p><strong>Nombre:</strong> {cliente.nombre || cliente.nombres}</p>
          <p><strong>Teléfono:</strong> {cliente.telefono || cliente.celular}</p>
          <p><strong>Correo:</strong> {cliente.correo}</p>
          <p><strong>Dirección:</strong> {cliente.direccion}</p>
          <p><strong>Barrio:</strong> {cliente.barrio}</p>
          <p><strong>Ciudad:</strong> {cliente.ciudad}</p>
          <p><strong>Fecha de Nacimiento:</strong> {cliente.fechaNacimiento}</p>
          <p><strong>Estado Civil:</strong> {cliente.estadoCivil}</p>
          <p><strong>Nacionalidad:</strong> {cliente.nacionalidad}</p>
        </div>

        {/* 📌 Datos Adicionales */}
        <div className="datos-adicionales">
        <h2>Datos Laborales</h2>
          <p><strong>Empresa:</strong> {cliente.empresa}</p>
          <p><strong>RUC:</strong> {cliente.ruc}</p>
          <p><strong>Actividad Empresa:</strong> {cliente.actividadEmpresa}</p>
          <p><strong>Ingresos:</strong> ₲{cliente.ingresos?.toLocaleString()}</p>
          <p><strong>Fecha de Cobro:</strong> {cliente.fechaCobro}</p>
        </div>

        {/* 📌 Referencias Personales */}
        <div className="datos-adicionales">
          <h2>Referencias Personales</h2>
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <p><strong>Referencia {i}:</strong></p>
              <p>Nombre: {cliente[`referencia${i}`]}</p>
              <p>Relación: {cliente[`relacion${i}`]}</p>
              <p>Celular: {cliente[`celular${i}`]}</p>
            </div>
          ))}
        </div>

        {/* 📌 Datos del Préstamo */}
        <div className="datos-adicionales">
          <h2>Datos del Préstamo</h2>
          <p><strong>Banco:</strong> {cliente.banco || cliente.bancoSeleccionado}</p>
          <p><strong>Monto del Préstamo:</strong> ₲{(cliente.montosolicitado || cliente.monto)?.toLocaleString()}</p>
          <p><strong>Plazo:</strong> {cliente.plazo}</p>
          <p><strong>Destino:</strong> {cliente.destino}</p>
          <p><strong>Estado:</strong> {cliente.estado}</p>
        </div>

        {/* Documentos Adjuntos */}
        <div className="documentos-adjuntos">
          <h2>Documentos Adjuntos</h2>
          <ul>
            {cliente.documentos && Object.entries(cliente.documentos).length > 0 ? (
              Object.entries(cliente.documentos).map(([tipo, archivos], i) => (
                <li key={i}>
                  <strong>{tipo.toUpperCase()}:</strong>{" "}
                  {Array.isArray(archivos) && archivos.length > 0 ? (
                    archivos.map((file, j) => (
                      <div key={j}>
                        {file instanceof File ? (
                          <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer">
                            Ver Documento {j + 1} 📄
                          </a>
                        ) : (
                          <span>Documento no válido</span>
                        )}
                      </div>
                    ))
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