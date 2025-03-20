import React, { useState } from "react";
import "./Mensajes.css";

const Mensajes = () => {
  const [filaExpandida, setFilaExpandida] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const mensajesPorPagina = 5;


  // Lista de mensajes simulada
  const mensajes = [
    {
      documento: "12345678",
      nombre: "Juan Pérez",
      banco: "Banco Nacional",
      monto: "₲700.000.000",
      fechaCarga: "12-Mar-2025",
      estado: "Aprobado",
      mensaje: "Solicitud procesada con éxito.",
      historialMensajes: [
        {
          fechaHora: "10-Mar-2025 10:00 AM",
          usuario: "Broker1",
          mensaje: "Solicitud enviada al banco",
          estado: "Pendiente",
        },
        {
          fechaHora: "11-Mar-2025 03:30 PM",
          usuario: "Banco Nacional",
          mensaje: "Verificando documentos",
          estado: "Verificando",
        },
        {
          fechaHora: "12-Mar-2025 02:00 PM",
          usuario: "Banco Nacional",
          mensaje: "Solicitud procesada con éxito.",
          estado: "Aprobado",
        },
      ],
    },
    {
      documento: "87654321",
      nombre: "María Gómez",
      banco: "Banco Visión",
      monto: "₲15.000.000",
      fechaCarga: "13-Mar-2025",
      estado: "Pendiente",
      mensaje: "Falta verificación de documentos.",
      historialMensajes: [
        {
          fechaHora: "11-Mar-2025 09:15 AM",
          usuario: "Broker2",
          mensaje: "Solicitud enviada al banco",
          estado: "Pendiente",
        },
      ],
    },
  ];

  // 🔹 Funciones de Paginación
  const totalPaginas = Math.ceil(mensajes.length / mensajesPorPagina);
  const indiceInicial = (paginaActual - 1) * mensajesPorPagina;
  const indiceFinal = indiceInicial + mensajesPorPagina;
  const mensajesPaginados = mensajes.slice(indiceInicial, indiceFinal);

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };
  const toggleDetalles = (documento) => {
    setFilaExpandida((prev) => (prev === documento ? null : documento));
  };

  return (
    <div className="mensajes-container">
      <h1 className="mensajes-title">Mensajes de Solicitudes</h1>

      <table className="mensajes-table-container">
        <thead>
          <tr>
            <th>Documento</th>
            <th>Nombre</th>
            <th>Banco</th>
            <th>Monto del Préstamo</th>
            <th>Fecha de Carga</th>
            <th>Estado</th>
            <th>Mensaje</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {mensajesPaginados.map((mensaje, index) => (
            <React.Fragment key={index}>
              {/* 🔹 Fila principal */}
              <tr>
                <td>{mensaje.documento}</td>
                <td>{mensaje.nombre}</td>
                <td>{mensaje.banco}</td>
                <td>{mensaje.monto}</td>
                <td>{mensaje.fechaCarga}</td>
                <td>
                  <span className={`estado-${mensaje.estado.toLowerCase()}`}>
                    {mensaje.estado}
                  </span>
                </td>
                <td>{mensaje.mensaje}</td>
                <td>
                  <button
                    className="ver-mas-btn"
                    onClick={() => toggleDetalles(mensaje.documento)}
                  >
                    {filaExpandida === mensaje.documento ? "Cerrar" : "Ver Más"}
                  </button>
                </td>
              </tr>

              {/* 🔹 Fila expandida con tabla de log de mensajes */}
              {filaExpandida === mensaje.documento && (
                <tr className="detalles-fila">
                  <td colSpan="8">
                      <h2>Historial de Mensajes</h2>
                      <table className="log-mensajes-table">
                        <thead>
                          <tr>
                            <th>Fecha y Hora</th>
                            <th>Usuario</th>
                            <th>Mensaje</th>
                            <th>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mensaje.historialMensajes && mensaje.historialMensajes.length > 0 ? (
                          mensaje.historialMensajes.map((log, logIndex) => (
                            <tr key={logIndex}>
                              <td>{log.fechaHora}</td>
                              <td>{log.usuario}</td>
                              <td>{log.mensaje}</td>
                              <td className={`estado-${log.estado.toLowerCase()}`}>
                                {log.estado}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4">No hay mensajes registrados.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    {/* 🔹 Paginación */}
    <div className="mensajes-pagination">
        <button onClick={paginaAnterior} disabled={paginaActual === 1} className="pagination-btn">
          ← Anterior
        </button>
        <span className="pagina-texto">
          Página {paginaActual} de {totalPaginas}
        </span>
        <button onClick={paginaSiguiente} disabled={paginaActual === totalPaginas} className="pagination-btn">
          Siguiente →
        </button>
      </div>
    </div>
  );
};


export default Mensajes;




