// src/services/ordenServicioService.js
const { Op } = require('sequelize');
const ordenServicioRepository = require('../repositories/ordenServicioRepository'); 
const itemOrdenRepository = require('../repositories/itemOrdenRepository');
const { Vehiculo } = require('../models'); 

class OrdenServicioService {
  constructor() {
    this.ordenServicioRepository = ordenServicioRepository;
    this.itemOrdenRepository = itemOrdenRepository;
  }

  async crear(datosOrden) {
    // 1. Destructuramos lo que viene de Postman
    const { fecha, tipo_orden, vehiculo_id } = datosOrden; 

    // 2. Validación de presencia
    if (!vehiculo_id) {
      throw new Error("Error: No se proporcionó un 'vehiculo_id' en la petición.");
    }

    // 3. Validación de existencia y estado del vehículo
    const vehiculo = await Vehiculo.findByPk(vehiculo_id);
    if (!vehiculo) {
      throw new Error(`Error: El vehículo con ID ${vehiculo_id} no está registrado.`);
    }

    const estadoVehiculo = vehiculo.estado ? String(vehiculo.estado).toLowerCase().trim() : '';
    if (estadoVehiculo === 'inactivo') {
      throw new Error(`No se puede registrar la orden: El vehículo se encuentra INACTIVO.`);
    }

    // 4. CREACIÓN - ¡Nombres exactos alineados con el Modelo!
    return await this.ordenServicioRepository.crear({
      fecha: fecha,
      tipo_orden: tipo_orden,
      vehiculo_id: vehiculo_id
    });
  }

  // ... (tus otros métodos existentes permanecen igual) ...
  async obtenerTodas() { return await this.ordenServicioRepository.obtenerTodas(); }
  
  async obtenerPorId(id) {
    const orden = await this.ordenServicioRepository.buscarPorId(id);
    if (!orden) throw new Error(`La orden con ID ${id} no existe.`);
    const items = await this.itemOrdenRepository.buscarPorOrdenId(id);
    const ordenData = typeof orden.toJSON === 'function' ? orden.toJSON() : orden;
    return { ...ordenData, items: items || [] };
  }

  async actualizar(id, datos) {
    const resultado = await this.ordenServicioRepository.actualizar(id, datos);
    if (!resultado) throw new Error("La orden no existe o no se realizaron cambios.");
    return await this.ordenServicioRepository.buscarPorId(id);
  }

  async eliminar(id) {
    const exito = await this.ordenServicioRepository.eliminar(id);
    if (!exito) throw new Error(`No se puede eliminar: La orden ${id} no existe.`);
    return { success: true, message: `Orden ${id} eliminada.` };
  }
  
  async generarReporteFechas(fechaInicio, fechaFin) {
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      const error = new Error("Fecha inicio mayor a fecha fin.");
      error.statusCode = 400; 
      throw error;
    }
    return await this.ordenServicioRepository.obtenerReporteFechas(fechaInicio, fechaFin);
  }
}

module.exports = new OrdenServicioService();