const itemOrdenService = require('../services/itemOrdenService');

class ItemOrdenController {
  async listar(req, res) {
    try {
      const items = await itemOrdenService.listarItems();
      res.json({
        success: true,
        data: items
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtener(req, res) {
    try {
      const item = await itemOrdenService.obtenerItem(req.params.id);
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async crear(req, res) {
    try {
      const item = await itemOrdenService.crearItem(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async actualizar(req, res) {
    try {
      const item = await itemOrdenService.actualizarItem(req.params.id, req.body);
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      await itemOrdenService.eliminarItem(req.params.id);
      res.json({ success: true, message: 'Ítem eliminado de la orden' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ItemOrdenController();