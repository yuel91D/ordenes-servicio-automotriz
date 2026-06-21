const { Op } = require('sequelize');
// Importamos todo desde el index de modelos
const { OrdenServicio, Vehiculo, Cliente, ItemOrden } = require('../models');

class ReporteRepository {
  async obtenerOrdenesPorRangoFechas(fechaInicio, fechaFin) {
    try {
      return await OrdenServicio.findAll({
        where: {
          fecha: {
            [Op.between]: [fechaInicio, fechaFin]
          }
        },
        order: [['fecha', 'ASC']],
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
    } catch (error) {
      console.error("Error en ReporteRepository (obtenerOrdenesPorRangoFechas):", error);
      throw new Error('Error al consultar los datos del reporte en la base de datos.');
    }
  }
}

module.exports = new ReporteRepository();