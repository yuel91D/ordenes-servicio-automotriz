const Rol = require('../models/Rol');

const obtenerRoles = async () => {
  return await Rol.findAll();
};

module.exports = {
  obtenerRoles,
};