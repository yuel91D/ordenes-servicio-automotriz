const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

// 1. Listar historial de exportaciones (GET http://localhost:3000/reporte)
router.get('/', (req, res) => reporteController.listarHistorial(req, res));

// 2. Generar reporte por rango de fechas (GET http://localhost:3000/reporte/fechas)
router.get('/fechas', (req, res) => reporteController.obtenerReportePorFechas(req, res));

// 3. Blindaje Anti-Edición (PUT http://localhost:3000/reporte/:id)
router.put('/:id', (req, res) => reporteController.actualizarExportacion(req, res));

// 4. Blindaje Anti-Eliminación (DELETE http://localhost:3000/reporte/:id)
router.delete('/:id', (req, res) => reporteController.eliminarExportacion(req, res));

module.exports = router;