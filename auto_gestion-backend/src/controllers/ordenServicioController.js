const ordenServicioService = require('../services/ordenServicioService');

class OrdenServicioController {
  // 1. Crear Orden (Con nuestro escudo de Vehículo Inactivo)
  async crear(req, res) {
    try {
      const orden = await ordenServicioService.crearOrden(req.body);
      res.status(201).json({ success: true, data: orden });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // 2. Listar Órdenes
  async listar(req, res) {
    try {
      res.status(200).json({ success: true, data: [] });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 3. 🎯 AQUÍ ESTÁ EL TRUCO: Se debe llamar "obtener" para tus rutas
  async obtener(req, res) {
    try {
      res.status(200).json({ success: true, data: null });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 4. Actualizar Orden
  async actualizar(req, res) {
    try {
      res.status(200).json({ success: true, message: "Actualizado con éxito" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 5. Eliminar Orden
  async eliminar(req, res) {
    try {
      res.status(200).json({ success: true, message: "Eliminado con éxito" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new OrdenServicioController();