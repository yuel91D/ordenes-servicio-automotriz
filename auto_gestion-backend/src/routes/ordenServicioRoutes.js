const express = require('express');
const router = express.Router();
const ordenServicioController = require('../controllers/ordenServicioController');
const validarEsquema = require('../middlewares/validarMiddleware');
const { ordenServicioEsquema, ordenServicioUpdateEsquema } = require('../utils/validators/esquemas');

// ✍️ Rutas de Escritura
router.post('/', validarEsquema(ordenServicioEsquema), ordenServicioController.crear);
// 🚀 Usamos el esquema de actualización aquí
router.put('/:id', validarEsquema(ordenServicioUpdateEsquema), ordenServicioController.actualizar);
router.delete('/:id', ordenServicioController.eliminar);

// 📖 Rutas de Lectura
router.get('/reporte/fechas', ordenServicioController.obtenerReportePorFechas);
router.get('/', ordenServicioController.listar);
router.get('/:id', ordenServicioController.buscarPorId);

module.exports = router;