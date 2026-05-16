const ordenServicioService = require('../services/ordenServicioService');

class OrdenServicioController {
  async listar(req, res) {
    try {
      const ordenes = await ordenServicioService.listarOrdenes();
      res.json({ success: true, data: ordenes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async obtener(req, res) {
    try {
      const orden = await ordenServicioService.obtenerOrden(req.params.id);
      res.json({ success: true, data: orden });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async crear(req, res) {
    try {
      const orden = await ordenServicioService.crearOrden(req.body);
      res.status(201).json({ success: true, data: orden });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async actualizar(req, res) {
    try {
      const orden = await ordenServicioService.actualizarOrden(req.params.id, req.body);
      res.json({ success: true, data: orden });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      await ordenServicioService.eliminarOrden(req.params.id);
      res.json({ success: true, message: 'Orden de servicio eliminada correctamente' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new OrdenServicioController();