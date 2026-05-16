const vehiculoService = require('../services/vehiculoService');

class VehiculoController {
  // Aseguramos el nombre 'crear'
  async crear(req, res) {
    try {
      const vehiculo = await vehiculoService.crearVehiculo(req.body);
      res.status(201).json({
        success: true,
        data: vehiculo
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Aseguramos el nombre 'listar'
  async listar(req, res) {
    try {
      const vehiculos = await vehiculoService.listarVehiculos();
      res.json({
        success: true,
        data: vehiculos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Aseguramos el nombre 'obtener'
  async obtener(req, res) {
    try {
      const vehiculo = await vehiculoService.obtenerVehiculo(req.params.id);
      res.json({
        success: true,
        data: vehiculo
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Aseguramos el nombre 'actualizar'
  async actualizar(req, res) {
    try {
      const vehiculo = await vehiculoService.actualizarVehiculo(req.params.id, req.body);
      res.json({
        success: true,
        data: vehiculo
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Aseguramos el nombre 'eliminar'
  async eliminar(req, res) {
    try {
      await vehiculoService.eliminarVehiculo(req.params.id);
      res.json({
        success: true,
        message: 'Vehículo eliminado'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

// Crucial: Exportar una instancia con 'new' para que los métodos existan
module.exports = new VehiculoController();