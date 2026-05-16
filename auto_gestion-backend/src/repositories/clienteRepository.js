const { Cliente, Vehiculos } = require('../models');

class ClienteRepository {
  async obtenerTodos() {
    return await Cliente.findAll({
      include: [{ model: Vehiculos, as: 'vehiculos' }]
    });
  }

  async obtenerPorId(id) {
    return await Cliente.findByPk(id, {
      include: [{ model: Vehiculos, as: 'vehiculos' }]
    });
  }

  async crear(datos) {
    return await Cliente.create(datos);
  }

  async actualizar(id, datos) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return null;
    return await cliente.update(datos);
  }

  async eliminar(id) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return false;
    await cliente.destroy();
    return true;
  }
}

module.exports = new ClienteRepository();