// 1. 🎯 Importaciones esenciales externas e internas
const { Op } = require('sequelize'); 

// Importación directa y segura para evitar el "undefined"
const ItemOrden = require('../models/itemOrden'); 

class ItemOrdenService {

  async agregarItem(datos) {
    // Capturamos los datos tal como te llegan desde Postman/Swagger
    const { orden_servicio_id, descripcion, cantidad, precio_unitario } = datos;

    if (!ItemOrden) {
      throw new Error('El modelo "ItemOrden" no está correctamente cargado.');
    }

    const descripcionLimpia = descripcion ? String(descripcion).trim() : '';

    // 2. 🛡️ REGLA DE NEGOCIO: Validar si el ítem ya existe en ESTA orden
    const itemDuplicado = await ItemOrden.findOne({
      where: {
        // 🌟 Ajustado a camelCase para la consulta interna de Sequelize
        ordenServicioId: orden_servicio_id, 
        descripcion: descripcionLimpia
      }
    });

    if (itemDuplicado) {
      throw new Error(`No se puede agregar: El ítem "${descripcionLimpia}" ya se encuentra registrado en esta orden de servicio.`);
    }

    // 3. 🎯 MAPEO SEGURO: Coincidencia exacta con las columnas de tu BD (camelCase)
    const datosParaGuardar = {
      ordenServicioId: orden_servicio_id,  // 🌟 Corregido a camelCase
      descripcion: descripcionLimpia,
      cantidad: cantidad,
      valorUnitario: precio_unitario       // 🌟 Corregido a camelCase
    };

    // 4. Guardamos en MySQL
    return await ItemOrden.create(datosParaGuardar);
  }

  // Mantenemos los cascarones de los otros métodos para no romper el controlador
  async listarItems() { return []; }
  async obtenerItem(id) { return null; }
  async actualizarItem(id, datos) { return null; }
  
  async eliminarItem(id) {
    if (!ItemOrden) {
      throw new Error('El modelo "ItemOrden" no está correctamente cargado.');
    }

    const item = await ItemOrden.findByPk(id);

    if (!item) {
      throw new Error(`No se puede eliminar: El ítem con ID ${id} no existe en el sistema.`);
    }

    await item.destroy();
    return { message: `Ítem con ID ${id} eliminado correctamente.` };
  }
}

module.exports = new ItemOrdenService();