import React, { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import "./Mensajes.css";

const Mensajes = () => {
  const { mensajes, clientes } = useContext(GlobalContext);
  const [filaExpandida, setFilaExpandida] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const mensajesPorPagina = 10;

  // Agrupar mensajes por documento
  const mensajesAgrupados = mensajes.reduce((acc, mensaje) => {
    if (!acc[mensaje.documento]) acc[mensaje.documento] = [];
    acc[mensaje.documento].push(mensaje);
    return acc;
  }, {});

  // Convertir a array para paginar
  const mensajesPorCliente = Object.entries(mensajesAgrupados).map(([documento, historial]) => {
    const cliente = clientes.find((c) => c.documento === documento);
    const ultimo = historial[historial.length - 1];

    return {
      documento,
      nombre: cliente?.nombre || historial[0]?.nombre || "Sin nombre",
      banco: cliente?.banco || "-",
      monto: cliente?.montosolicitado?.toLocaleString() || "-",
      fechaCarga: cliente?.fechaCreacion ? new Date(cliente.fechaCreacion).toLocaleDateString() : "-",
      estado: cliente?.estado || ultimo.estado,
      mensaje: ultimo.mensaje,
      historial
    };
  });

  const totalPaginas = Math.ceil(mensajesPorCliente.length / mensajesPorPagina);
  const mensajesPaginados = mensajesPorCliente.slice(
    (paginaActual - 1) * mensajesPorPagina,
    paginaActual * mensajesPorPagina
  );

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
          {mensajesPaginados.map((cliente, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>{cliente.documento}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.banco}</td>
                <td>{cliente.monto}</td>
                <td>{cliente.fechaCarga}</td>
                <td>
                  <span className={`estado-${cliente.estado?.toLowerCase() || "sin-estado"}`}>
                    {cliente.estado}
                  </span>
                </td>
                <td>{cliente.mensaje}</td>
                <td>
                  <button className="ver-mas-btn" onClick={() => toggleDetalles(cliente.documento)}>
                    {filaExpandida === cliente.documento ? "Cerrar" : "Ver Más"}
                  </button>
                </td>
              </tr>

              {filaExpandida === cliente.documento && (
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
                        {cliente.historial.map((msg, i) => (
                          <tr key={i}>
                            <td>{new Date(msg.fecha).toLocaleString()}</td>
                            <td>{msg.nombre}</td>
                            <td>{msg.mensaje}</td>
                            <td className={`estado-${msg.estado.toLowerCase()}`}>{msg.estado}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="mensajes-pagination">
        <button onClick={() => setPaginaActual(p => Math.max(p - 1, 1))} disabled={paginaActual === 1}>
          ← Anterior
        </button>
        <span>Página {paginaActual} de {totalPaginas}</span>
        <button onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))} disabled={paginaActual === totalPaginas}>
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default Mensajes;







