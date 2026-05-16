const itemOrdenRepository = require('../repositories/itemOrdenRepository');

class ItemOrdenService {
  async listarItems() {
    // Aquí invocamos el método del repositorio corregido
    return await itemOrdenRepository.obtenerTodos();
  }

  async obtenerItem(id) {
    const item = await itemOrdenRepository.obtenerPorId(id);
    if (!item) throw new Error('Ítem no encontrado');
    return item;
  }

  async crearItem(data) {
    if (!data.descripcion || !data.valorUnitario) {
      throw new Error('La descripción y el valor unitario son obligatorios');
    }
    return await itemOrdenRepository.crear(data);
  }

  async actualizarItem(id, data) {
    const item = await itemOrdenRepository.actualizar(id, data);
    if (!item) throw new Error('Ítem no encontrado para actualizar');
    return item;
  }

  async eliminarItem(id) {
    const eliminado = await itemOrdenRepository.eliminar(id);
    if (!eliminado) throw new Error('Ítem no encontrado para eliminar');
    return true;
  }
}

module.exports = new ItemOrdenService();