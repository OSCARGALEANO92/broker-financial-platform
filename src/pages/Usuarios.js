import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import "./Usuarios.css";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = () => {
    fetch(API_BASE.usuarios)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener usuarios");
        return res.json();
      })
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Error al obtener usuarios:", err));
  };

  return (
    <div className="usuarios-container">
      <h2 className="usuarios-title">Gestión de Usuarios</h2>
      <div className="usuarios-header">
  <button className="usuarios-agregar-btn" onClick={() => navigate("/usuarios/nuevo")}>
    ➕ Agregar Usuario
  </button>
        </div>
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre de Usuario</th>
            <th>Correo</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombreUsuario}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>

      
    </div>
  );
};

export default Usuarios;


