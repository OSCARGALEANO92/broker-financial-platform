import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const BrokerTable = ({ brokers }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {brokers.map((broker) => (
            <TableRow key={broker.id}>
              <TableCell>{broker.nombre}</TableCell>
              <TableCell>{broker.email}</TableCell>
              <TableCell>
                <button>Edit</button>
                <button>Delete</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BrokerTable;
