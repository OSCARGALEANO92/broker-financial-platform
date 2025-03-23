import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext"; // Importar el contexto global
import "./Bancos.css";

const Bancos = () => {
  const userRole = localStorage.getItem("userRole"); // Obtener rol del usuario
  const navigate = useNavigate();
  const { clientes } = useContext(GlobalContext); // Obtener clientes del contexto
  
  const bancosGuardados = JSON.parse(localStorage.getItem("bancosDisponibles")) || [
    { id: 1, entidad: "Banco Nacional de Fomento", tasaInteres: 12 },
    { id: 2, entidad: "Banco Sudameris", tasaInteres: 10.5 },
    { id: 3, entidad: "Banco Familiar", tasaInteres: 13 },
    { id: 4, entidad: "Banco Basa", tasaInteres: 9 },
    { id: 5, entidad: "Banco Ueno", tasaInteres: 9 },
    { id: 6, entidad: "Banco Itau", tasaInteres: 8 },
    { id: 7, entidad: "Banco GNB", tasaInteres: 10 },
  ];
  
  const [bancos, setBancos] = useState(bancosGuardados);
  const [editando, setEditando] = useState(false);
  const [nuevaTasa, setNuevaTasa] = useState({});

  useEffect(() => {
    localStorage.setItem("bancosDisponibles", JSON.stringify(bancos));
  }, [bancos]);

  // 🔹 Calcular la cantidad de solicitudes por banco
  const calcularCantidadSolicitudes = (nombreBanco) => {
    return clientes.filter(cliente => cliente.banco === nombreBanco).length;
  };

  // Manejar cambios en la tasa de interés
  const handleTasaChange = (id, value) => {
    setNuevaTasa((prev) => ({ ...prev, [id]: value }));
  };

  // Guardar cambios
  const guardarCambios = () => {
    const bancosActualizados = bancos.map((banco) =>
      nuevaTasa[banco.id] !== undefined
        ? { ...banco, tasaInteres: parseFloat(nuevaTasa[banco.id]) || banco.tasaInteres }
        : banco
    );

    setBancos(bancosActualizados);
    setEditando(false);
    alert("✅ Tasa de interés actualizada con éxito.");
    setEditando(false);
    alert("✅ Tasa de interés actualizada con éxito.");
  };

  // ✅ Enviar el nombre del banco en la URL correctamente
  const handleViewDetails = (nombreBanco) => {
    navigate(`/bancos/${encodeURIComponent(nombreBanco)}`);
  };

  return (
    <div className="bancos-table-container">
      <h1 className="bancos-title">Bancos Asociados</h1>
      <p className="bancos-description">
        Aquí puedes ver la lista de bancos y la cantidad de solicitudes de préstamo asociadas a cada uno.
      </p>

      {/* 🔹 Botón de editar (solo para Admin) */}
      {(userRole === "admin" || userRole === "broker") && (
        <button className="editar-btn" onClick={() => setEditando(!editando)}>
          {editando ? "Cancelar" : "✏️ Editar Tasa de Interés"}
        </button>
      )}

      
        <table>
          <thead>
            <tr>
              <th>Banco</th>
              <th>Cantidad de Solicitudes</th>
              <th>Tasa de Interés (%)</th>
              <th>Detalles</th>
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
                <td className="bancos-details-cell">
                  <button className="bancos-details-button" onClick={() => handleViewDetails(banco.entidad)}>
                    🔍 Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      {/* 🔹 Botón de Guardar Cambios (solo visible cuando se edita) */}
      {editando && (
        <button className="guardar-btn" onClick={guardarCambios}>
          💾 Guardar Cambios
        </button>
      )}
    </div>
  );
};

export default Bancos;










