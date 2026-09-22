// 1. Imports
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger'); // Importamos la spec modularizada
const agentRoutes = require('./routes/agent.routes.js');

// 2. Definición de rutas
const clienteRoutes = require('./routes/clienteRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const ordenServicioRoutes = require('./routes/ordenServicioRoutes');
const itemOrdenRoutes = require('./routes/itemOrdenRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const authRoutes = require('./routes/authRoutes');
const rolRoutes = require('./routes/rolRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');

const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas de la aplicación
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/empleados', empleadoRoutes);
app.use('/clientes', clienteRoutes);
app.use('/vehiculos', vehiculoRoutes);
app.use('/ordenes', ordenServicioRoutes);
app.use('/items', itemOrdenRoutes);
app.use('/reporte', reporteRoutes);
app.use('/roles', rolRoutes);

// Gemini IA (debe registrarse antes del middleware global de errores)
app.use(agentRoutes);

// RED DE SEGURIDAD GLOBAL (al final de todas las rutas)
app.use(errorMiddleware);

module.exports = app;