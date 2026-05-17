const ordenServicioRepository = require('../repositories/ordenServicioRepository');

// 1. Importamos los modelos reales directo desde su archivo fuente
const OrdenServicio = require('../models/OrdenServicio');
const Vehiculos = require('../models/Vehiculos');
const ItemOrden = require('../models/ItemOrden');

// 2. 🛡️ SEGURO ANTIFALLAS: Forzamos la declaración manual de relaciones aquí mismo
// Esto garantiza que Sequelize conozca los puentes, sin importar cómo se cargue el index.js
if (!OrdenServicio.associations || !OrdenServicio.associations.vehiculo) {
  OrdenServicio.belongsTo(Vehiculos, { foreignKey: 'vehiculo_id', as: 'vehiculo' });
}
if (!OrdenServicio.associations || !OrdenServicio.associations.items) {
  OrdenServicio.hasMany(ItemOrden, { foreignKey: 'orden_servicio_id', as: 'items' });
}

class OrdenServicioService {
  // 1. Crear Orden
  async crearOrden(datos) {
    const { vehiculo_id } = datos;

    const vehiculo = await Vehiculos.findByPk(vehiculo_id);
    if (!vehiculo) {
      throw new Error('El vehículo especificado no existe.');
    }

    const estadoVehiculo = vehiculo.estado ? String(vehiculo.estado).toLowerCase().trim() : '';

    if (estadoVehiculo === 'inactivo' || vehiculo.activo === false || vehiculo.activo === 0) {
      throw new Error('No se puede crear la orden: El vehículo se encuentra INACTIVO.');
    }

    return await ordenServicioRepository.crear(datos);
  }

  // 2. Obtener todas las órdenes con sus relaciones
  async obtenerTodas() {
    return await OrdenServicio.findAll({
      include: [
        { model: Vehiculos, as: 'vehiculo' },
        { model: ItemOrden, as: 'items' }
      ]
    });
  }

  // 3. Obtener una sola orden detallada por ID
  async obtenerPorId(id) {
    const orden = await OrdenServicio.findByPk(id, {
      include: [
        { model: Vehiculos, as: 'vehiculo' },
        { model: ItemOrden, as: 'items' }
      ]
    });

    if (!orden) {
      throw new Error(`La orden de servicio con ID ${id} no existe en el sistema.`);
    }

    return orden;
  }
}

module.exports = new OrdenServicioService();