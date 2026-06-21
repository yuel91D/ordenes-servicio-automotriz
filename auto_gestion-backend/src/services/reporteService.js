const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const crypto = require('crypto'); // Importamos crypto para generar el ID aleatorio
const { Exportacion } = require('../models');
const reporteRepository = require('../repositories/reporteRepository');

class ReporteService {
  async generarReporteFechas({ fecha_inicio, fecha_fin, formato, usuarioId }) {
    const datos = await reporteRepository.obtenerOrdenesPorRangoFechas(fecha_inicio, fecha_fin);

    // Generador de ID aleatorio de 10 caracteres alfanuméricos
    const generarIdAleatorio = () => {
      return crypto.randomBytes(5).toString('hex').toUpperCase();
    };

    // Registro de auditoría con ID personalizado
    await Exportacion.create({
      id: generarIdAleatorio(), 
      usuarioId: usuarioId,
      tipoFormato: formato,
      filtrosAplicados: { fecha_inicio, fecha_fin },
      nombreArchivo: `Reporte_${Date.now()}.${formato}`
    });

    // Delegamos según el formato solicitado
    switch (formato) {
      case 'xlsx': return await this.generarExcel(datos, 'xlsx');
      case 'csv': return await this.generarExcel(datos, 'csv');
      case 'pdf': return await this.generarPDF(datos);
      case 'html': return Buffer.from(this.generarHTML(datos));
      default: throw new Error('Formato no soportado');
    }
  }

  // ... (tus métodos generarExcel, generarPDF y generarHTML permanecen igual)
  async generarExcel(datos, tipo) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Reporte');
    sheet.columns = [{ header: 'ID', key: 'id' }, { header: 'Cliente', key: 'cliente' }];
    datos.forEach(d => sheet.addRow({ id: d.id, cliente: d.vehiculo?.cliente?.nombre }));
    return tipo === 'xlsx' ? await workbook.xlsx.writeBuffer() : await workbook.csv.writeBuffer();
  }

  async generarPDF(datos) {
    return new Promise((resolve) => {
      const doc = new PDFDocument();
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.fontSize(16).text('Reporte de Órdenes');
      datos.forEach(d => doc.fontSize(10).text(`Orden: ${d.id} - Cliente: ${d.vehiculo?.cliente?.nombre || 'N/A'}`));
      doc.end();
    });
  }

  generarHTML(datos) {
    let html = '<table><tr><th>ID</th><th>Cliente</th></tr>';
    datos.forEach(d => html += `<tr><td>${d.id}</td><td>${d.vehiculo?.cliente?.nombre || 'N/A'}</td></tr>`);
    return html + '</table>';
  }
}

module.exports = new ReporteService();