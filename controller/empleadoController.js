const empleadoService = require('../services/empleadoService');

const empleadoController = {
  create: async (req, res, next) => {
    try {
      const nuevoEmpleado = await empleadoService.crearEmpleado(req.body);
      res.status(201).json({ success: true, data: nuevoEmpleado });
    } catch (err) { next(err); }
  },
  getAll: async (req, res, next) => {
    try {
      const empleados = await empleadoService.obtenerTodos();
      res.json({ success: true, data: empleados });
    } catch (err) { next(err); }
  }
};

module.exports = empleadoController;