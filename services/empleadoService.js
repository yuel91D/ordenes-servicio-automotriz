const empleadoRepository = require('../repositories/empleadoRepository');

const empleadoService = {
  crearEmpleado: async (datos) => {
    const existe = await empleadoRepository.findByCedula(datos.cedula);
    if (existe) {
      const error = new Error("Ya existe un empleado con esa cédula.");
      error.statusCode = 400;
      throw error;
    }
    return await empleadoRepository.create(datos);
  },
  obtenerTodos: async () => await empleadoRepository.findAll()
};

module.exports = empleadoService;