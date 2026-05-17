const ordenServicioService = require('../services/ordenServicioService');

class OrdenServicioController {
  // 1. Crear una nueva orden
  async crear(req, res) {
    try {
      const nuevaOrden = await ordenServicioService.crear(req.body);
      return res.status(201).json({
        success: true,
        data: nuevaOrden
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message // Aquí viajará el mensaje del carro inactivo 🛡️
      });
    }
  }

  // 2. Listar todas las órdenes
  async listar(req, res) {
    try {
      const ordenes = await ordenServicioService.obtenerTodas();
      res.status(200).json({ success: true, data: ordenes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 3. Buscar orden específica por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const orden = await ordenServicioService.obtenerPorId(id);
      res.status(200).json({ success: true, data: orden });
    } catch (error) {
      const statusCode = error.message.includes('no existe') ? 404 : 400;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  // 4. Actualizar Orden (Estructura base)
  async actualizar(req, res) {
    try {
      res.status(200).json({ success: true, message: "Actualizado con éxito" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // 5. Eliminar Orden (Estructura base)
  async eliminar(req, res) {
    try {
      res.status(200).json({ success: true, message: "Eliminado con éxito" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  // 6. Reporte por Fechas  
  async obtenerReportePorFechas(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;

      // Validación rápida de parámetros de consulta
      if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({
          success: false,
          message: "Faltan parámetros requeridos: 'fecha_inicio' y 'fecha_fin' son obligatorios (Formato: YYYY-MM-DD)."
        });
      }

      const reporte = await ordenServicioService.generarReporteFechas(fecha_inicio, fecha_fin);

      return res.status(200).json({
        success: true,
        data: reporte
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Error interno al generar el reporte."
      });
    }
  }
}

module.exports = new OrdenServicioController();