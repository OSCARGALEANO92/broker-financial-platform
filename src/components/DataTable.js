import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaEye, FaMoneyBill } from "react-icons/fa";

// Datos de prueba
const columns = ["ID", "Nombre", "Documento", "Correo", "Teléfono", "Prestamo", "Banco", "Estado"];
const data = [
  { ID: 1, Nombre: "Juan Pérez", Documento: "1402851", Correo: "juan@example.com", Teléfono: "0981-123456", Estado: "Aprobado" },
  { ID: 2, Nombre: "María López", Documento: "1402851", Correo: "maria@example.com", Teléfono: "0982-654321", Estado: "Aprobado" },
  { ID: 3, Nombre: "Carlos Gómez", Documento: "1402851", Correo: "carlos@example.com", Teléfono: "0983-789123", Estado: "Pendiente" },
  { ID: 4, Nombre: "Ana Fernández", Documento: "1402851", Correo: "ana@example.com", Teléfono: "0984-456789", Estado: "Pendiente" },
  { ID: 1, Nombre: "Juan Pérez", Documento: "1402851", Correo: "juan@example.com", Teléfono: "0981-123456", Estado: "Aprobado" },
  { ID: 2, Nombre: "María López", Documento: "1402851", Correo: "maria@example.com", Teléfono: "0982-654321", Estado: "Aprobado" },
  { ID: 3, Nombre: "Carlos Gómez", Documento: "1402851", Correo: "carlos@example.com", Teléfono: "0983-789123", Estado: "Pendiente" },
  { ID: 4, Nombre: "Ana Fernández", Documento: "1402851", Correo: "ana@example.com", Teléfono: "0984-456789", Estado: "Pendiente" },
  {ID: 1, Nombre: "Juan Pérez", Documento: "1402851", Correo: "juan@example.com", Teléfono: "0981-123456", Estado: "Aprobado" },
  { ID: 2, Nombre: "María López", Documento: "1402851", Correo: "maria@example.com", Teléfono: "0982-654321", Estado: "Aprobado" },
  { ID: 3, Nombre: "Carlos Gómez", Documento: "1402851", Correo: "carlos@example.com", Teléfono: "0983-789123", Estado: "Pendiente" },
];

const DataTable = () => {
  return (
    <div className="table-responsive">
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            {columns.map((col, index) => <th key={index}>{col}</th>)}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((col, i) => <td key={i}>{row[col] || "-"}</td>)}
              <td>
                <Button variant="outline-primary" size="sm">
                  <FaMoneyBill />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable;




