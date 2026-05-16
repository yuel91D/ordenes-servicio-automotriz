const { ItemOrden, OrdenServicio } = require('../models');

class ItemOrdenRepository {
  // Obtener todos los ítems de repuestos/servicios registrados
  async getAll() {
    return await ItemOrden.findAll({
      include: [{ model: OrdenServicio, as: 'orden' }] // 🔥 Corregido aquí
    });
  }

  // Buscar un ítem por su ID primario (item_orden_id)
  async getById(id) {
    return await ItemOrden.findByPk(id, {
      include: [{ model: OrdenServicio, as: 'orden' }] // 🔥 Corregido aquí
    });
  }

  // Agregar un repuesto/servicio a una orden
  async create(datosItem) {
    return await ItemOrden.create(datosItem);
  }

  // Actualizar precio, descripción o cantidad de un ítem existente
  async update(id, datosActualizados) {
    const item = await ItemOrden.findByPk(id);
    if (!item) return null;
    return await item.update(datosActualizados);
  }

  // Eliminar un ítem de una orden
  async delete(id) {
    const item = await ItemOrden.findByPk(id);
    if (!item) return false;
    await item.destroy();
    return true;
  }
}

module.exports = new ItemOrdenRepository();