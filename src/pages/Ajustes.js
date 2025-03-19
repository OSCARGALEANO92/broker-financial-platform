import React, { useState, useEffect } from "react";
import "./Ajustes.css";

const Ajustes = () => {
  const [formData, setFormData] = useState({
    nombreUsuario: localStorage.getItem("nombreUsuario") || "",
    correo: localStorage.getItem("correo") || "",
    nombre: localStorage.getItem("nombre") || "",
    apellidos: localStorage.getItem("apellidos") || "",
    web: localStorage.getItem("web") || "",
    contraseña: "",
  });

  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Alternar visibilidad de la contraseña
  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  // Guardar datos en localStorage
  const handleSubmit = (e) => {
    e.preventDefault();

    // Guardar en localStorage (excepto la contraseña)
    localStorage.setItem("nombreUsuario", formData.nombreUsuario);
    localStorage.setItem("correo", formData.correo);
    localStorage.setItem("nombre", formData.nombre);
    localStorage.setItem("apellidos", formData.apellidos);
    localStorage.setItem("web", formData.web);

    alert("Datos actualizados correctamente.");
  };

  return (
    <div className="ajustes-container">
      {/* 📌 Título */}
      <h2 className="ajustes-title">Ajustes de Usuario</h2>

      {/* 📌 Formulario */}
      <form onSubmit={handleSubmit} className="ajustes-form">
        {/* Nombre de usuario */}
        <div className="ajustes-input-group">
          <label>Nombre de usuario <em>(obligatorio)</em></label>
          <input type="text" name="nombreUsuario" value={formData.nombreUsuario} onChange={handleChange} required />
        </div>

        {/* Correo electrónico */}
        <div className="ajustes-input-group">
          <label>Correo electrónico <em>(obligatorio)</em></label>
          <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
        </div>

        {/* Nombre */}
        <div className="ajustes-input-group">
          <label>Nombre</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
        </div>

        {/* Apellidos */}
        <div className="ajustes-input-group">
          <label>Apellidos</label>
          <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} />
        </div>

        {/* Web */}
        <div className="ajustes-input-group">
          <label>Teléfono</label>
          <input type="text" name="web" value={formData.web} onChange={handleChange} />
        </div>

        {/* Contraseña */}
        <div className="ajustes-input-group">
          <label>Contraseña</label>
          <input type={mostrarContrasena ? "text" : "password"} name="contraseña" value={formData.contraseña} onChange={handleChange} />
          <button type="button" className="mostrar-contrasena" onClick={toggleMostrarContrasena}>
            {mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
          </button>
        </div>

        {/* Botón Guardar Cambios */}
        <button type="submit" className="ajustes-button">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default Ajustes;




