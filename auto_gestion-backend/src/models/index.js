const ordenServicioRepository = require('../repositories/ordenServicioRepository');

// 🌟 Importamos los modelos directamente desde su archivo fuente para asegurar que no sean undefined
const OrdenServicio = require('./ordenServicio');
const Vehiculos = require('./vehiculos');
const ItemOrden = require('./itemOrden');

class OrdenServicioService {
  // 1. Crear Orden
  async crearOrden(datos) {
    const { vehiculo_id } = datos;

    if (!Vehiculos) {
      throw new Error('El modelo "Vehiculos" no está correctamente cargado.');
    }

    const vehiculo = await Vehiculos.findByPk(vehiculo_id);
    if (!vehiculo) {
      throw new Error('El vehículo especificado no existe.');
    }

    console.log("=== DATOS DEL VEHÍCULO ENCONTRADO ===");
    console.log("ID:", vehiculo.id);
    console.log("Estado en BD:", vehiculo.estado);

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