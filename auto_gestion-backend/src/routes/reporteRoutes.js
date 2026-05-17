const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

router.get('/fechas', reporteController.obtenerReportePorFechas);

module.exports = router;