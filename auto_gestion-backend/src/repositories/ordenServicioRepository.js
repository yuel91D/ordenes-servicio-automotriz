// src/repositories/ordenServicioRepository.js
const { OrdenServicio, ItemOrden, vehiculo: Vehiculo } = require('../models');
const { Op } = require('sequelize');

class OrdenServicioRepository {
  
  // 📋 1. OBTENER TODAS (GET) - ¡Ya probado y funcionando con éxito!
  async obtenerTodas() {
    return await OrdenServicio.findAll({
      include: [
        { model: ItemOrden, as: 'items' }
      ]
    });
  }

  // 🔍 2. BUSCAR POR ID (GET por ID)
  async buscarPorId(id) {
    return await OrdenServicio.findByPk(id, {
      include: [
        { model: ItemOrden, as: 'items' }
      ]
    });
  }

  // 🚀 3. CREAR (POST)
  async crear(datos) {
    // Recibe los datos limpios mapeados desde el Service
    return await OrdenServicio.create(datos);
  }

  // 🔄 4. ACTUALIZAR (PUT)
  async actualizar(id, datos) {
    const orden = await OrdenServicio.findByPk(id);
    // 🛡️ Si la orden no existe en el taller, frena con elegancia para evitar crasheos
    if (!orden) return null; 
    
    return await orden.update(datos);
  }

  // 🗑️ 5. ELIMINAR (DELETE)
  async eliminar(id) {
    const orden = await OrdenServicio.findByPk(id);
    if (!orden) return false;

    // 🛡️ CONTROL DE INTEGRIDAD: Si la orden ya tiene repuestos o mano de obra asignada,
    // Sequelize podría lanzar un error de Foreign Key si MySQL no está en CASCADE.
    // Con esto nos aseguramos de limpiar los ítems amarrados antes de borrar la orden:
    await ItemOrden.destroy({
      where: { orden_servicio_id: id }
    });

    // Ahora que está limpia de dependencias, la eliminamos físicamente de MySQL
    await orden.destroy();
    return true;
  }

  // 📊 6. REPORTE POR FECHAS (Extra para tu módulo de Reportes)
  async obtenerReporteFechas(fechaInicio, fechaFin) {
    return await OrdenServicio.findAll({
      where: {
        fecha: {
          [Op.between]: [fechaInicio, fechaFin]
        }
      },
      include: [{ model: ItemOrden, as: 'items' }],
      order: [['fecha', 'DESC']]
    });
  }
}

// Es vital el 'new' para exportarlo como un objeto listo para usar
module.exports = new OrdenServicioRepository();