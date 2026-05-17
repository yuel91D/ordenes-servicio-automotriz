const reporteRepository = require('../repositories/reporteRepository');

class ReporteService {
  async generarReporteFechas(fechaInicio, fechaFin) {
    // Validación de seguridad para las fechas
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      throw new Error('La fecha de inicio no puede ser mayor que la fecha de fin.');
    }
    return await reporteRepository.obtenerOrdenesPorRangoFechas(fechaInicio, fechaFin);
  }
}

module.exports = new ReporteService();