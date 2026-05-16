const { OrdenServicio, Vehiculos, ItemOrden } = require('../models');

class OrdenServicioRepository {
  // 1. Obtener todas las órdenes con el vehículo asignado e ítems incluidos
  async getAll() {
    return await OrdenServicio.findAll({
      include: [
        { model: Vehiculos, as: 'vehiculo' },
        { model: ItemOrden, as: 'items' }
      ]
    });
  }

  // 2. Buscar una orden específica por su ID (la llave primaria real)
  async getById(id) {
    return await OrdenServicio.findByPk(id, {
      include: [
        { model: Vehiculos, as: 'vehiculo' },
        { model: ItemOrden, as: 'items' }
      ]
    });
  }

  // 3. Crear una nueva orden de servicio
  async create(datosOrden) {
    return await OrdenServicio.create(datosOrden);
  }

  // 4. Actualizar datos de una orden
  async update(id, datosActualizados) {
    const orden = await OrdenServicio.findByPk(id);
    if (!orden) return null;
    return await orden.update(datosActualizados);
  }

  // 5. Eliminar una orden de servicio
  async delete(id) {
    const orden = await OrdenServicio.findByPk(id);
    if (!orden) return false;
    await orden.destroy();
    return true;
  }
}

// Exportamos una instancia única de la clase (Singleton)
module.exports = new OrdenServicioRepository();