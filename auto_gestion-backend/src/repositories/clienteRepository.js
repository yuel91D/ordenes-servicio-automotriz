const Cliente = require('../models/cliente');
const Vehiculo = require('../models/vehiculos'); // 🌟 Importado en singular

class ClienteRepository {
  async obtenerTodos() {
    return await Cliente.findAll({
      // ✅ Corregido: Ahora usa la variable 'Vehiculo' que importaste arriba
      include: [{ model: Vehiculo, as: 'vehiculos' }] 
    });
  }

  async obtenerPorId(id) {
    return await Cliente.findByPk(id, {
      // ✅ Corregido aquí también
      include: [{ model: Vehiculo, as: 'vehiculos' }]
    });
  }

  async crear(datos) {
    return await Cliente.create(datos);
  }

  async actualizar(id, datos) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return null;
    return await cliente.update(datos);
  }

  async eliminar(id) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return false;
    await cliente.destroy();
    return true;
  }
}

module.exports = new ClienteRepository();