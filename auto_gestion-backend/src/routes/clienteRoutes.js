const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const validarEsquema = require('../middlewares/validarMiddleware');
const { clienteEsquema } = require('../utils/validators/esquemas'); //

router.get('/', clienteController.listar);
router.post('/', validarEsquema(clienteEsquema), clienteController.crear);
router.get('/:id', clienteController.obtener);
router.put('/:id', validarEsquema(clienteEsquema), clienteController.actualizar);
router.delete('/:id', clienteController.eliminar);

module.exports = router;