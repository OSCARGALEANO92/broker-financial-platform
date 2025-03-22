import React, { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Clientes.css";

const Clientes = () => {
  const { clientes, setClientes } = useContext(GlobalContext); // Obtener clientes desde el contexto

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

 // Filtro de clientes
 const filteredClientes = clientes.filter((cliente) => {
  return (
    (searchDocumento === "" || cliente.documento.includes(searchDocumento)) &&
    (selectedEstado === "" || cliente.estado === selectedEstado) &&
    (selectedBanco === "" || cliente.banco === selectedBanco)
  );
});

  // Índices para la paginación
  const indiceInicial = (paginaActual - 1) * clientesPorPagina;
  const indiceFinal = indiceInicial + clientesPorPagina;
  const clientesPaginados = filteredClientes.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(filteredClientes.length / clientesPorPagina);

  // Funciones de paginación
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

  // Manejar cambios en el mensaje
  const handleMensajeChange = (id, value) => {
    setMensajes((prevMensajes) => ({
      ...prevMensajes,
      [id]: value,
    }));
  };

  // Manejar cambios en el estado
  const handleEstadoChange = (id, value) => {
    setEstados((prevEstados) => ({
      ...prevEstados,
      [id]: value,
    }));
  };

  // Guardar la acción
  const handleGuardar = (id) => {
    const mensaje = mensajes[id] || "";
    const nuevoEstado = estados[id] || "Pendiente";

    if (userRole === "banco" && mensaje.trim() === "") {
      alert("❌ Debes escribir un mensaje antes de actualizar el estado.");
      return;
    }

    const cliente = clientes.find((c) => c.id === id);
    if (!cliente) return;

    const nuevoMensaje = {
      ...cliente, // Enviar toda la ficha del cliente
      mensaje,
      estado: nuevoEstado,
    };

    fetch("http://localhost:4000/mensajes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoMensaje),
    })
      .then((res) => res.json())
      .then((data) => {
        setMensajes((prev) => ({
          ...prev,
          [cliente.documento]: mensaje,
        }));

        setClientes((prevClientes) =>
          prevClientes.map((c) =>
            c.id === id ? { ...c, estado: nuevoEstado } : c
          )
        );

        setActiveMenu(null);
        alert(`✅ Cliente ${id}: Estado actualizado a "${nuevoEstado}" con mensaje: "${mensaje}"`);
      })
      .catch((err) => console.error("Error al enviar mensaje:", err));
  };
   // Exportar a Excel
   const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredClientes.map(cliente => ({
      Fechacreacion: cliente.fechaCreacion,
      Documento: cliente.documento,
      Nombre: cliente.nombre,
      "Monto Solicitado": cliente.montosolicitado,
      Banco: cliente.banco,
      Estado: cliente.estado,
      Fecha: cliente.fecha,
      "Último Mensaje": mensajes[cliente.documento] || ""
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clientes Filtrados");
    XLSX.writeFile(wb, "Clientes_Filtrados.xlsx");
  };

  // Exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Clientes", 14, 10);
    autoTable(doc, {
      head: [["Fecha Creacion", "Documento", "Nombre", "Teléfono", "Dirección", "Préstamo", "Banco", "Estado", "Fecha"]],
      body: filteredClientes.map((cliente) => [
        cliente.fechaCreacion,
        cliente.documento,
        cliente.nombre,
        cliente.montosolicitado,
        cliente.banco,
        cliente.estado,
        cliente.fecha,
        mensajes[cliente.documento] || ""
      ]),
    });
    doc.save("Clientes.pdf");
  };

  return (
    <div className="clientes-container">
      <h1 className="clientes-title">Lista de Clientes</h1>

      {/* Filtros */}
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
            <th>Fecha</th>
            <th>Último Mensaje</th>
            <th>Detalles</th>
            {/* **✅ Mostrar Acciones solo si el usuario es "banco"** */}
            {(userRole === "banco" || userRole === "broker") && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {filteredClientes.map((cliente, index) => (
            <tr key={index}>
              <td className="centrado">{cliente.fechaCreacion}</td>
              <td className="centrado">{cliente.documento}</td>
              <td className="centrado">{cliente.nombres || cliente.nombre}</td>
              <td className="centrado">{cliente.montosolicitado}</td>
              <td className="centrado">{cliente.banco}</td>
              <td className={`estado-${(cliente.estado || '').toLowerCase()}`}>{cliente.estado || "Sin estado"}</td>
              <td>{cliente.fecha}</td>
              <td>{mensajes[cliente.documento] || "Sin mensajes"}</td>
              <td>
                <button className="clientes-button" onClick={() => handleVerDetalles(cliente)}>
                  Ver Detalles
                </button>
              </td>
            {/* **✅ Mostrar el botón de Acciones solo si el usuario es "banco"** */}
            {(userRole === "banco" || userRole === "broker") && (
            <td className="acciones-container">
            {/* Botón de Acciones */}
            <button 
              className="acciones-btn" 
              onClick={() => setActiveMenu(activeMenu === cliente.id ? null : cliente.id)}
            >
              📋 Acciones
            </button>

            {/* Menú desplegable */}
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
                <textarea 
                  className="mensaje-textarea" 
                  placeholder="Mensaje..."
                  value={mensajes[cliente.id] || ""}
                  onChange={(e) => handleMensajeChange(cliente.id, e.target.value)}
                ></textarea>
                </>
              )}
              {userRole === "broker" && (
                        <textarea
                          className="mensaje-textarea"
                          placeholder="Mensaje..."
                          value={mensajes[cliente.id] || ""}
                          onChange={(e) => handleMensajeChange(cliente.id, e.target.value)}
                        ></textarea>
              )}
                <button className="enviar-mensaje" onClick={() => handleGuardar(cliente.id)}>
                  {userRole === "banco" ? "Verificar" : "Enviar"}</button>
              </div>
            )}
          </td>  
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📌 Paginación */}
      <div className="clientes-pagination">
        <button onClick={anteriorPagina} disabled={paginaActual === 1}>
          ← Anterior
          </button>
        <button onClick={siguientePagina} disabled={paginaActual === totalPaginas}>
          Siguiente →
          </button>
      </div>
    </div>
  );
};

export default Clientes;



















