const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');

// Mapeo exacto de funciones
router.post('/', vehiculoController.crear);
router.get('/', vehiculoController.listar);
router.get('/:id', vehiculoController.obtener);
router.put('/:id', vehiculoController.actualizar);
router.delete('/:id', vehiculoController.eliminar);

module.exports = router;