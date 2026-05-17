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
  
  // 1. Reporte por rango de fechas
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