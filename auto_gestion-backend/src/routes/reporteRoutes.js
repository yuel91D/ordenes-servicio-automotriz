const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const autorizarRol = require('../middlewares/autorizarRol');

// 1. Listar historial de exportaciones (Permitido para Admin: 1 y Vendedor: 2)
router.get('/', autorizarRol(1, 2), (req, res) => reporteController.listarHistorial(req, res));

// 2. Generar reporte por rango de fechas (Exclusivo para Admin: 1)
router.get('/fechas', autorizarRol(1), (req, res) => reporteController.obtenerReportePorFechas(req, res));

// 3. Blindaje Anti-Edición (Se mantiene bloqueado en el controlador, pero se restringe a Admin)
router.put('/:id', autorizarRol(1), (req, res) => reporteController.actualizarExportacion(req, res));

// 4. Blindaje Anti-Eliminación (Se mantiene bloqueado en el controlador, pero se restringe a Admin)
router.delete('/:id', autorizarRol(1), (req, res) => reporteController.eliminarExportacion(req, res));

module.exports = router;