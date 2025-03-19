import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

export const getBrokers = async () => {
  try {
    const response = await axios.get('http://localhost:4000/brokers');
    return response.data;
  } catch (error) {
    console.error('Error al obtener brokers:', error);
    return [];
  }
};

export const createBroker = async (nombre, email) => {
  try {
    const response = await api.post('/brokers', { nombre, email });
    return response.data;
  } catch (error) {
    console.error('Error al crear broker:', error);
  }
};
