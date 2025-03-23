import React, { createContext, useState, useEffect } from "react";
import { API_BASE } from "../config";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [detallesBanco, setDetallesBanco] = useState([]);

  // 🔹 Cargar clientes desde backend al iniciar
  const fetchClientes = () => {
    fetch(API_BASE.clientes)
  .then(async (res) => {
    if (!res.ok) {
      const text = await res.text(); // leemos texto plano en lugar de JSON
      throw new Error(`❌ Error HTTP: ${res.status} - ${text}`);
    }
    return res.json();
  })
  .then((data) => {
    if (Array.isArray(data)) {
      setClientes(data);
    } else {
      console.error("❌ La respuesta de clientes no es un array:", data);
    }
  })
  .catch((err) => console.error("Error al cargar clientes:", err));
  };

  useEffect(() => {
    fetch(API_BASE.clientes)
  .then(async (res) => {
    if (!res.ok) {
      const text = await res.text(); // leemos texto plano en lugar de JSON
      throw new Error(`❌ Error HTTP: ${res.status} - ${text}`);
    }
    return res.json();
  })
  .then((data) => {
    if (Array.isArray(data)) {
      setClientes(data);
    } else {
      console.error("❌ La respuesta de clientes no es un array:", data);
    }
  })
  .catch((err) => console.error("Error al cargar clientes:", err));
  
  fetch(API_BASE.mensajes)
  .then(async (res) => {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`❌ Error HTTP: ${res.status} - ${text}`);
    }
    return res.json();
  })
  .then((data) => {
    if (Array.isArray(data)) {
      setMensajes(data);
    } else {
      console.error("❌ La respuesta de mensajes no es un array:", data);
    }
  })
  .catch((err) => console.error("Error al cargar mensajes:", err));

  }, []);

  const agregarMensaje = (mensajeNuevo) => {
    // Agregar mensaje al array de historial del cliente
    setMensajes((prevMensajes) => {
      const existente = prevMensajes.find((m) => m.documento === mensajeNuevo.documento);

      if (existente) {
        return prevMensajes.map((m) =>
          m.documento === mensajeNuevo.documento
            ? {
                ...m,
                mensaje: mensajeNuevo.mensaje,
                estado: mensajeNuevo.estado,
                historialMensajes: [
                  ...m.historialMensajes,
                  {
                    fechaHora: new Date().toLocaleString(),
                    usuario: localStorage.getItem("userRole") || "sistema",
                    mensaje: mensajeNuevo.mensaje,
                    estado: mensajeNuevo.estado,
                  },
                ],
              }
            : m
        );
      } else {
        return [
          ...prevMensajes,
          {
            documento: mensajeNuevo.documento,
            nombre: mensajeNuevo.nombre,
            mensaje: mensajeNuevo.mensaje,
            estado: mensajeNuevo.estado,
            banco: mensajeNuevo.banco || "",
            monto: mensajeNuevo.monto || 0,
            fechaCarga: new Date().toLocaleDateString(),
            historialMensajes: [
              {
                fechaHora: new Date().toLocaleString(),
                usuario: localStorage.getItem("userRole") || "sistema",
                mensaje: mensajeNuevo.mensaje,
                estado: mensajeNuevo.estado,
              },
            ],
          },
        ];
      }
    });

    // Actualizar estado del cliente en la lista
    setClientes((prevClientes) =>
      prevClientes.map((cliente) =>
        cliente.documento === mensajeNuevo.documento
          ? { ...cliente, estado: mensajeNuevo.estado }
          : cliente
      )
    );
  };

  // ✅ Función para registrar un préstamo nuevo
  const agregarPrestamo = (nuevoPrestamo) => {
    console.log("📦 Prestamo recibido:", nuevoPrestamo);

    setPrestamos((prev) => [...prev, nuevoPrestamo]);

    setClientes((prev) => {
      const yaExiste = prev.some((cliente) => cliente.documento === nuevoPrestamo.documento);
      return yaExiste
        ? prev.map((cliente) =>
            cliente.documento === nuevoPrestamo.documento ? { ...cliente, ...nuevoPrestamo } : cliente
          )
        : [...prev, nuevoPrestamo];
    });

    setDetallesBanco((prev) => {
      const bancoIndex = prev.findIndex((b) => b.nombre === nuevoPrestamo.banco);
      if (bancoIndex !== -1) {
        const nuevos = [...prev];
        nuevos[bancoIndex].cantidad += 1;
        return nuevos;
      } else {
        return [...prev, { nombre: nuevoPrestamo.banco, cantidad: 1 }];
      }
    });

    // Registrar mensaje en historial al crear préstamo
    setMensajes((prev) => [
      ...prev,
      {
        documento: nuevoPrestamo.documento,
        nombre: nuevoPrestamo.nombre || nuevoPrestamo.nombres,
        banco: nuevoPrestamo.banco,
        monto: nuevoPrestamo.montosolicitado,
        estado: nuevoPrestamo.estado,
        fechaCarga: new Date().toLocaleDateString(),
        mensaje: "Nueva solicitud registrada",
        historialMensajes: [
          {
            fechaHora: new Date().toLocaleString(),
            usuario: localStorage.getItem("userRole") || "broker",
            mensaje: "Solicitud ingresada",
            estado: "Pendiente",
          },
        ],
      },
    ]);
  };

  return (
    <GlobalContext.Provider
      value={{
        clientes,
        setClientes,
        prestamos,
        mensajes,
        setMensajes,
        agregarMensaje,
        detallesBanco,
        agregarPrestamo,
        fetchClientes,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};


