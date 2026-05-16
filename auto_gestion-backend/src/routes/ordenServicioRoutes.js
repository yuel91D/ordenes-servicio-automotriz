const express = require('express');
const router = express.Router();
const ordenServicioController = require('../controllers/ordenServicioController');

// Definir las rutas HTTP vinculadas al controlador
router.get('/', ordenServicioController.getAll);
router.get('/:id', ordenServicioController.getById);
router.post('/', ordenServicioController.create);
router.put('/:id', ordenServicioController.update);
router.delete('/:id', ordenServicioController.delete);

module.exports = router;