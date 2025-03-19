import React, { useState } from 'react';
import { createBroker } from '../api';

const BrokerForm = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBroker = await createBroker(nombre, email);
    console.log('Nuevo Broker Creado:', newBroker);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear un nuevo Broker</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Crear Broker</button>
    </form>
  );
};

export default BrokerForm;
