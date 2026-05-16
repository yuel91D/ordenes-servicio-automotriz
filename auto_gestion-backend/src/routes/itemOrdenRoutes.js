const express = require('express');
const router = express.Router();
const itemOrdenController = require('../controllers/itemOrdenController');

router.post('/', itemOrdenController.crear);
router.get('/', itemOrdenController.listar);
router.get('/:id', itemOrdenController.obtener);
router.put('/:id', itemOrdenController.actualizar);
router.delete('/:id', itemOrdenController.eliminar);

module.exports = router;