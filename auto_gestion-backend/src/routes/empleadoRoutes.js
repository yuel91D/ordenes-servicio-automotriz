const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const empleadoController = require('../controllers/empleadoController');

router.use(authMiddleware);

router.get('/', empleadoController.listarEmpleados);
router.post('/', empleadoController.crearEmpleado);
router.put('/:id', empleadoController.actualizarEmpleado);
router.delete('/:id', empleadoController.eliminarEmpleado);

router.get('/', async (req, res, next) => {
  try {
    const empleados = await empleadoService.listarEmpleados();
    res.status(200).json({ success: true, total: empleados.length, empleados });
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const nuevoEmpleado = await empleadoService.crearEmpleado(req.body);
    res.status(201).json({ success: true, message: 'Empleado creado exitosamente', empleado: nuevoEmpleado });
  } catch (error) { next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const actualizado = await empleadoService.actualizarEmpleado(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ success: false, message: 'Empleado no existe.' });
    res.status(200).json({ success: true, message: 'Empleado actualizado exitosamente', empleado: actualizado });
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const eliminado = await empleadoService.eliminarEmpleado(req.params.id);
    if (!eliminado) return res.status(404).json({ success: false, message: 'Empleado no existe.' });
    res.status(200).json({ success: true, message: 'Empleado eliminado exitosamente' });
  } catch (error) { next(error); }
});

module.exports = router;