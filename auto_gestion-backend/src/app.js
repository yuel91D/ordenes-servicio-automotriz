const express = require('express');
const cors = require('cors');

// Importamos todos los enrutadores de la API
const ordenServicioRoutes = require('./routes/ordenServicioRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const itemOrdenRoutes = require('./routes/itemOrdenRoutes'); // 🔥 ¡El último bloque!

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Registramos todos los endpoints globales de la API
app.use('/api/ordenes', ordenServicioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/items', itemOrdenRoutes); // 🔥 ¡Ecosistema de ítems activo!

module.exports = app;

// Carga de relaciones centralizadas
require('./models');