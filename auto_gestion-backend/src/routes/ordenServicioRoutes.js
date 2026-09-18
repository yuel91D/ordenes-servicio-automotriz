const express = require('express');
const router = express.Router();
const ordenServicioController = require('../controllers/ordenServicioController');

// Endpoints de Órdenes de Servicio
router.post('/', ordenServicioController.crear);
router.get('/', ordenServicioController.listar);
router.get('/:id', ordenServicioController.obtener);
router.put('/:id', ordenServicioController.actualizar);
router.delete('/:id', ordenServicioController.bloquearEliminacion);

module.exports = router;