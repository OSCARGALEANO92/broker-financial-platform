import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BrokerList = () => {
  const [brokers, setBrokers] = useState([]);
  const [editingBrokerId, setEditingBrokerId] = useState(null);
  const [editBrokerData, setEditBrokerData] = useState({
    nombre: '',
    email: '',
  });

  const getBrokers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/brokers');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los brokers', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchBrokers = async () => {
      const data = await getBrokers();
      setBrokers(data);
    };
    fetchBrokers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/brokers/${id}`);
      setBrokers(brokers.filter(broker => broker.id !== id));
    } catch (error) {
      console.error("Error al eliminar broker:", error);
    }
  };

  const handleEditClick = (broker) => {
    setEditingBrokerId(broker.id);
    setEditBrokerData({
      nombre: broker.nombre,
      email: broker.email,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditBrokerData({
      ...editBrokerData,
      [name]: value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:4000/brokers/${editingBrokerId}`,
        editBrokerData
      );
      const updatedBroker = response.data;

      setBrokers(
        brokers.map((broker) =>
          broker.id === editingBrokerId ? updatedBroker : broker
        )
      );
      setEditingBrokerId(null);
    } catch (error) {
      console.error('Error al actualizar broker', error);
    }
  };

  return (
    <div>
      <h2>Lista de Brokers</h2>
      <ul>
        {brokers.length > 0 ? (
          brokers.map((broker) => (
            <li key={broker.id}>
              {broker.nombre} - {broker.email}
              <button onClick={() => handleDelete(broker.id)}>Eliminar</button>
              <button onClick={() => handleEditClick(broker)}>Editar</button>
            </li>
          ))
        ) : (
          <p>No hay brokers disponibles.</p>
        )}
      </ul>

      {editingBrokerId && (
        <div>
          <h3>Editar Broker</h3>
          <form onSubmit={handleEditSubmit}>
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={editBrokerData.nombre}
                onChange={handleEditChange}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editBrokerData.email}
                onChange={handleEditChange}
              />
            </div>
            <button type="submit">Actualizar</button>
            <button
              type="button"
              onClick={() => setEditingBrokerId(null)}
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BrokerList;


