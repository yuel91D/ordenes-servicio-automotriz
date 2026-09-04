const ordenServicioService = require('../services/ordenServicioService');

class OrdenServicioController {
  // 1. Crear una nueva orden 
  async crear(req, res, next) {
    try {
      const nuevaOrden = await ordenServicioService.crear(req.body);
      return res.status(201).json({
        success: true,
        data: nuevaOrden
      });
    } catch (error) {
      next(error); // 🚀 Al middleware global
    }
  }

  // 2. Listar todas las órdenes
  async listar(req, res, next) {
    try {
      const ordenes = await ordenServicioService.obtenerTodas();
      return res.status(200).json({ success: true, data: ordenes });
    } catch (error) {
      next(error);
    }
  }

  // 3. Buscar orden específica por ID
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const orden = await ordenServicioService.obtenerPorId(id);
      return res.status(200).json({ success: true, data: orden });
    } catch (error) {
      // Si el mensaje dice que no existe, le inyectamos un 404 antes de pasarlo al middleware
      if (error.message.includes('no existe')) {
        error.statusCode = 404;
      } else {
        error.statusCode = 400;
      }
      next(error);
    }
  }

  // 4. Actualizar Orden (Estructura base)
  async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const datos = req.body;
      
      // Llamamos al servicio para que ejecute el UPDATE real
      const ordenActualizada = await ordenServicioService.actualizar(id, datos);
      
      return res.status(200).json({ 
        success: true, 
        message: "Actualizado con éxito",
        data: ordenActualizada 
      });
    } catch (error) {
      next(error);
    }
  }

// 5. Eliminar Orden Real
  async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      
      // Llamamos al servicio para que ejecute el DELETE real en la base de datos
      await ordenServicioService.eliminar(id);
      
      return res.status(200).json({ 
        success: true, 
        message: "Eliminado con éxito" 
      });
    } catch (error) {
      // Si el servicio lanza un error porque el ID no existe, lo atrapamos y le damos estatus 404
      if (error.message.includes('no existe')) {
        error.statusCode = 404;
      } else {
        error.statusCode = 400;
      }
      next(error);
    }
  }

  // 6. Reporte por Fechas 🛡️
  async obtenerReportePorFechas(req, res, next) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;

      // Validación rápida de parámetros de consulta
      if (!fecha_inicio || !fecha_fin) {
        const errorParams = new Error("Faltan parámetros requeridos: 'fecha_inicio' y 'fecha_fin' son obligatorios (Formato: YYYY-MM-DD).");
        errorParams.statusCode = 400;
        return next(errorParams);
      }

      const reporte = await ordenServicioService.generarReporteFechas(fecha_inicio, fecha_fin);

      return res.status(200).json({
        success: true,
        data: reporte
      });
    } catch (error) {
      next(error); // Atrapa el statusCode 400 de fechas al revés inyectado en el servicio
    }
  }
}

module.exports = new OrdenServicioController();