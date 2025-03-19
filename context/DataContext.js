// context/DataContext.js
import { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [prestamos, setPrestamos] = useState([]); // Estado global de préstamos

  // Función para agregar un nuevo préstamo
  const addPrestamo = (nuevoPrestamo) => {
    setPrestamos((prevPrestamos) => [...prevPrestamos, nuevoPrestamo]);
  };

  return (
    <DataContext.Provider value={{ prestamos, addPrestamo }}>
      {children}
    </DataContext.Provider>
  );
};