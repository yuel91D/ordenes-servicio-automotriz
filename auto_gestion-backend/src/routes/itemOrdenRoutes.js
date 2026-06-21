const express = require('express');
const router = express.Router();
const itemOrdenController = require('../controllers/itemOrdenController');
const authMiddleware = require('../middlewares/authMiddleware');
const validarEsquema = require('../middlewares/validarMiddleware');
const { itemOrdenEsquema } = require('../utils/validators/esquemas');

// 🔒 Aplicamos protección a todo el router
router.use(authMiddleware);

router.post('/', validarEsquema(itemOrdenEsquema), itemOrdenController.crear);
router.put('/:id', validarEsquema(itemOrdenEsquema), itemOrdenController.actualizar);

router.get('/', itemOrdenController.listar);
router.get('/:id', itemOrdenController.obtener);
router.delete('/:id', itemOrdenController.eliminar);

module.exports = router;