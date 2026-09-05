const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');
const validarMiddleware = require('../middlewares/validarMiddleware');
const { empleado } = require('../utils/validators/esquemas');

// POST /empleados (la ruta base la defines en app.js)
router.post('/', validarMiddleware(empleado), empleadoController.create);
router.get('/', empleadoController.getAll);

module.exports = router;