import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Bancos.css";

const Bancos = () => {
  const userRole = localStorage.getItem("userRole"); // Obtener rol del usuario
  const navigate = useNavigate();
  
  const bancosGuardados = JSON.parse(localStorage.getItem("bancosDisponibles")) || [
    { id: 1, entidad: "Banco Nacional de Fomento", cantidad: 10, tasaInteres: 12 },
    { id: 2, entidad: "Banco Visión", cantidad: 15, tasaInteres: 10.5 },
    { id: 3, entidad: "Banco Familiar", cantidad: 8, tasaInteres: 13 },
    { id: 4, entidad: "Banco Basa", cantidad: 20, tasaInteres: 9 },
    { id: 5, entidad: "Banco Ueno", cantidad: 20, tasaInteres: 9 },
    { id: 6, entidad: "Banco Itau", cantidad: 15, tasaInteres: 8 },
  ];
  
  const [bancos, setBancos] = useState(bancosGuardados);
  const [editando, setEditando] = useState(false);
  const [nuevaTasa, setNuevaTasa] = useState({});

  useEffect(() => {
    localStorage.setItem("bancosDisponibles", JSON.stringify(bancos));
  }, [bancos]);

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

      <div className="bancos-table-container">
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
                <td>{banco.cantidad}</td>
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
      </div>

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










