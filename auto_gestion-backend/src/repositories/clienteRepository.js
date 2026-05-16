const { Cliente, Vehiculos } = require('../models');

class ClienteRepository {
  // Obtener todos los clientes con sus vehículos asignados
  async getAll() {
    return await Cliente.findAll({
      include: [{ model: Vehiculos, as: 'vehiculos' }]
    });
  }

  // Buscar un cliente por ID con sus vehículos
  async getById(id) {
    return await Cliente.findByPk(id, {
      include: [{ model: Vehiculos, as: 'vehiculos' }]
    });
  }

  async create(datosCliente) {
    return await Cliente.create(datosCliente);
  }

  async update(id, datosActualizados) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return null;
    return await cliente.update(datosActualizados);
  }

  async delete(id) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return false;
    await cliente.destroy();
    return true;
  }
}

module.exports = new ClienteRepository();