const reporteService = require('../services/reporteService');
const { Exportacion } = require('../models');

class ReporteController {
  // 1. Generar y descargar reporte
  async obtenerReportePorFechas(req, res) {
    try {
      const { fecha_inicio, fecha_fin, formato } = req.query;
      const usuarioId = req.user?.id || 1; // Ajusta según tu lógica de autenticación

      if (!fecha_inicio || !fecha_fin || !formato) {
        return res.status(400).json({ success: false, message: "Parámetros incompletos." });
      }

      const buffer = await reporteService.generarReporteFechas({
        fecha_inicio,
        fecha_fin,
        formato: formato.toLowerCase(),
        usuarioId
      });

      const contentTypes = {
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        csv: 'text/csv',
        pdf: 'application/pdf',
        html: 'text/html'
      };

      const contentType = contentTypes[formato.toLowerCase()] || 'application/octet-stream';
      const fileName = `Reporte_${fecha_inicio}_${fecha_fin}.${formato.toLowerCase()}`;

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      
      return res.send(buffer);
    } catch (error) {
      console.error("Error en obtenerReportePorFechas:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // 2. Listar historial de exportaciones
async listarHistorial(req, res) {
    try {
      const historial = await Exportacion.findAll({
        order: [['fechaGeneracion', 'DESC']] // Ordenar por la fecha real de creación
      });
      return res.status(200).json({ success: true, data: historial });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al recuperar historial." });
    }
  }

  // 3. Eliminar registro del historial
  async eliminarRegistro(req, res) {
    try {
      const { id } = req.params;
      
      // Validación simple de formato (debe ser el ID que generamos de 10 caracteres)
      if (!id || id.length !== 10) {
        return res.status(400).json({ success: false, message: "ID con formato inválido." });
      }

      const eliminado = await Exportacion.destroy({ where: { id } });

      if (!eliminado) {
        return res.status(404).json({ success: false, message: "Registro no encontrado." });
      }

      return res.status(200).json({ success: true, message: "Registro eliminado correctamente." });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error al procesar la eliminación." });
    }
  }
}

module.exports = new ReporteController();