const rolService = require('../services/rolService');

const rolController = {
  getAll: async (req, res, next) => {
    try {
      const roles = await rolService.obtenerTodos();
      res.json({ success: true, data: roles });
    } catch (err) { next(err); }
  },
  create: async (req, res, next) => {
    try {
      const nuevoRol = await rolService.crearRol(req.body);
      res.status(201).json({ success: true, data: nuevoRol });
    } catch (err) { next(err); }
  }
};
module.exports = rolController;