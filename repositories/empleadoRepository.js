const { Empleado } = require('../models');

const empleadoRepository = {
  create: async (datos) => await Empleado.create(datos),
  findAll: async () => await Empleado.findAll(),
  findByCedula: async (cedula) => await Empleado.findOne({ where: { cedula } })
};

module.exports = empleadoRepository;