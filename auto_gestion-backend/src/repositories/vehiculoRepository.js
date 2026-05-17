// 🌟 IMPORTACIÓN DIRECTA: Apuntamos al nuevo nombre de archivo en minúscula
const Vehiculo = require('../models/vehiculos'); 
const Cliente = require('../models/cliente');

class VehiculoRepository {
  async obtenerTodos() { 
    return await Vehiculo.findAll({
      include: [{ model: Cliente, as: 'cliente' }]
    });
  }

  async obtenerPorId(id) { 
    return await Vehiculo.findByPk(id, {
      include: [{ model: Cliente, as: 'cliente' }]
    });
  }

  async crear(datosVehiculo) { 
    return await Vehiculo.create(datosVehiculo);
  }

  async actualizar(id, datosActualizados) { 
    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) return null;
    return await vehiculo.update(datosActualizados);
  }

  async eliminar(id) { 
    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) return false;
    await vehiculo.destroy();
    return true;
  }
}

module.exports = new VehiculoRepository();