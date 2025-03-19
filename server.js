const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 4000;
const prisma = new PrismaClient();

const corsOptions = {
  origin: ['https://gestionhomebridge.com', 'http://gestionhomebridge.com', 'http://gestionhomebridge.com:3000', 'http://dev.homebridge.com:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));


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

app.get('/', (req, res) => {
  res.send('Servidor corriendo correctamente');
});

app.get('/clientes', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    console.error('❌ Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes', detalle: error.message });
  }
});

app.get("/clientes/:documento", async (req, res) => {
  const { documento } = req.params;
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { documento },
    });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado." });
    }

    res.json(cliente);
  } catch (error) {
    console.error("❌ Error al obtener cliente:", error);
    res.status(500).json({ error: "Error al obtener cliente", detalle: error.message });
  }
});

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
    const documentosAdjuntos = {};

for (const tipo in archivos) {
  documentosAdjuntos[tipo] = archivos[tipo].map((file) => `/uploads/${file.filename}`);
}

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
          ingresos: parseFloat(data.ingresos.replace(/\./g, "")),
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
          documentos: documentosAdjuntos,
        },
      });

      console.log('✅ Cliente guardado en BD:', nuevoCliente);
      res.status(201).json(nuevoCliente);
    } catch (error) {
      console.error('Error al crear cliente:', error);
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'El cliente ya existe con ese documento.' });
      }
      res.status(500).json({ error: 'Error al crear cliente', detalles: error.message });
    }
  }
);

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

    await prisma.cliente.update({
      where: { documento },
      data: { estado },
    });

    res.status(201).json(nuevoMensaje);
  } catch (error) {
    console.error("❌ Error al guardar mensaje:", error);
    res.status(500).json({ error: "Error al guardar mensaje", detalles: error.message });
  }
});

app.get("/mensajes", async (req, res) => {
  try {
    const mensajes = await prisma.mensaje.findMany();
    res.json(mensajes);
  } catch (error) {
    console.error("❌ Error al obtener mensajes:", error);
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
});

app.get('/bancos', async (req, res) => {
  try {
    const bancos = await prisma.banco.findMany();
    res.json(bancos);
  } catch (error) {
    console.error('Error al obtener bancos:', error);
    res.status(500).json({ error: 'Error al obtener bancos' });
  }
});

app.post('/bancos', async (req, res) => {
  const { entidad, tasaInteres, usuario = 'admin' } = req.body;
  if (!entidad || !tasaInteres) return res.status(400).json({ error: 'Entidad y tasa de interés son requeridos' });
  try {
    const banco = await prisma.banco.create({ data: { entidad, tasaInteres: parseFloat(tasaInteres) } });

    await prisma.mensaje.create({
      data: {
        documento: 'sistema',
        nombre: usuario,
        mensaje: `➕ Banco agregado: ${entidad} (${tasaInteres}%)`,
        estado: 'informativo',
        fecha: new Date(),
      },
    });

    res.status(201).json(banco);
  } catch (error) {
    console.error('Error al crear banco:', error);
    res.status(500).json({ error: 'Error al crear banco' });
  }
});

app.put('/bancos/:id', async (req, res) => {
  const { id } = req.params;
  const { tasaInteres, usuario = 'admin' } = req.body;
  try {
    const banco = await prisma.banco.update({
      where: { id: Number(id) },
      data: { tasaInteres: parseFloat(tasaInteres) },
    });

    await prisma.mensaje.create({
      data: {
        documento: 'sistema',
        nombre: usuario,
        mensaje: `✏️ Tasa de interés actualizada para ${banco.entidad} (${tasaInteres}%)`,
        estado: 'informativo',
        fecha: new Date(),
      },
    });

    res.json(banco);
  } catch (error) {
    console.error('Error al actualizar banco:', error);
    res.status(500).json({ error: 'Error al actualizar banco' });
  }
});

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

app.get('/brokers', async (req, res) => {
  try {
    const brokers = await prisma.broker.findMany();
    res.json(brokers);
  } catch (error) {
    console.error('Error al obtener brokers:', error);
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

app.post("/clientes/:documento/upload", upload.array("archivos"), async (req, res) => {
  const { documento } = req.params;
  const archivosSubidos = req.files;

  if (!archivosSubidos || archivosSubidos.length === 0) {
    return res.status(400).json({ error: "No se adjuntaron archivos." });
  }

  const archivos = archivosSubidos.map((file) => `/uploads/${file.filename}`);

  try {
    const clienteActual = await prisma.cliente.findUnique({ where: { documento } });
    if (!clienteActual) return res.status(404).json({ error: "Cliente no encontrado." });

    const nuevosDocumentos = {
      ...(clienteActual.documentos || {}),
      otros: [...(clienteActual.documentos?.otros || []), ...archivos],
    };

    await prisma.cliente.update({
      where: { documento },
      data: { documentos: nuevosDocumentos },
    });

    res.status(200).json({ mensaje: "Documentos subidos", archivos });
  } catch (error) {
    console.error("Error al subir documentos:", error);
    res.status(500).json({ error: "Error al subir documentos" });
  }
});

app.post('/usuarios', async (req, res) => {
  const { nombreUsuario, correo, nombre, apellidos, telefono, institucion, rol } = req.body;

  if (!correo || !nombreUsuario || !rol) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const usuarioExistente = await prisma.user.findUnique({ where: { email: correo } });

    let usuario;
    if (usuarioExistente) {
      usuario = await prisma.user.update({
        where: { email: correo },
        data: {
          nombre,
          apellidos,
          telefono,
          institucion,
          name: nombreUsuario,
          rol,
        },
      });
    } else {
      usuario = await prisma.user.create({
        data: {
          email: correo,
          nombre,
          apellidos,
          telefono,
          institucion,
          name: nombreUsuario,
          rol,
        },
      });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error('❌ Error al guardar usuario:', error);
    res.status(500).json({ error: 'Error al guardar usuario' });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await prisma.user.findMany();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.post('/usuarios', async (req, res) => {
  const { name, email, telefono } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Nombre y email son requeridos' });

  try {
    const nuevoUsuario = await prisma.user.create({
      data: {
        name,
        email,
        telefono,
      },
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});


app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://${process.env.HOST || '0.0.0.0'}:${port}`);
});
