const { ItemOrden, OrdenServicio } = require('../models');

class ItemOrdenRepository {
  async obtenerTodos() {
    return await ItemOrden.findAll({
      include: [{ model: OrdenServicio, as: 'orden' }]
    });
  }

  async obtenerPorId(id) {
    return await ItemOrden.findByPk(id, {
      include: [{ model: OrdenServicio, as: 'orden' }]
    });
  }

  async crear(datos) {
    return await ItemOrden.create(datos);
  }

  async actualizar(id, datos) {
    const item = await ItemOrden.findByPk(id);
    if (!item) return null;
    return await item.update(datos);
  }

  async eliminar(id) {
    const item = await ItemOrden.findByPk(id);
    if (!item) return false;
    await item.destroy();
    return true;
  }
}

// Es vital el 'new' para que actúe como un objeto con funciones asignadas
module.exports = new ItemOrdenRepository();