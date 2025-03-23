import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import "./ClienteDetalle.css";

const ClienteDetalle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(location.state?.cliente || null);
  const [documentosNuevos, setDocumentosNuevos] = useState([]);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (cliente?.documento) {
      fetch(`${API_BASE.clientes}/${cliente.documento}`)
        .then((res) => res.json())
        .then((data) => setCliente(data))
        .catch((err) => console.error("Error al cargar cliente:", err));
    }
  }, [cliente?.documento]);

  if (!cliente) {
    return <p>No se encontró información del cliente.</p>;
  }

  const handleFileChange = (e) => {
    setDocumentosNuevos(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (documentosNuevos.length === 0) {
      alert("Selecciona al menos un documento para subir.");
      return;
    }

    const formData = new FormData();
    documentosNuevos.forEach((file) => {
      formData.append("archivos", file);
    });

    try {
      const res = await fetch(`${API_BASE.clientes}/${cliente.documento}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Archivos subidos con éxito:", JSON.stringify(data.archivos));

        const updatedCliente = await fetch(`${API_BASE.clientes}/${cliente.documento}`);
        const clienteActualizado = await updatedCliente.json();
        setCliente(clienteActualizado);
      } else {
        throw new Error(data.error || "Error al subir documentos");
      }
      setDocumentosNuevos([]);
    } catch (err) {
      console.error("Error al subir documentos:", err);
      alert("❌ Error al subir documentos");
    }
  };

  const handleDescargarTodo = () => {
    if (!cliente.documentos) return;

    Object.values(cliente.documentos).flat().forEach((file) => {
      if (typeof file === "string") {
        const link = document.createElement("a");
        link.href = file;
        link.download = file.split("/").pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  return (
    <div className="cliente-detalle-container">
      <h1>Ficha del Cliente</h1>

      <div className="detalle-content">
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

        <div className="datos-adicionales">
          <h2>Datos Laborales</h2>
          <p><strong>Empresa:</strong> {cliente.empresa}</p>
          <p><strong>RUC:</strong> {cliente.ruc}</p>
          <p><strong>Actividad Empresa:</strong> {cliente.actividadEmpresa}</p>
          <p><strong>Ingresos:</strong> ₲{cliente.ingresos?.toLocaleString()}</p>
          <p><strong>Fecha de Cobro:</strong> {cliente.fechaCobro}</p>
        </div>

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

        <div className="datos-adicionales">
          <h2>Datos del Préstamo</h2>
          <p><strong>Banco:</strong> {cliente.banco || cliente.bancoSeleccionado}</p>
          <p><strong>Monto del Préstamo:</strong> ₲{(cliente.montosolicitado || cliente.monto)?.toLocaleString()}</p>
          <p><strong>Plazo:</strong> {cliente.plazo}</p>
          <p><strong>Destino:</strong> {cliente.destino}</p>
          <p><strong>Estado:</strong> {cliente.estado}</p>
        </div>

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
                        {typeof file === "string" ? (
                          <a href={file} target="_blank" rel="noopener noreferrer">
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

          {userRole === "broker" && (
            <div className="adjuntar-nuevos">
              <h3>Agregar Documentos</h3>
              <input type="file" multiple onChange={handleFileChange} />
              <button onClick={handleUpload}>Subir Documentos</button>
            </div>
          )}

          <button onClick={handleDescargarTodo} className="descargar-lote">⬇ Descargar Todos</button>
        </div>
      </div>

      <button className="volver-button" onClick={() => navigate(-1)}>⬅ Volver</button>
    </div>
  );
};

export default ClienteDetalle;

