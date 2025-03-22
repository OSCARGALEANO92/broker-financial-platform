const express = require('express');
const cors = require('cors'); // ✅ Importar cors
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 4000;
const prisma = new PrismaClient();

// Carpeta de destino para los archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor corriendo correctamente');
});

// Obtener todos los clientes
app.get('/clientes', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// Crear un cliente a partir de un préstamo
app.post(
  '/prestamos',
  upload.fields([
    { name: 'cedula' },
    { name: 'factura' },
    { name: 'salario' },
    { name: 'certificado' },
    { name: 'cct' },
    { name: 'ruc' },
    { name: 'iva' },
    { name: 'cartaoferta' },
    { name: 'tazacion' },
    { name: 'extracto' },
    { name: 'cedulacodeudor' },
  ]),
  async (req, res) => {
    const data = JSON.parse(req.body.data);
    const archivos = req.files;

    try {
      const nuevoCliente = await prisma.cliente.create({
        data: {
          documento: data.documento,
          nombre: data.nombres,
          telefono: data.celular,
          direccion: data.direccion,
          montosolicitado: parseFloat(data.monto.replace(/\./g, "")),
          banco: data.bancoSeleccionado,
          estado: 'Pendiente',

          correo: data.correo,
          barrio: data.barrio,
          ciudad: data.ciudad,
          fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : null,
          estadoCivil: data.estadoCivil,
          nacionalidad: data.nacionalidad,
          empresa: data.empresa,
          ruc: data.ruc,
          actividadEmpresa: data.actividadEmpresa,
          ingresos: parseFloat(data.monto.replace(/\./g, "")),
          fechaCobro: data.fechaCobro ? new Date(data.fechaCobro) : null,
          referencia1: data.referencia1,
          relacion1: data.relacion1,
          celular1: data.celular1,
          referencia2: data.referencia2,
          relacion2: data.relacion2,
          celular2: data.celular2,
          referencia3: data.referencia3,
          relacion3: data.relacion3,
          celular3: data.celular3,
          plazo: data.plazo,
          destino: data.destino,
          coodeudor: data.coodeudor,
        },
      });

      console.log('✅ Cliente guardado en BD:', nuevoCliente);
      res.status(201).json(nuevoCliente);
    } catch (error) {
      console.error('Error al crear cliente:', error);
      res.status(500).json({ error: 'Error al crear cliente', detalles: error.message });
    }
  }
);

// Ruta para actualizar el estado del cliente y registrar el mensaje
app.post("/mensajes", async (req, res) => {
  const { documento, nombre, mensaje, estado } = req.body;

  try {
    const nuevoMensaje = await prisma.mensaje.create({
      data: {
        documento,
        nombre,
        mensaje,
        estado,
        fecha: new Date(),
      },
    });

    res.status(201).json(nuevoMensaje);
  } catch (error) {
    console.error("❌ Error al guardar mensaje:", error);
    res.status(500).json({ error: "Error al guardar mensaje", detalles: error.message });
  }
});


app.get("/mensajes", async (req, res) => {
  try {
    const mensajes = await prisma.mensaje.findMany(); // ✅ modelo en minúsculas
    res.json(mensajes);
  } catch (error) {
    console.error("❌ Error al obtener mensajes:", error);
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
});


// Crear broker
app.post('/brokers', async (req, res) => {
  const { nombre, email } = req.body;
  try {
    if (!nombre || !email) {
      return res.status(400).json({ error: 'Nombre y email son requeridos' });
    }

    const nuevoBroker = await prisma.broker.create({
      data: { nombre, email },
    });

    res.status(201).json(nuevoBroker);
  } catch (error) {
    console.error('Error al crear broker:', error);
    res.status(500).json({ error: 'Error al crear broker', detalles: error.message });
  }
});

// Obtener brokers
app.get('/brokers', async (req, res) => {
  try {
    const brokers = await prisma.broker.findMany();
    res.json(brokers);
  } catch (error) {
    console.error('Error al obtener brokers:', error);
    res.status(500).json({ error: 'Error al obtener brokers' });
  }
});

// Actualizar broker
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

// Eliminar broker
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


