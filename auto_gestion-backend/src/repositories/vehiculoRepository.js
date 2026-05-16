const { Vehiculos, Cliente } = require('../models');

class VehiculoRepository {
  async obtenerTodos() { // 🔥 Cambiado para coincidir con tu listarVehiculos()
    return await Vehiculos.findAll({
      include: [{ model: Cliente, as: 'cliente' }]
    });
  }

  async obtenerPorId(id) { // 🔥 Cambiado para coincidir con tu obtenerVehiculo(id)
    return await Vehiculos.findByPk(id, {
      include: [{ model: Cliente, as: 'cliente' }]
    });
  }

  async crear(datosVehiculo) { // 🔥 Cambiado para coincidir con tu crearVehiculo(data)
    return await Vehiculos.create(datosVehiculo);
  }

  async actualizar(id, datosActualizados) { // 🔥 Cambiado para coincidir con tu actualizarVehiculo
    const vehiculo = await Vehiculos.findByPk(id);
    if (!vehiculo) return null;
    return await vehiculo.update(datosActualizados);
  }

  async eliminar(id) { // 🔥 Cambiado para coincidir con tu eliminarVehiculo
    const vehiculo = await Vehiculos.findByPk(id);
    if (!vehiculo) return false;
    await vehiculo.destroy();
    return true;
  }
}

module.exports = new VehiculoRepository();