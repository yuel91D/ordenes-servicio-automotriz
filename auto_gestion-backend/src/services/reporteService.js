const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const crypto = require('crypto');
const { Exportacion } = require('../models');
const reporteRepository = require('../repositories/reporteRepository');

class ReporteService {
  async generarReporteFechas({ fecha_inicio, fecha_fin, formato, usuarioId }) {
    // 1. Obtener datos desde el repositorio
    const datos = await reporteRepository.obtenerOrdenesPorRangoFechas(fecha_inicio, fecha_fin);

    // 2. Generar ID aleatorio único de trazabilidad (10 caracteres hex)
    const exportacionId = crypto.randomBytes(5).toString('hex').toUpperCase();

    // 3. Registrar auditoría de exportación en la BD
    await Exportacion.create({
      id: exportacionId,
      usuarioId: usuarioId,
      tipoFormato: formato,
      filtrosAplicados: { fecha_inicio, fecha_fin },
      nombreArchivo: `Reporte_${fecha_inicio}_${fecha_fin}.${formato}`
    });

    // 4. Delegar generación del Buffer incluyendo el sello de auditoría
    switch (formato.toLowerCase()) {
      case 'xlsx': return await this.generarExcel(datos, 'xlsx', exportacionId);
      case 'csv': return await this.generarExcel(datos, 'csv', exportacionId);
      case 'pdf': return await this.generarPDF(datos, exportacionId);
      case 'html': return Buffer.from(this.generarHTML(datos, fecha_inicio, fecha_fin, exportacionId));
      default: throw new Error(`Formato ${formato} no soportado.`);
    }
  }

  // Método auxiliar para aplanar las órdenes e ítems
  obtenerFilasAplanadas(datos) {
    const filas = [];

    datos.forEach(orden => {
      const clienteNombre = orden.vehiculo?.cliente?.nombre || 'N/A';
      const placa = orden.vehiculo?.placa || orden.vehiculo_placa || 'N/A';
      const fecha = orden.fechaIngreso ? new Date(orden.fechaIngreso).toISOString().split('T')[0] : 'N/A';

      if (orden.items && orden.items.length > 0) {
        orden.items.forEach(item => {
          filas.push({
            id: orden.id,
            fecha: fecha,
            estado: orden.estado,
            placa: placa,
            cliente: clienteNombre,
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            valorUnitario: item.valorUnitario,
            valorTotal: item.valorTotal || (item.cantidad * item.valorUnitario)
          });
        });
      } else {
        filas.push({
          id: orden.id,
          fecha: fecha,
          estado: orden.estado,
          placa: placa,
          cliente: clienteNombre,
          descripcion: 'Sin ítems registrados',
          cantidad: 0,
          valorUnitario: 0,
          valorTotal: 0
        });
      }
    });

    return filas;
  }

  // Generador para XLSX y CSV con Sello de Auditoría
  async generarExcel(datos, tipo, exportacionId) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Reporte de Órdenes');

    // 🔒 Sello de Auditoría Superior
    sheet.addRow([`SELLO DE AUDITORÍA INMUTABLE: AUD-${exportacionId}`]);
    sheet.getRow(1).font = { italic: true, color: { argb: 'FF555555' }, size: 9 };
    sheet.addRow([]); // Fila vacía de separación

    // Encabezados de la tabla
    const headerRow = sheet.addRow([
      'ID Orden', 'Fecha Ingreso', 'Estado', 'Placa', 
      'Cliente', 'Descripción Ítem', 'Cantidad', 'Valor Unitario', 'Valor Total'
    ]);
    headerRow.font = { bold: true };

    // Configurar anchos de columna
    sheet.columns = [
      { width: 15 }, { width: 15 }, { width: 15 }, { width: 12 },
      { width: 25 }, { width: 30 }, { width: 10 }, { width: 15 }, { width: 15 }
    ];

    const filas = this.obtenerFilasAplanadas(datos);
    filas.forEach(f => {
      sheet.addRow([
        f.id, f.fecha, f.estado, f.placa, 
        f.cliente, f.descripcion, f.cantidad, f.valorUnitario, f.valorTotal
      ]);
    });

    return tipo === 'xlsx' ? await workbook.xlsx.writeBuffer() : await workbook.csv.writeBuffer();
  }

  // Generador para documentos PDF con Sello de Auditoría
  async generarPDF(datos, exportacionId) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // 🔒 Encabezado con Sello de Auditoría
        doc.fontSize(8).fillColor('gray').text(`SELLO DE AUDITORÍA: AUD-${exportacionId}`, { align: 'right' });
        doc.moveDown(0.5);

        doc.fontSize(16).fillColor('black').text('Reporte de Órdenes de Servicio', { align: 'center' });
        doc.moveDown();

        const filas = this.obtenerFilasAplanadas(datos);

        if (filas.length === 0) {
          doc.fontSize(12).text('No se encontraron registros en el rango seleccionado.');
        } else {
          filas.forEach((f, i) => {
            doc.fontSize(10).fillColor('black').text(
              `${i + 1}. [Orden #${f.id}] Fecha: ${f.fecha} | Cliente: ${f.cliente} | Placa: ${f.placa} | Estado: ${f.estado}`
            );
            doc.fontSize(9).fillColor('gray').text(
              `   - Ítem: ${f.descripcion} | Cant: ${f.cantidad} | V.Unit: $${f.valorUnitario} | Total: $${f.valorTotal}`
            );
            doc.moveDown(0.5);
          });
        }

        // 🔒 Pie de página de validez legal
        doc.moveDown();
        doc.fontSize(8).fillColor('gray').text(
          `Documento inmutable generado automáticamente. ID Trazabilidad: AUD-${exportacionId}`, 
          { align: 'center' }
        );

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  // Generador para vista HTML con Sello de Auditoría
  generarHTML(datos, fechaInicio, fechaFin, exportacionId) {
    const filas = this.obtenerFilasAplanadas(datos);

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #343a40; color: white; }
          tr:nth-child(even) { background-color: #f8f9fa; }
          h2 { font-family: Arial, sans-serif; color: #333; margin-bottom: 5px; }
          .audit-stamp { font-family: monospace; font-size: 11px; color: #6c757d; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <h2>Reporte de Órdenes de Servicio (${fechaInicio} a ${fechaFin})</h2>
        <div class="audit-stamp">🔒 SELLO DE AUDITORÍA INMUTABLE: AUD-${exportacionId}</div>
        <table>
          <thead>
            <tr>
              <th>ID Orden</th>
              <th>Fecha Ingreso</th>
              <th>Estado</th>
              <th>Placa</th>
              <th>Cliente</th>
              <th>Descripción</th>
              <th>Cant</th>
              <th>V. Unitario</th>
              <th>V. Total</th>
            </tr>
          </thead>
          <tbody>
    `;

    if (filas.length === 0) {
      html += `<tr><td colspan="9" style="text-align:center;">No hay datos para mostrar</td></tr>`;
    } else {
      filas.forEach(f => {
        html += `
          <tr>
            <td>${f.id}</td>
            <td>${f.fecha}</td>
            <td>${f.estado}</td>
            <td>${f.placa}</td>
            <td>${f.cliente}</td>
            <td>${f.descripcion}</td>
            <td>${f.cantidad}</td>
            <td>$${f.valorUnitario}</td>
            <td>$${f.valorTotal}</td>
          </tr>
        `;
      });
    }

    return html + '</tbody></table></body></html>';
  }
}

module.exports = new ReporteService();