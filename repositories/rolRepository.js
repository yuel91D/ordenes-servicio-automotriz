const { Rol } = require('../models');

const rolRepository = {
  findAll: async () => await Rol.findAll(),
  create: async (data) => await Rol.create(data)
};
module.exports = rolRepository;