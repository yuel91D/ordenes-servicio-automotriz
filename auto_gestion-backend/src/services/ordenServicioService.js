const ordenServicioRepository = require('../repositories/ordenServicioRepository');

class OrdenServicioService {
  async listarOrdenes() {
    return await ordenServicioRepository.obtenerTodos();
  }

  async obtenerOrden(id) {
    const orden = await ordenServicioRepository.obtenerPorId(id);
    if (!orden) throw new Error('Orden de servicio no encontrada');
    return orden;
  }

  async crearOrden(data) {
    if (!data.vehiculo_id) {
      throw new Error('El ID del vehículo es obligatorio para generar una orden');
    }
    return await ordenServicioRepository.crear(data);
  }

  async actualizarOrden(id, data) {
    const orden = await ordenServicioRepository.actualizar(id, data);
    if (!orden) throw new Error('Orden no encontrada para actualizar');
    return orden;
  }

  async eliminarOrden(id) {
    const eliminado = await ordenServicioRepository.eliminar(id);
    if (!eliminado) throw new Error('Orden no encontrada para eliminar');
    return true;
  }
}

module.exports = new OrdenServicioService();