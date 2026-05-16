const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API funcionando correctamente'
  });
});

// ¡Exportamos solo la aplicación configurada!
module.exports = app;

// Esto carga el archivo index.js de la carpeta models y ejecuta todas las relaciones
require('./models');