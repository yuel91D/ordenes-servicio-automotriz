const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/autorizacionMiddleware');
const validarEsquema = require('../middlewares/validarMiddleware');
const vehiculoController = require('../controllers/vehiculoController');
const { vehiculoEsquema } = require('../utils/validators/esquemas');

// 🔒 Middleware Global
router.use(authMiddleware);

// 🚗 Rutas
router.get('/', verificarRol(['admin', 'vendedor']), vehiculoController.listar);
router.get('/:id', vehiculoController.obtener);
router.post('/', verificarRol(['admin', 'vendedor']), validarEsquema(vehiculoEsquema), vehiculoController.crear);
router.put('/:id', verificarRol(['admin', 'vendedor']), vehiculoController.actualizar);
router.delete('/:id', verificarRol(['admin']), vehiculoController.eliminar);

module.exports = router;