const express = require('express');
const router = express.Router();
const itemOrdenController = require('../controllers/itemOrdenController');

// 🛡️ Apuntamos a la carpeta utils
const validarEsquema = require('../middlewares/validarMiddleware');
const { itemOrdenEsquema } = require('../utils/validators/esquemas'); // 🔥 Agregamos /validators

router.post('/', validarEsquema(itemOrdenEsquema), itemOrdenController.crear);
router.put('/:id', validarEsquema(itemOrdenEsquema), itemOrdenController.actualizar);

router.get('/', itemOrdenController.listar);
router.get('/:id', itemOrdenController.obtener);
router.delete('/:id', itemOrdenController.eliminar);

module.exports = router;