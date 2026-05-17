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
      // 🎯 Cambiamos crearItem por agregarItem para que coincida con el servicio
      const item = await itemOrdenService.agregarItem(req.body); 
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
      const { id } = req.params; // Capturamos el id que viene en la URL /items/:id
      
      const resultado = await itemOrdenService.eliminarItem(id);
      
      res.status(200).json({ success: true, message: resultado.message });
    } catch (error) {
      // Si el ítem no existía, enviamos un 404 (Not Found) o 400 según prefieras
      const statusCode = error.message.includes('not existe') ? 404 : 400;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ItemOrdenController();