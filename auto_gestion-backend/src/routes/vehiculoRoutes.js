const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');

// 🛡️ Apuntamos a la carpeta utils
const validarEsquema = require('../middlewares/validarMiddleware');
const { vehiculoEsquema } = require('../utils/validators/esquemas'); // 🔥 Agregamos /validators

router.post('/', validarEsquema(vehiculoEsquema), vehiculoController.crear);
router.put('/:id', validarEsquema(vehiculoEsquema), vehiculoController.actualizar);

router.get('/', vehiculoController.listar);
router.get('/:id', vehiculoController.obtener);
router.delete('/:id', vehiculoController.eliminar);

module.exports = router;