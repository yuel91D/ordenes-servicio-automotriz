const express = require('express');
const router = express.Router();
const ordenServicioController = require('../controllers/ordenServicioController');

const validarEsquema = require('../middlewares/validarMiddleware');
const { ordenServicioEsquema } = require('../utils/validators/esquemas');

// Rutas de Escritura
router.post('/', validarEsquema(ordenServicioEsquema), ordenServicioController.crear);
router.put('/:id', validarEsquema(ordenServicioEsquema), ordenServicioController.actualizar);
router.delete('/:id', ordenServicioController.eliminar);

// Rutas de Lectura (Unificadas)
router.get('/', ordenServicioController.listar);
router.get('/:id', ordenServicioController.buscarPorId);

module.exports = router;