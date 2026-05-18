const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

const validarEsquema = require('../middlewares/validarMiddleware');
// 🌟 Importamos ambos esquemas
const { clienteEsquema, clienteUpdateEsquema } = require('../utils/validators/esquemas');

router.get('/', clienteController.listar);
// 🛡️ El POST exige todos los campos obligatorios
router.post('/', validarEsquema(clienteEsquema), clienteController.crear);

router.get('/:id', clienteController.obtener);

// 🛡️ El PUT ahora usa el esquema flexible
router.put('/:id', validarEsquema(clienteUpdateEsquema), clienteController.actualizar);

router.delete('/:id', clienteController.eliminar);

module.exports = router;