import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./DetallesBanco.css";

const DetallesBanco = () => {
  const navigate = useNavigate();
  const { nombreBanco } = useParams();
  const bancoMostrar = nombreBanco ? decodeURIComponent(nombreBanco) : "Desconocido";

  // Datos de ejemplo de clientes con préstamos en el banco
  const clientes = [
    { nombre: "Juan Pérez", monto: 10000000, fecha: "12-Mar-2025", estado: "Aprobado" },
    { nombre: "María Gómez", monto: 15000000, fecha: "13-Mar-2025", estado: "Pendiente" },
    { nombre: "Carlos Rodríguez", monto: 20000000, fecha: "14-Mar-2025", estado: "Rechazado" },
    { nombre: "Ana López", monto: 8000000, fecha: "15-Mar-2025", estado: "Aprobado" },
    { nombre: "Pedro González", monto: 12000000, fecha: "16-Mar-2025", estado: "Verificando" },
  ];

  // Estado para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 3;

  // Calcular índices para paginación
  const indiceInicial = (paginaActual - 1) * clientesPorPagina;
  const indiceFinal = indiceInicial + clientesPorPagina;
  const clientesPaginados = clientes.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(clientes.length / clientesPorPagina);

  // 🔹 Calcular montos totales por estado
  const totalAceptados = clientes
    .filter(cliente => cliente.estado === "Aprobado")
    .reduce((sum, cliente) => sum + cliente.monto, 0);

  const totalPendientes = clientes
    .filter(cliente => cliente.estado === "Pendiente")
    .reduce((sum, cliente) => sum + cliente.monto, 0);

  const totalverificando = clientes
    .filter(cliente => cliente.estado === "Verificando")
    .reduce((sum, cliente) => sum + cliente.monto, 0);  

  const totalRechazados = clientes
    .filter(cliente => cliente.estado === "Rechazado")
    .reduce((sum, cliente) => sum + cliente.monto, 0);

  return (
    <div className="DetallesBanco-container">
      {/* 🔹 Título del Banco */}
      <h1 className="DetallesBanco-title">Clientes de <span>{bancoMostrar}</span></h1>
      <p className="DetallesBanco-description">
        A continuación, se muestra la lista de clientes que solicitaron préstamos en este banco.
      </p>

      {/* 🔹 Cuadros de resumen de montos por estado */}
      <div className="DetallesBanco-resumen">
        <div className="resumen-card aprobado">
          <h3>Aprobados</h3>
          <p>₲{totalAceptados.toLocaleString()}</p>
        </div>
        <div className="resumen-card pendiente">
          <h3>Pendientes</h3>
          <p>₲{totalPendientes.toLocaleString()}</p>
        </div>
        <div className="resumen-card verificando">
          <h3>Verificando</h3>
          <p>₲{totalverificando.toLocaleString()}</p>
        </div>
        <div className="resumen-card rechazado">
          <h3>Rechazados</h3>
          <p>₲{totalRechazados.toLocaleString()}</p>
        </div>
      </div>

      {/* 🔹 Tabla de clientes */}
      <div className="DetallesBanco-table-container">
        <table>
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>MONTO SOLICITADO</th>
              <th>FECHA</th>
              <th>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente, index) => (
              <tr key={index}>
                <td>{cliente.nombre}</td>
                <td>₲{cliente.monto.toLocaleString()}</td>
                <td>{cliente.fecha}</td>
                <td className={`estado-${cliente.estado.toLowerCase()}`}>{cliente.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 🔹 Paginación */}
      <div className="DetallesBanco-pagination">
        <button onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1}>
          ← Anterior
        </button>
        <span>Página {paginaActual} de {totalPaginas}</span>
        <button onClick={() => setPaginaActual(paginaActual + 1)} disabled={paginaActual === totalPaginas}>
          Siguiente →
        </button>
      </div>

      {/* 🔹 Botón para volver a Bancos */}
      <button className="DetallesBanco-volver" onClick={() => navigate("/bancos")}>
        ⬅ Volver a Bancos
      </button>
    </div>
  );
};

export default DetallesBanco;








