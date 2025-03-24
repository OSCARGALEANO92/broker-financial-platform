import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { API_BASE } from "../config";
import "./Bancos.css";

const Bancos = () => {
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();
  const { clientes } = useContext(GlobalContext);

  const [bancos, setBancos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [nuevaTasa, setNuevaTasa] = useState({});
  const [nuevoBanco, setNuevoBanco] = useState({ entidad: "", tasaInteres: "" });

  useEffect(() => {
    fetch(API_BASE.bancos)
      .then(res => res.json())
      .then(setBancos)
      .catch(err => console.error("Error al cargar bancos:", err));
  }, []);

  const calcularCantidadSolicitudes = (nombreBanco) => {
    return clientes.filter(cliente => cliente.banco === nombreBanco).length;
  };

  const handleTasaChange = (id, value) => {
    setNuevaTasa(prev => ({ ...prev, [id]: value }));
  };

  const guardarCambios = () => {
    const actualizaciones = Object.entries(nuevaTasa).map(([id, tasa]) => {
      return fetch(`${API_BASE.bancos}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasaInteres: tasa, usuario: userRole })
      });
    });

    Promise.all(actualizaciones)
      .then(() => {
        alert("✅ Tasa de interés actualizada con éxito.");
        window.location.reload();
      })
      .catch(err => console.error("Error al guardar cambios:", err));
  };

  const handleViewDetails = (nombreBanco) => {
    navigate(`/bancos/${encodeURIComponent(nombreBanco)}`);
  };

  const agregarBanco = () => {
    if (!nuevoBanco.entidad || !nuevoBanco.tasaInteres) return alert("Completa los campos del nuevo banco");

    fetch(API_BASE.bancos, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...nuevoBanco, usuario: userRole })
    })
      .then(res => res.json())
      .then(() => {
        alert("✅ Banco agregado");
        setNuevoBanco({ entidad: "", tasaInteres: "" });
        window.location.reload();
      })
      .catch(err => console.error("Error al agregar banco:", err));
  };

  const eliminarBanco = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este banco?")) return;

    fetch(`${API_BASE.bancos}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario: userRole })
    })
      .then(() => {
        alert("🗑 Banco eliminado");
        setBancos(prev => prev.filter(b => b.id !== id));
      })
      .catch(err => console.error("Error al eliminar banco:", err));
  };

  return (
    <div className="bancos-table-container">
      <h1 className="bancos-title">Bancos Asociados</h1>
      <p className="bancos-description">
        Aquí puedes ver la lista de bancos y la cantidad de solicitudes de préstamo asociadas a cada uno.
      </p>

      {(userRole === "admin" || userRole === "broker") && (
        <button className="editar-btn" onClick={() => setEditando(!editando)}>
          {editando ? "Cancelar" : "✏️ Editar Tasa de Interés"}
        </button>
      )}

      {(userRole === "admin") && (
        <div className="nuevo-banco-form">
          <input
            type="text"
            placeholder="Nombre del banco"
            value={nuevoBanco.entidad}
            onChange={(e) => setNuevoBanco(prev => ({ ...prev, entidad: e.target.value }))}
          />
          <input
            type="number"
            step="0.1"
            placeholder="Tasa de interés"
            value={nuevoBanco.tasaInteres}
            onChange={(e) => setNuevoBanco(prev => ({ ...prev, tasaInteres: e.target.value }))}
          />
          <button onClick={agregarBanco}>➕ Agregar Banco</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Banco</th>
            <th>Cantidad de Solicitudes</th>
            <th>Tasa de Interés (%)</th>
            <th>Detalles</th>
            {userRole === "admin" && <th>Acción</th>}
          </tr>
        </thead>
        <tbody>
          {bancos.map((banco) => (
            <tr key={banco.id}>
              <td>{banco.entidad}</td>
              <td>{calcularCantidadSolicitudes(banco.entidad)}</td>
              <td>
                {editando ? (
                  <input
                    type="number"
                    step="0.1"
                    value={nuevaTasa[banco.id] !== undefined ? nuevaTasa[banco.id] : banco.tasaInteres}
                    onChange={(e) => handleTasaChange(banco.id, e.target.value)}
                    className="tasa-input"
                  />
                ) : (
                  `${banco.tasaInteres} %`
                )}
              </td>
              <td>
                <button className="bancos-details-button" onClick={() => handleViewDetails(banco.entidad)}>
                  🔍 Ver Detalles
                </button>
              </td>
              {userRole === "admin" && (
                <td>
                  <button className="bancos-delete-button" onClick={() => eliminarBanco(banco.id)}>
                    🗑 Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {editando && (
        <button className="guardar-btn" onClick={guardarCambios}>
          💾 Guardar Cambios
        </button>
      )}
    </div>
  );
};

export default Bancos;













