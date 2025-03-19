import React from "react";
import { useNavigate } from "react-router-dom";
import "./Bancos.css";

const Bancos = () => {
  const bancos = [
    { id: 1, entidad: "Banco Nacional de Fomento", cantidad: 10, tasaInteres: "12%" },
    { id: 2, entidad: "Banco Visión", cantidad: 15, tasaInteres: "10.5%" },
    { id: 3, entidad: "Banco Familiar", cantidad: 8, tasaInteres: "13%" },
    { id: 4, entidad: "Banco Basa", cantidad: 20, tasaInteres: "9%" },
    { id: 5, entidad: "Banco Ueno", cantidad: 20, tasaInteres: "9%" },
    { id: 6, entidad: "Banco Itau", cantidad: 15, tasaInteres: "8%"},
  ];

  const navigate = useNavigate();

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

      <div className="bancos-table-container">
        <table>
          <thead>
            <tr>
              <th>Banco</th>
              <th>Cantidad de Solicitudes</th>
              <th>Tasa de Interés</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {bancos.map((banco) => (
              <tr key={banco.id}>
                <td>{banco.entidad}</td>
                <td>{banco.cantidad}</td>
                <td>{banco.tasaInteres}</td>
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
    </div>
  );
};

export default Bancos;









