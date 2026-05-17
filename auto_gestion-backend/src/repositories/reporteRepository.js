const { Op } = require('sequelize');
// 🌟 Importaciones directas usando tu nueva nomenclatura uniforme
const OrdenServicio = require('../models/ordenServicio');
const Vehiculo = require('../models/vehiculos');
const Cliente = require('../models/cliente');
const ItemOrden = require('../models/itemOrden');

class ReporteRepository {
  async obtenerOrdenesPorRangoFechas(fechaInicio, fechaFin) {
    return await OrdenServicio.findAll({
      where: {
        fecha: {
          [Op.between]: [fechaInicio, fechaFin]
        }
      },
      order: [['fecha', 'ASC']],
      // 🔗 Relacionamiento profundo usando los modelos directos
      include: [
        {
          model: Vehiculo,
          as: 'vehiculo', 
          include: [
            {
              model: Cliente,
              as: 'cliente' 
            }
          ]
        },
        {
          model: ItemOrden,
          as: 'items' 
        }
      ]
    });
  }
}

module.exports = new ReporteRepository();