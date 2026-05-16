const express = require('express');
const cors = require('cors');

// Importamos los enrutadores
const ordenServicioRoutes = require('./routes/ordenServicioRoutes');
const clienteRoutes = require('./routes/clienteRoutes'); // 🔥 Agregamos este

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Registramos los endpoints de la API globales
app.use('/api/ordenes', ordenServicioRoutes);
app.use('/api/clientes', clienteRoutes); // 🔥 ¡Ruta de clientes viva!

module.exports = app;

// Carga relaciones
require('./models');