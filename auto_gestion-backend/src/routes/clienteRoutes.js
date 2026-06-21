// 1. Imports
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/autorizacionMiddleware');
const validarEsquema = require('../middlewares/validarMiddleware');

const clienteController = require('../controllers/clienteController');
const { clienteEsquema, clienteUpdateEsquema } = require('../utils/validators/esquemas');

// 2. Middleware Global para este Router
router.use(authMiddleware);

// 3. Definición de Rutas (Sin duplicados y con roles aplicados)

// Listar: Accesible para admin y vendedor
router.get('/', verificarRol(['admin', 'vendedor']), clienteController.listar);

// Obtener por ID: Accesible para todos los logueados
router.get('/:id', clienteController.obtener);

// Crear: Solo admin y vendedor
router.post('/', verificarRol(['admin', 'vendedor']), validarEsquema(clienteEsquema), clienteController.crear);

// Actualizar: Solo admin y vendedor
router.put('/:id', verificarRol(['admin', 'vendedor']), validarEsquema(clienteUpdateEsquema), clienteController.actualizar);

// Eliminar: Solo admin
router.delete('/:id', verificarRol(['admin']), clienteController.eliminar);

module.exports = router;