import React, { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Clientes.css";
import { API_BASE } from "../config";

const Clientes = () => {
  const { clientes, setClientes } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [searchDocumento, setSearchDocumento] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [selectedBanco, setSelectedBanco] = useState("");
  const userRole = localStorage.getItem("userRole");
  const [activeMenu, setActiveMenu] = useState(null);
  const [estados, setEstados] = useState({});
  const [mensajes, setMensajes] = useState({});
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 10;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".acciones-menu") && !event.target.closest(".acciones-btn")) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const filteredClientes = clientes.map((cliente) => {
    const historial = cliente.historialMensajes || [];
    const ultimo = historial[historial.length - 1];

    return {
      ...cliente,
      ultimoMensaje: ultimo?.mensaje || mensajes[cliente.documento] || "Sin mensajes",
      ultimaFecha: ultimo?.fecha || cliente.fecha || "",
    };
  }).filter((cliente) => {
    return (
      (searchDocumento === "" || cliente.documento.includes(searchDocumento)) &&
      (selectedEstado === "" || cliente.estado === selectedEstado) &&
      (selectedBanco === "" || cliente.banco === selectedBanco)
    );
  });

  const indiceInicial = (paginaActual - 1) * clientesPorPagina;
  const indiceFinal = indiceInicial + clientesPorPagina;
  const clientesPaginados = filteredClientes.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(filteredClientes.length / clientesPorPagina);

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const anteriorPagina = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const handleVerDetalles = (cliente) => {
    navigate(`/clientes/${cliente.documento}`, { state: { cliente } });
  };

  const handleMensajeChange = (id, value) => {
    setMensajes((prevMensajes) => ({
      ...prevMensajes,
      [id]: value,
    }));
  };

  const handleEstadoChange = (id, value) => {
    setEstados((prevEstados) => ({
      ...prevEstados,
      [id]: value,
    }));
  };

  const handleGuardar = (id) => {
    const mensaje = mensajes[id] || "";
    const cliente = clientes.find((c) => c.id === id);
    if (!cliente) return;

    let nuevoEstado = cliente.estado;

    if (userRole === "banco") {
      nuevoEstado = estados[id] || "Pendiente";
      if (mensaje.trim() === "") {
        alert("❌ Debes escribir un mensaje antes de actualizar el estado.");
        return;
      }
    }

    const nuevoMensaje = {
      ...cliente,
      mensaje,
      estado: nuevoEstado,
    };

    fetch(API_BASE.mensajes, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoMensaje),
    })
      .then((res) => res.json())
      .then((data) => {
        const mensajeFinal = data.historialMensajes?.slice(-1)[0]?.mensaje || mensaje;
        const fechaActualizacion = data.historialMensajes?.slice(-1)[0]?.fecha || new Date().toISOString();

        setMensajes((prev) => ({
          ...prev,
          [cliente.documento]: mensajeFinal,
        }));

        setClientes((prevClientes) =>
          prevClientes.map((c) =>
            c.id === id
              ? {
                  ...c,
                  estado: nuevoEstado,
                  fecha: fechaActualizacion,
                  historialMensajes: data.historialMensajes,
                }
              : c
          )
        );

        setActiveMenu(null);
        alert(`✅ Cliente ${id}: ${userRole === "banco" ? `Estado actualizado a \"${nuevoEstado}\"` : "Mensaje enviado"}`);
      })
      .catch((err) => console.error("Error al enviar mensaje:", err));
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredClientes.map((cliente) => ({
        "Fecha Creación": new Date(cliente.fechaCreacion).toLocaleString(),
        Documento: cliente.documento,
        Nombre: cliente.nombre,
        "Monto Solicitado": cliente.montosolicitado.toLocaleString(),
        Banco: cliente.banco,
        Estado: cliente.estado,
        "Fecha Actualización": cliente.ultimaFecha ? new Date(cliente.ultimaFecha).toLocaleString() : "-",
        "Último Mensaje": cliente.ultimoMensaje
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clientes Filtrados");
    XLSX.writeFile(wb, "Clientes_Filtrados.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Clientes", 14, 10);
    autoTable(doc, {
      head: [["Fecha Creación", "Documento", "Nombre", "Monto Solicitado", "Banco", "Estado", "Fecha Actualización", "Último Mensaje"]],
      body: filteredClientes.map((cliente) => [
        new Date(cliente.fechaCreacion).toLocaleString(),
        cliente.documento,
        cliente.nombre,
        cliente.montosolicitado.toLocaleString(),
        cliente.banco,
        cliente.estado,
        cliente.ultimaFecha ? new Date(cliente.ultimaFecha).toLocaleString() : "-",
        cliente.ultimoMensaje
      ]),
    });
    doc.save("Clientes.pdf");
  };

  return (
    <div className="clientes-container">
      <h1 className="clientes-title">Lista de Clientes</h1>

      <div className="clientes-filtros">
        <input type="text" placeholder="Buscar por documento" value={searchDocumento} onChange={(e) => setSearchDocumento(e.target.value)} className="clientes-input" />

        <select value={selectedEstado} onChange={(e) => setSelectedEstado(e.target.value)} className="clientes-select">
          <option value="">Filtrar por Estado</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Rechazado">Rechazado</option>
          <option value="Verificando">Verificando</option>
        </select>

        <select value={selectedBanco} onChange={(e) => setSelectedBanco(e.target.value)} className="clientes-select">
          <option value="">Filtrar por Banco</option>
          {[...new Set(clientes.map(cliente => cliente.banco))].map((banco, index) => (
            <option key={index} value={banco}>{banco}</option>
          ))}
        </select>

        <button onClick={exportToExcel} className="clientes-export-btn">Exportar Excel</button>
        <button onClick={exportToPDF} className="clientes-export-btn">Exportar PDF</button>
      </div>

      <table className="clientes-table-container">
        <thead>
          <tr>
            <th className="centrado">Fecha Creación</th>
            <th className="centrado">Documento</th>
            <th>Nombre</th>
            <th>Monto solicitado</th>
            <th>Banco</th>
            <th>Estado</th>
            <th>Fecha Actualización</th>
            <th>Último Mensaje</th>
            <th>Detalles</th>
            {(userRole === "banco" || userRole === "broker") && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {clientesPaginados.map((cliente, index) => (
            <tr key={index}>
              <td className="centrado">{new Date(cliente.fechaCreacion).toLocaleString()}</td>
              <td className="centrado">{cliente.documento}</td>
              <td className="centrado">{cliente.nombres || cliente.nombre}</td>
              <td className="centrado">{cliente.montosolicitado.toLocaleString()}</td>
              <td className="centrado">{cliente.banco}</td>
              <td className={`estado-${(cliente.estado || '').toLowerCase()}`}>{cliente.estado || "Sin estado"}</td>
              <td>{cliente.ultimaFecha ? new Date(cliente.ultimaFecha).toLocaleString() : "-"}</td>
              <td>{cliente.ultimoMensaje}</td>
              <td>
                <button className="clientes-button" onClick={() => handleVerDetalles(cliente)}>
                  Ver Detalles
                </button>
              </td>
              {(userRole === "banco" || userRole === "broker") && (
                <td className="acciones-container">
                  <button className="acciones-btn" onClick={() => setActiveMenu(activeMenu === cliente.id ? null : cliente.id)}>📋 Acciones</button>

                  {activeMenu === cliente.id && (
                    <div className="acciones-menu">
                      {userRole === "banco" && (
                        <>
                          <select value={estados[cliente.id] || cliente.estado} onChange={(e) => handleEstadoChange(cliente.id, e.target.value)} className="accion-select">
                            <option value="Pendiente">Pendiente</option>
                            <option value="Verificando">Verificando</option>
                            <option value="Aprobado">Aprobado</option>
                            <option value="Rechazado">Rechazado</option>
                          </select>
                          <textarea className="mensaje-textarea" placeholder="Mensaje..." value={mensajes[cliente.id] || ""} onChange={(e) => handleMensajeChange(cliente.id, e.target.value)}></textarea>
                        </>
                      )}
                      {userRole === "broker" && (
                        <textarea className="mensaje-textarea" placeholder="Mensaje..." value={mensajes[cliente.id] || ""} onChange={(e) => handleMensajeChange(cliente.id, e.target.value)}></textarea>
                      )}
                      <button className="enviar-mensaje" onClick={() => handleGuardar(cliente.id)}>
                        {userRole === "banco" ? "Verificar" : "Enviar"}
                      </button>
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="clientes-pagination">
        <button onClick={anteriorPagina} disabled={paginaActual === 1}>← Anterior</button>
        <button onClick={siguientePagina} disabled={paginaActual === totalPaginas}>Siguiente →</button>
      </div>
    </div>
  );
};

export default Clientes;



















