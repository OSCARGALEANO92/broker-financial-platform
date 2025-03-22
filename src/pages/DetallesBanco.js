import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import "./DetallesBanco.css";


// ✅ Función para dar formato a fechas
const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const DetallesBanco = () => {
  const navigate = useNavigate();
  const { nombreBanco } = useParams();
  const bancoMostrar = nombreBanco ? decodeURIComponent(nombreBanco) : "Desconocido";
  const { clientes } = useContext(GlobalContext);

  const clientesBanco = clientes.filter(cliente => cliente.banco === bancoMostrar);

  // Estado para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 10;

  // Calcular índices para paginación
  const indiceInicial = (paginaActual - 1) * clientesPorPagina;
  const indiceFinal = indiceInicial + clientesPorPagina;
  const clientesPaginados = clientesBanco.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(clientesBanco.length / clientesPorPagina);

  // 🔹 Calcular montos totales por estado
  const calcularTotalPorEstado = (estado) =>
    clientesBanco
      .filter(cliente => cliente.estado === estado)
      .reduce((sum, cliente) => sum + (parseFloat(cliente.montosolicitado) || 0), 0);

  return (
    <div className="DetallesBanco-container">
      {/* 🔹 Título del Banco */}
      <h1 className="DetallesBanco-title">Clientes de <span>{bancoMostrar}</span></h1>
      <p className="DetallesBanco-description">
        A continuación, se muestra la lista de clientes que solicitaron préstamos en este banco.
      </p>

      {/* 🔹 Cuadros de resumen de montos por estado */}
      <div className="DetallesBanco-resumen">
        {["Aprobado", "Pendiente", "Verificando", "Rechazado"].map(estado => (
          <div key={estado} className={`resumen-card ${estado.toLowerCase()}`}>
            <h3>{estado}</h3>
            <p>₲{calcularTotalPorEstado(estado).toLocaleString()}</p>
          </div>
        ))}
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
          {clientesPaginados.length > 0 ? (
              clientesPaginados.map((cliente, index) => (
                <tr key={index}>
                  <td>{cliente.nombre || cliente.nombres}</td>
                  <td>₲{parseFloat(cliente.montosolicitado).toLocaleString()}</td>
                  <td>{formatFecha(cliente.fechaCreacion)}</td>
                  <td className={`estado-${cliente.estado?.toLowerCase()}`}>{cliente.estado}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay clientes registrados en este banco.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="DetallesBanco-pagination">
        <button onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1}>
          ← Anterior
        </button>
        <span>Página {paginaActual} de {totalPaginas}</span>
        <button onClick={() => setPaginaActual(paginaActual + 1)} disabled={paginaActual === totalPaginas}>
          Siguiente →
        </button>
      </div>

      {/* Botón de regreso */}
      <button className="DetallesBanco-volver" onClick={() => navigate("/bancos")}>
        ⬅ Volver a Bancos
      </button>
    </div>
  );
};

export default DetallesBanco;








