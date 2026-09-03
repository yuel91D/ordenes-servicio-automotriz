const Rol = require('../models/Rol');

const obtenerRoles = async () => {
  return await Rol.findAll();
};

const crearRol = async (data) => {
  return await Rol.create(data);
};

const actualizarRol = async (id, data) => {
  const rol = await Rol.findByPk(id);
  if (!rol) return null;
  return await rol.update(data);
};

const eliminarRol = async (id) => {
  const rol = await Rol.findByPk(id);
  if (!rol) return null;
  await rol.destroy();
  return true;
};

module.exports = {
  obtenerRoles,
  crearRol,
  actualizarRol,
  eliminarRol
};