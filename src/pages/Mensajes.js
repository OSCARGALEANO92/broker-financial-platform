import React, { useState } from "react";
import "./Mensajes.css";

const Mensajes = () => {
  const [filaExpandida, setFilaExpandida] = useState(null);

  // Lista de mensajes simulada
  const mensajes = [
    {
      documento: "12345678",
      nombre: "Juan Pérez",
      banco: "Banco Nacional",
      monto: "₲700.000.000",
      fechaCarga: "12-Mar-2025",
      estado: "Aprobado",
      mensaje: "Solicitud procesada con éxito.",
      detalles: {
        fechaNacimiento: "01-Ene-1990",
        estadoCivil: "Soltero",
        celular: "0981 123456",
        correo: "juanperez@email.com",
        direccion: "Calle 123, Asunción",
        empresa: "Empresa XYZ",
        ingresos: "₲15.000.000",
      },
    },
    {
      documento: "87654321",
      nombre: "María Gómez",
      banco: "Banco Visión",
      monto: "₲15.000.000",
      fechaCarga: "13-Mar-2025",
      estado: "Pendiente",
      mensaje: "Falta verificación de documentos.",
      detalles: {
        fechaNacimiento: "05-Jul-1985",
        estadoCivil: "Casada",
        celular: "0982 654321",
        correo: "mariagomez@email.com",
        direccion: "Avenida Principal 456, Ciudad del Este",
        empresa: "Negocios ABC",
        ingresos: "₲7.000.000",
      },
    },
    {
      documento: "2156874",
      nombre: "Juan Gimenez",
      banco: "Banco Itau",
      monto: "₲150.000.000",
      fechaCarga: "13-Mar-2025",
      estado: "Pendiente",
      mensaje: "Falta verificación de documentos.",
      detalles: {
        fechaNacimiento: "22-May-1980",
        estadoCivil: "Soltero",
        celular: "0983 987654",
        correo: "juangimenez@email.com",
        direccion: "Calle 789, Ciudad del Este",
        empresa: "Empresa DEF",
        ingresos: "₲10.000.000",
      },
    },
  ];

  const toggleDetalles = (documento) => {
    setFilaExpandida((prev) => (prev === documento ? null : documento));
  };

  return (
    <div className="mensajes-container">
      <h1 className="mensajes-title">Mensajes de Solicitudes</h1>

      <table className="mensajes-table">
        <thead>
          <tr>
            <th>Documento</th>
            <th>Nombre</th>
            <th>Banco</th>
            <th>Monto del Préstamo</th>
            <th>Fecha de Carga</th>
            <th>Estado</th>
            <th>Mensaje</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {mensajes.map((mensaje, index) => (
            <React.Fragment key={index}>
              {/* 🔹 Fila principal */}
              <tr>
                <td>{mensaje.documento}</td>
                <td>{mensaje.nombre}</td>
                <td>{mensaje.banco}</td>
                <td>{mensaje.monto}</td>
                <td>{mensaje.fechaCarga}</td>
                <td>
                  <span className={`estado-${mensaje.estado.toLowerCase()}`}>
                    {mensaje.estado}
                  </span>
                </td>
                <td>{mensaje.mensaje}</td>
                <td>
                  <button
                    className="ver-mas-btn"
                    onClick={() => toggleDetalles(mensaje.documento)}
                  >
                    {filaExpandida === mensaje.documento ? "Cerrar" : "Ver Más"}
                  </button>
                </td>
              </tr>

              {/* 🔹 Fila expandida con detalles */}
              {filaExpandida === mensaje.documento && (
                <tr className="detalles-fila">
                  <td colSpan="8">
                    <div className="detalles-container">
                      <div className="ficha-cliente">
                        <h2>Ficha del Cliente</h2>
                        <p><strong>Documento:</strong> {mensaje.documento}</p>
                        <p><strong>Nombre:</strong> {mensaje.nombre}</p>
                        <p><strong>Fecha de Nacimiento:</strong> {mensaje.detalles.fechaNacimiento}</p>
                        <p><strong>Estado Civil:</strong> {mensaje.detalles.estadoCivil}</p>
                        <p><strong>Celular:</strong> {mensaje.detalles.celular}</p>
                        <p><strong>Correo:</strong> {mensaje.detalles.correo}</p>
                        <p><strong>Dirección:</strong> {mensaje.detalles.direccion}</p>
                      </div>

                      <div className="datos-adicionales">
                        <h2>Datos Adicionales</h2>
                        <p><strong>Banco:</strong> {mensaje.banco}</p>
                        <p><strong>Monto del Préstamo:</strong> {mensaje.monto}</p>
                        <p><strong>Fecha de Carga:</strong> {mensaje.fechaCarga}</p>
                        <p><strong>Estado:</strong> {mensaje.estado}</p>
                        <p><strong>Mensaje:</strong> {mensaje.mensaje}</p>
                        <p><strong>Empresa:</strong> {mensaje.detalles.empresa}</p>
                        <p><strong>Ingresos Mensuales:</strong> {mensaje.detalles.ingresos}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Mensajes;




