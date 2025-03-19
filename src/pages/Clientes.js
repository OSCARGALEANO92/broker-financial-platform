import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Clientes.css";

const Clientes = () => {
  const [clientes, setClientes] = useState([
    { id: 1, fechaCreacion: "10-Mar-2025", documento: "12345678", nombre: "Juan Pérez", telefono: "0981-123456", direccion: "Asunción, Paraguay", montosolicitado: "₲10.000.000", banco: "Banco Nacional", estado: "Aprobado", fecha: "14-Mar-2025" },
    { id: 2, fechaCreacion: "11-Mar-2025", documento: "87654321", nombre: "María Gómez", telefono: "0982-654321", direccion: "Luque, Paraguay", montosolicitado: "₲15.000.000", banco: "Banco Visión", estado: "Pendiente", fecha: "15-Mar-2025" },
    { id: 3, fechaCreacion: "12-Mar-2025", documento: "23456789", nombre: "Carlos Rodríguez", telefono: "0983-789123", direccion: "San Lorenzo, Paraguay", montosolicitado: "₲20.000.000", banco: "Banco Itau", estado: "Rechazado", fecha: "16-Mar-2025" },
    { id: 4, fechaCreacion: "13-Mar-2025", documento: "56789012", nombre: "Ana López", telefono: "0984-567890", direccion: "Encarnación, Paraguay", montosolicitado: "₲12.000.000", banco: "Banco Continental", estado: "Aprobado", fecha: "17-Mar-2025" },
    { id: 5, fechaCreacion: "14-Mar-2025", documento: "67890123", nombre: "Pedro González", telefono: "0985-678901", direccion: "Ciudad del Este, Paraguay", montosolicitado: "₲9.000.000", banco: "Banco Atlas", estado: "Pendiente", fecha: "18-Mar-2025" }
  ]);

  const navigate = useNavigate();
  const [searchDocumento, setSearchDocumento] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [selectedBanco, setSelectedBanco] = useState("");
  const userRole = localStorage.getItem("userRole");
  const [mensajes, setMensajes] = useState({});
  const [estados, setEstados] = useState({});
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 6;

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
  const clientesPaginados = clientes.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(clientes.length / clientesPorPagina);

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

  // 🔹 Actualizar el estado del cliente en la lista
  setClientes((prevClientes) =>
    prevClientes.map((cliente) =>
      cliente.id === id ? { ...cliente, estado: nuevoEstado } : cliente
    )
  );
  alert(`✅ Cliente ${id}: Estado actualizado a "${nuevoEstado}" con mensaje: "${mensaje}"`);
};

   // Exportar a Excel
   const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredClientes.map(cliente => ({
      Fechacreacion: cliente.fechaCreacion,
      Documento: cliente.documento,
      Nombre: cliente.nombre,
      Teléfono: cliente.telefono,
      Dirección: cliente.direccion,
      Préstamo: cliente.montosolicitado,
      Banco: cliente.banco,
      Estado: cliente.estado,
      Fecha: cliente.fecha,
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
      head: [["Documento", "Nombre", "Teléfono", "Dirección", "Préstamo", "Banco", "Estado", "Fecha"]],
      body: filteredClientes.map((cliente) => [
        cliente.fechaCreacion,
        cliente.documento,
        cliente.nombre,
        cliente.telefono,
        cliente.direccion,
        cliente.montosolicitado,
        cliente.banco,
        cliente.estado,
        cliente.fecha,
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
            <th className="centrado">Teléfono</th>
            <th>Dirección</th>
            <th>Monto solicitado</th>
            <th>Banco</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Detalles</th>
            {/* **✅ Mostrar Acciones solo si el usuario es "banco"** */}
            {userRole === "banco" && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {filteredClientes.map((cliente, index) => (
            <tr key={index}>
              <td className="centrado">{cliente.fechaCreacion}</td>
              <td className="centrado">{cliente.documento}</td>
              <td className="centrado">{cliente.nombre}</td>
              <td className="centrado">{cliente.telefono}</td>
              <td className="centrado">{cliente.direccion}</td>
              <td className="centrado">{cliente.montosolicitado}</td>
              <td className="centrado">{cliente.banco}</td>
              <td className={`estado-${cliente.estado.toLowerCase()}`}>{cliente.estado}</td>
              <td>{cliente.fecha}</td>
              <td>
                <button className="clientes-button" onClick={() => handleVerDetalles(cliente)}>
                  Ver Detalles
                </button>
              </td>
            {/* **✅ Mostrar el botón de Acciones solo si el usuario es "banco"** */}
            {userRole === "banco" && (
                <td>
                  <select 
                  className="accion-select"
                  value={estados[cliente.id] || cliente.estado}
                  onChange={(e) => handleEstadoChange(cliente.id, e.target.value)}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aceptado">Aceptar</option>
                    <option value="Rechazado">Rechazar</option>
                  </select>
                  <textarea 
                  className="mensaje-textarea" 
                  placeholder="Escribe un mensaje..."
                  value={mensajes[cliente.id] || ""}
                    onChange={(e) => handleMensajeChange(cliente.id, e.target.value)}
                    ></textarea>
                  <button className="enviar-mensaje" onClick={() => handleGuardar(cliente.id)}
                    >Enviar
                    </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📌 Paginación */}
      <div className="clientes-pagination">
        <button onClick={anteriorPagina} disabled={paginaActual === 1}>
          ← Prev
          </button>
        <button onClick={siguientePagina} disabled={paginaActual === totalPaginas}>
          Next →
          </button>
      </div>
    </div>
  );
};

export default Clientes;



















