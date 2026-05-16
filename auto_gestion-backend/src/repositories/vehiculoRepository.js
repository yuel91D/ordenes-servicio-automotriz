// ✅ AHORA: Apuntas directo a la carpeta 'models' (Node.js busca el index.js automáticamente)
// y extraes ("destructuras") solo los modelos que necesitas en este archivo.
const { Vehiculos, Cliente } = require('../models');

class VehiculoRepository {
  async getAll() {
    // Recuerda usar 'Vehiculos' con la 'V' mayúscula y la 's' al final, tal como lo exportamos
    return await Vehiculos.findAll({
      include: { model: Cliente, as: 'cliente' }
    });
  }

  async getById(id) {
    return await Vehiculos.findByPk(id, {
      include: { model: Cliente, as: 'cliente' }
    });
  }

  async create(datosVehiculo) {
    return await Vehiculos.create(datosVehiculo);
  }

  async update(id, datosActualizados) {
    const vehiculo = await Vehiculos.findByPk(id);
    if (!vehiculo) return null;
    return await vehiculo.update(datosActualizados);
  }

  async delete(id) {
    const vehiculo = await Vehiculos.findByPk(id);
    if (!vehiculo) return false;
    await vehiculo.destroy();
    return true;
  }
}

module.exports = new VehiculoRepository();