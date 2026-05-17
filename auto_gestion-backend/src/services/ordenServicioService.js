const ordenServicioRepository = require('../repositories/ordenServicioRepository');

// 1. Importamos los modelos reales directo desde su archivo fuente
const { Op } = require('sequelize');
const OrdenServicio = require('../models/OrdenServicio');
const Vehiculos = require('../models/Vehiculos');
const ItemOrden = require('../models/ItemOrden');

// 2. 🛡️ SEGURO ANTIFALLAS: Forzamos la declaración manual de relaciones aquí mismo
if (!OrdenServicio.associations || !OrdenServicio.associations.vehiculo) {
  OrdenServicio.belongsTo(Vehiculos, { foreignKey: 'vehiculo_id', as: 'vehiculo' });
}
if (!OrdenServicio.associations || !OrdenServicio.associations.items) {
  OrdenServicio.hasMany(ItemOrden, { foreignKey: 'ordenServicioId', as: 'items' });
}

class OrdenServicioService {

 // 🚀 Crear Orden con Validación de Vehículo Activo
  async crear(datosOrden) {
    // 🌟 Leemos directamente 'vehiculo_id' que es lo que pasa limpio por el validador
    const { vehiculo_id } = datosOrden; 

    if (!vehiculo_id) {
      throw new Error("Error: No se proporcionó un 'vehiculo_id' en la petición.");
    }

    // 🔍 Candado 1: Buscar el vehículo usando el ID en MySQL
    const vehiculo = await Vehiculos.findByPk(vehiculo_id);

    if (!vehiculo) {
      throw new Error(`Error: El vehículo con ID ${vehiculo_id} no está registrado en el sistema.`);
    }

    // 🛡️ Candado 2: VALIDACIÓN CHECKLIST (Frenar si está inactivo)
    if (vehiculo.estado === 'inactivo') {
      throw new Error(`No se puede registrar la orden: El vehículo se encuentra INACTIVO en el sistema.`);
    }

    // 🏎️ Si el vehículo está activo, procede a guardarse en la base de datos
    return await ordenServicioRepository.crear(datosOrden);
  }
  
  // 2. Reporte por rango de fechas
  async generarReporteFechas(fechaInicio, fechaFin) {
    // 🛡️ Seguro Relacional en Caliente básico
    if (!OrdenServicio.associations.vehiculo) {
      OrdenServicio.belongsTo(Vehiculos, { foreignKey: 'vehiculo_id', as: 'vehiculo' });
    }
    if (!OrdenServicio.associations.items) {
      OrdenServicio.hasMany(ItemOrden, { foreignKey: 'ordenServicioId', as: 'items' }); 
    }

    // 🔍 Consulta robusta a MySQL con tu campo REAL 'fecha'
    const ordenes = await OrdenServicio.findAll({
      where: {
        // 🌟 ¡Tu campo real mapeado del modelo!
        fecha: {
          [Op.between]: [fechaInicio, fechaFin]
        }
      },
      include: [
        {
          model: Vehiculos,
          as: 'vehiculo'
        },
        {
          model: ItemOrden,
          as: 'items'
        }
      ],
      // 🌟 Ordenamos por tu campo real
      order: [['fecha', 'DESC']] 
    });

    return ordenes;
  }

  // 3. Obtener todas las órdenes con sus relaciones
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