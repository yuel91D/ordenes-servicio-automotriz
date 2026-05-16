const express = require('express');
const router = express.Router();
const ordenServicioController = require('../controllers/ordenServicioController');

// 🛡️ Apuntamos a la carpeta utils
const validarEsquema = require('../middlewares/validarMiddleware');
const { ordenServicioEsquema } = require('../utils/validators/esquemas'); // 🔥 Agregamos /validators

router.post('/', validarEsquema(ordenServicioEsquema), ordenServicioController.crear);
router.put('/:id', validarEsquema(ordenServicioEsquema), ordenServicioController.actualizar);

router.get('/', ordenServicioController.listar);
router.get('/:id', ordenServicioController.obtener);
router.delete('/:id', ordenServicioController.eliminar);

module.exports = router;