import React, { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext"; // Importar el contexto global
import "./Mensajes.css";

const Mensajes = () => {
  const { mensajes, clientes, agregarMensaje, setClientes } = useContext(GlobalContext);
  const [filaExpandida, setFilaExpandida] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const mensajesPorPagina = 10;

  if (!Array.isArray(mensajes)) {
    return <p>Error: los mensajes no se pudieron cargar correctamente.</p>;
  }
 
 const mensajesCompletos = mensajes.map((m) => {
  const cliente = clientes.find((c) => c.documento === m.documento);
  return {
    ...m,
    banco: cliente?.banco || "-",
    monto: cliente?.montosolicitado?.toLocaleString() || "-",
    estado: cliente?.estado || "-",
    fechaCarga: cliente?.fechaCreacion ? new Date(cliente.fechaCreacion).toLocaleDateString() : "-",
  };
}); 

  // 🔹 Funciones de Paginación
  const totalPaginas = Math.ceil(mensajesCompletos.length / mensajesPorPagina);
  const indiceInicial = (paginaActual - 1) * mensajesPorPagina;
  const indiceFinal = indiceInicial + mensajesPorPagina;
  const mensajesPaginados = mensajesCompletos.slice(indiceInicial, indiceFinal);

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };
  const toggleDetalles = (documento) => {
    setFilaExpandida((prev) => (prev === documento ? null : documento));
  };

  const handleGuardar = (id) => {
    const cliente = clientes.find((c) => c.id === id);
    const mensajeTexto = mensajes[id];
    const nuevoEstado = cliente?.estado;

    if (!cliente || !mensajeTexto || !nuevoEstado) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const nuevoMensaje = {
      documento: cliente.documento,
      nombre: cliente.nombre,
      mensaje: mensajeTexto,
      estado: nuevoEstado,
    };

    fetch("http://localhost:4000/mensajes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoMensaje),
    })
      .then((res) => res.json())
      .then((data) => {
        agregarMensaje(data);
        setClientes((prevClientes) =>
          prevClientes.map((c) =>
            c.id === id ? { ...c, estado: nuevoEstado } : c
          )
        );
        alert(
          `✅ Cliente ${cliente.nombre}: Estado actualizado a "${nuevoEstado}" con mensaje: "${mensajeTexto}"`
        );
      })
      .catch((err) => console.error("Error al enviar mensaje:", err));

    setFilaExpandida(null);
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
                <span className={`estado-${mensaje?.estado?.toLowerCase() || 'sin-estado'}`}>
                 {mensaje?.estado || 'Sin estado'}
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




