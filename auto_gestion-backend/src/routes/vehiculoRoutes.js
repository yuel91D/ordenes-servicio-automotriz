const express = require('express');
const router = express.Router();

// 🌟 CORREGIDO: Una sola importación limpia del controlador
const vehiculoController = require('../controllers/vehiculoController');

const validarEsquema = require('../middlewares/validarMiddleware'); 

// 🌟 CORREGIDO: Traemos ambos esquemas de vehículos desde tu archivo
const { vehiculoEsquema, vehiculoUpdateEsquema } = require('../utils/validators/esquemas'); 

// 🚗 Ruta para CREAR Vehículo
router.post('/', validarEsquema(vehiculoEsquema), vehiculoController.crear);

// 🔄 Ruta para ACTUALIZAR Vehículo (Ahora sí con su esquema opcional)
router.put('/:id', validarEsquema(vehiculoUpdateEsquema), vehiculoController.actualizar);

// Otras rutas estándar
router.get('/', vehiculoController.listar);
router.get('/:id', vehiculoController.obtener);
router.delete('/:id', vehiculoController.eliminar);

module.exports = router;