const isProduction = process.env.NODE_ENV === "production";

const SERVER_URL = isProduction
  ? "https://gestionhomebridge.com/api" // Producción (AWS)
  : "http://localhost:4000";   // Desarrollo local

console.log("🌍 Usando servidor:", SERVER_URL); // ✅ AGREGALO

export const API_BASE = {
  clientes: `${SERVER_URL}/clientes`,
  mensajes: `${SERVER_URL}/mensajes`,
  prestamos: `${SERVER_URL}/prestamos`,
  usuarios: `${SERVER_URL}/usuarios`, // si luego subís usuarios a AWS
  brokers: `${SERVER_URL}/brokers`,
  uploadDocumentos: (documento) => `${SERVER_URL}/clientes/${documento}/upload`,
};
