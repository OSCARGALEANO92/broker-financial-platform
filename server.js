const express = require('express');
const { PrismaClient } = require('@prisma/client'); 

const app = express();
const port = 4000;
const prisma = new PrismaClient(); 

app.use(express.json());

app.post('/brokers', async (req, res) => {
    const { nombre, email } = req.body;
    try{
        if (!nombre || !email) {
            return res.status(400).json({ error: 'Nombre y email son requeridos' });
        }

        const nuevoBroker = await prisma.broker.create({
            data: { 
                nombre, email }
         });
        res.status(201).json(nuevoBroker);
    } catch (error) {
        console.error("Error al crear broker:", error);
        res.status(500).json({ error: 'Error al crear broker', details: error.message });

    }
});

app.get("/clientes", async (req, res) => {
  try {
    const clientes = await prisma.clientes.findMany(); // Ajusta según tu ORM o consulta SQL
    res.json(clientes);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
});


app.get('/', (req, res) => {
    res.send('Servidor corriendo correctamente');
  });

app.get('/brokers', async (req, res) => {
    try {
        const brokers = await prisma.broker.findMany();
        res.json(brokers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener brokers' });
    } 
}); 

app.put('/brokers/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body;
    try {
      const updatedBroker = await prisma.broker.update({
        where: { id: Number(id) },
        data: { nombre, email },
      });
      res.json(updatedBroker);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar broker' });
    }
  });

  app.delete('/brokers/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.broker.delete({
        where: { id: Number(id) },
      });
      res.json({ message: 'Broker eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar broker' });
    }
  });

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

