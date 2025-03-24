import React, { useState } from "react";
import { createUsuario } from "../api";
import "./NuevoUsuario.css";

const NuevoUsuario = () => {
  const [form, setForm] = useState({
    nombreUsuario: "",
    correo: "",
    nombre: "",
    apellidos: "",
    telefono: "",
    rol: "broker",
    contraseña: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUsuario(form);
      alert("✅ Usuario creado con éxito");
      window.location.href = "/usuarios";
    } catch (error) {
      alert("❌ Error al crear usuario");
      console.error(error);
    }
  };

  return (
    <div className="nuevo-usuario-container">
      <h2>📝 Formulario Nuevo Usuario</h2>
      <form onSubmit={handleSubmit} className="nuevo-usuario-form">
        <input name="nombreUsuario" placeholder="Nombre de usuario" onChange={handleChange} required />
        <input name="correo" placeholder="Correo electrónico" type="email" onChange={handleChange} required />
        <input name="nombre" placeholder="Nombre" onChange={handleChange} />
        <input name="apellidos" placeholder="Apellidos" onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" onChange={handleChange} />
        <input name="contraseña" placeholder="Contraseña" type="password" onChange={handleChange} required />
        <select name="rol" onChange={handleChange}>
          <option value="broker">Broker</option>
          <option value="banco">Banco</option>
        </select>
        <button type="submit">✅ Crear Usuario</button>
      </form>
    </div>
  );
};

export default NuevoUsuario;

