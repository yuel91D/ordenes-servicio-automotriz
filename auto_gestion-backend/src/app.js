const express = require('express');
const cors = require('cors');

// Importamos los enrutadores
const ordenServicioRoutes = require('./routes/ordenServicioRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const itemOrdenRoutes = require('./routes/itemOrdenRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas Cortas y Elegantes 🔥
app.use('/ordenes', ordenServicioRoutes);
app.use('/clientes', clienteRoutes);
app.use('/vehiculos', vehiculoRoutes);
app.use('/items', itemOrdenRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API con Arquitectura de 3 Capas lista' });
});

module.exports = app;

require('./models');