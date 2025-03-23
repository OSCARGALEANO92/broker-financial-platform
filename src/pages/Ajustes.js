import React, { useState, useEffect } from "react";
import "./Ajustes.css";

const Ajustes = () => {
  const userRole = localStorage.getItem("userRole") || "";

  const [formData, setFormData] = useState({
    nombreUsuario: localStorage.getItem(`${userRole}_nombreUsuario`) || "",
    correo: localStorage.getItem(`${userRole}_correo`) || "",
    nombre: localStorage.getItem(`${userRole}_nombre`) || "",
    apellidos: localStorage.getItem(`${userRole}_apellidos`) || "",
    telefono: localStorage.getItem(`${userRole}_telefono`) || "",
    institucion: localStorage.getItem(`${userRole}_institucion`) || "",
    contraseña: "",
  });

  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem(`${userRole}_nombreUsuario`, formData.nombreUsuario);
    localStorage.setItem(`${userRole}_correo`, formData.correo);
    localStorage.setItem(`${userRole}_nombre`, formData.nombre);
    localStorage.setItem(`${userRole}_apellidos`, formData.apellidos);
    localStorage.setItem(`${userRole}_telefono`, formData.telefono);
    localStorage.setItem(`${userRole}_institucion`, formData.institucion);

    alert("Datos actualizados correctamente.");
  };

  return (
    <div className="ajustes-container">
      <h2 className="ajustes-title">Ajustes de Usuario ({userRole})</h2>

      <form onSubmit={handleSubmit} className="ajustes-form">
        <div className="ajustes-input-group">
          <label>Nombre de usuario <em>(obligatorio)</em></label>
          <input type="text" name="nombreUsuario" value={formData.nombreUsuario} onChange={handleChange} required />
        </div>

        <div className="ajustes-input-group">
          <label>Correo electrónico <em>(obligatorio)</em></label>
          <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
        </div>

        <div className="ajustes-input-group">
          <label>Nombre</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
        </div>

        <div className="ajustes-input-group">
          <label>Apellidos</label>
          <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} />
        </div>

        {(userRole === "admin" || userRole === "banco" || userRole === "broker") && (
          <div className="ajustes-input-group">
            <label>Institución</label>
            <input type="text" name="institucion" value={formData.institucion} onChange={handleChange} />
          </div>
        )}

        {(userRole === "banco" || userRole === "broker") && (
          <div className="ajustes-input-group">
            <label>Teléfono</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
          </div>
        )}

        <div className="ajustes-input-group">
          <label>Contraseña</label>
          <input type={mostrarContrasena ? "text" : "password"} name="contraseña" value={formData.contraseña} onChange={handleChange} />
          <button type="button" className="mostrar-contrasena" onClick={toggleMostrarContrasena}>
            {mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
          </button>
        </div>

        <button type="submit" className="ajustes-button">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default Ajustes;






