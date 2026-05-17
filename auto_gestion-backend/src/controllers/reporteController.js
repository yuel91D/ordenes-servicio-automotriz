const reporteService = require('../services/reporteService');

class ReporteController {
  async obtenerReportePorFechas(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;

      if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({
          success: false,
          message: "Faltan parámetros requeridos: 'fecha_inicio' y 'fecha_fin'."
        });
      }

      const reportes = await reporteService.generarReporteFechas(fecha_inicio, fecha_fin);
      
      return res.status(200).json({
        success: true,
        data: reportes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ReporteController();