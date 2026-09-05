const rolRepository = require('../repositories/rolRepository');

const rolService = {
  obtenerTodos: async () => await rolRepository.findAll(),
  crearRol: async (data) => await rolRepository.create(data)
};
module.exports = rolService;