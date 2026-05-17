// 1. 🎯 Importaciones esenciales externas e internas
const { Op } = require('sequelize'); 
const db = require('../models'); // 🔥 ¡Aquí regresó nuestra base de datos!

class ItemOrdenService {

  async agregarItem(datos) {
    const { orden_servicio_id, descripcion, cantidad, precio_unitario } = datos;

    // Buscamos el modelo dinámicamente dentro de db
    const ItemOrden = db.ItemOrden || db.itemOrden || db.ItemOrdens || db.item_orden;

    if (!ItemOrden) {
      throw new Error('El modelo "ItemOrden" no está correctamente cargado o exportado en db.models.');
    }

    const descripcionLimpia = descripcion ? String(descripcion).trim() : '';

    // 2. 🛡️ REGLA DE NEGOCIO: Validar si el ítem ya existe en ESTA orden
    const itemDuplicado = await ItemOrden.findOne({
      where: {
        ordenServicioId: orden_servicio_id, 
        descripcion: descripcionLimpia
      }
    });

    if (itemDuplicado) {
      throw new Error(`No se puede agregar: El ítem "${descripcionLimpia}" ya se encuentra registrado en esta orden de servicio.`);
    }

    // 3. 🎯 MAPEEO SEGURO: Estructura exacta que espera tu modelo Sequelize
    const datosParaGuardar = {
      ordenServicioId: orden_servicio_id,
      descripcion: descripcionLimpia,
      cantidad: cantidad,
      valorUnitario: precio_unitario 
    };

    // 4. Guardamos en MySQL
    return await ItemOrden.create(datosParaGuardar);
  }

  // Mantenemos los cascarones de los otros métodos para no romper el controlador
  async listarItems() { return []; }
  async obtenerItem(id) { return null; }
  async actualizarItem(id, datos) { return null; }
  async eliminarItem(id) {
    const ItemOrden = db.ItemOrden || db.itemOrden || db.ItemOrdens || db.item_orden;

    if (!ItemOrden) {
      throw new Error('El modelo "ItemOrden" no está correctamente cargado o exportado.');
    }

    // 1. Buscamos si el ítem realmente existe antes de intentar borrarlo
    const item = await ItemOrden.findByPk(id);

    if (!item) {
      throw new Error(`No se puede eliminar: El ítem con ID ${id} no existe en el sistema.`);
    }

    // 2. Lo eliminamos físicamente de MySQL
    await item.destroy();

    return { message: `Ítem con ID ${id} eliminado correctamente.` };
  }
}

module.exports = new ItemOrdenService();