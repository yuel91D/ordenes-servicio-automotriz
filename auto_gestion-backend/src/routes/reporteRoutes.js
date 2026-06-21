const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const authMiddleware = require('../middlewares/authMiddleware'); // 🔒 Importamos el middleware

// Aplicamos el authMiddleware a TODAS las rutas de este archivo
router.use(authMiddleware);

// Generar reporte de fechas
router.get('/fechas', reporteController.obtenerReportePorFechas);

// Listar historial de exportaciones
router.get('/', reporteController.listarHistorial);

// Eliminar un registro de exportación
router.delete('/:id', reporteController.eliminarRegistro);

module.exports = router;