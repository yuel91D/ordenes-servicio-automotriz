const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/autorizacionMiddleware');
const validarEsquema = require('../middlewares/validarMiddleware');
const ordenServicioController = require('../controllers/ordenServicioController');
const { ordenServicioEsquema, ordenServicioUpdateEsquema } = require('../utils/validators/esquemas');

// 🔒 Middleware Global
router.use(authMiddleware);

// 📖 Rutas de Lectura
router.get('/', verificarRol(['admin', 'vendedor']), ordenServicioController.listar);
router.get('/:id', ordenServicioController.buscarPorId);
router.get('/reporte/fechas', verificarRol(['admin']), ordenServicioController.obtenerReportePorFechas);

// ✍️ Rutas de Escritura
router.post('/', verificarRol(['admin', 'vendedor']), validarEsquema(ordenServicioEsquema), ordenServicioController.crear);
router.put('/:id', verificarRol(['admin', 'vendedor']), validarEsquema(ordenServicioUpdateEsquema), ordenServicioController.actualizar);
router.delete('/:id', verificarRol(['admin']), ordenServicioController.eliminar);

module.exports = router;