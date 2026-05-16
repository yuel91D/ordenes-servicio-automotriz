const vehiculoRepository = require('../repositories/vehiculoRepository');

class VehiculoService {
  async listarVehiculos() {
    return await vehiculoRepository.obtenerTodos();
  }

  async obtenerVehiculo(id) {
    const vehiculo = await vehiculoRepository.obtenerPorId(id);
    if (!vehiculo) throw new Error('Vehículo no encontrado');
    return vehiculo;
  }

  async crearVehiculo(data) {
    if (!data.placa) {
      throw new Error('La placa es obligatoria');
    }
    return await vehiculoRepository.crear(data);
  }

  async actualizarVehiculo(id, data) {
    const vehiculo = await vehiculoRepository.actualizar(id, data);
    if (!vehiculo) throw new Error('Vehículo no encontrado para actualizar');
    return vehiculo;
  }

  async eliminarVehiculo(id) {
    const eliminado = await vehiculoRepository.eliminar(id);
    if (!eliminado) throw new Error('Vehículo no encontrado para eliminar');
    return true;
  }
}

module.exports = new VehiculoService();