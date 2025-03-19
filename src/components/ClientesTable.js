import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ClientesTable = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Simulando datos para pruebas
    const datosFicticios = [
      {
        id: 1,
        nombre: "Juan Pérez",
        documento: "12345678",
        correo: "juan@example.com",
        telefono: "0981-123456",
        direccion: "Asunción, Paraguay",
        montoPrestamo: "₲5.000.000",
        banco: "Banco Nacional",
        mensaje: "Aprobado",
      },
      {
        id: 2,
        nombre: "María López",
        documento: "87654321",
        correo: "maria@example.com",
        telefono: "0982-654321",
        direccion: "Luque, Paraguay",
        montoPrestamo: "₲3.000.000",
        banco: "Banco Familiar",
        mensaje: "Pendiente",
      },
      {
        id: 3,
        nombre: "Carlos Gómez",
        documento: "23456789",
        correo: "carlos@example.com",
        telefono: "0983-789123",
        direccion: "San Lorenzo, Paraguay",
        montoPrestamo: "₲7.500.000",
        banco: "Banco Visión",
        mensaje: "Rechazado",
      },
    ];
    setClientes(datosFicticios);
  }, []);

  return (
    <TableContainer component={Paper} sx={{ margin: "20px", padding: "20px", width: "95%" }}>
      <Typography variant="h5" sx={{ textAlign: "left", paddingBottom: "10px", fontWeight: "bold" }}>
        📌 Lista de Clientes
      </Typography>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell><strong>Nombre y Apellido</strong></TableCell>
            <TableCell><strong>Documento</strong></TableCell>
            <TableCell><strong>Correo</strong></TableCell>
            <TableCell><strong>Teléfono</strong></TableCell>
            <TableCell><strong>Dirección</strong></TableCell>
            <TableCell><strong>Monto del Préstamo</strong></TableCell>
            <TableCell><strong>Banco</strong></TableCell>
            <TableCell><strong>Mensaje</strong></TableCell>
            <TableCell><strong>Acciones</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
              <TableCell>{cliente.nombre}</TableCell>
              <TableCell>{cliente.documento}</TableCell>
              <TableCell>{cliente.correo}</TableCell>
              <TableCell>{cliente.telefono}</TableCell>
              <TableCell>{cliente.direccion}</TableCell>
              <TableCell>{cliente.montoPrestamo}</TableCell>
              <TableCell>{cliente.banco}</TableCell>
              <TableCell>{cliente.mensaje}</TableCell>
              <TableCell>
                <IconButton color="primary">
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClientesTable;

