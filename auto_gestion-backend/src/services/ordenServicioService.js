// src/services/ordenServicioService.js
const { Op } = require('sequelize');

// 📥 Importamos los repositorios que se conectan a la base de datos
const ordenServicioRepository = require('../repositories/ordenServicioRepository'); 
const itemOrdenRepository = require('../repositories/itemOrdenRepository');

// 🌟 SOLUCIÓN AL ERROR POST: Importamos 'Vehiculo' en PascalCase directo del index central
const { Vehiculo } = require('../models'); 

class OrdenServicioService {
  
  // 🌟 El constructor inicializa los repositorios para que el "this" funcione
  constructor() {
    this.ordenServicioRepository = ordenServicioRepository;
    this.itemOrdenRepository = itemOrdenRepository;
  }

  // 🚀 1. CREAR ORDEN (POST) - ¡Blindado contra el undefined!
  async crear(datosOrden) {
    const { vehiculo_id } = datosOrden; 

    if (!vehiculo_id) {
      throw new Error("Error: No se proporcionó un 'vehiculo_id' en la petición.");
    }

    // 🔍 Ahora 'Vehiculo' sí existe y resolverá la consulta perfectamente sin romperse
    const vehiculo = await Vehiculo.findByPk(vehiculo_id);

    if (!vehiculo) {
      throw new Error(`Error: El vehículo con ID ${vehiculo_id} no está registrado en el sistema.`);
    }

    // 🛡️ VALIDACIÓN: Frenar si está inactivo
    const estadoVehiculo = vehiculo.estado ? String(vehiculo.estado).toLowerCase().trim() : '';
    if (estadoVehiculo === 'inactivo') {
      throw new Error(`No se puede registrar la orden: El vehículo se encuentra INACTIVO en el sistema.`);
    }

    // 🏎️ CAMINO FELIZ: Delega la creación a tu repositorio estructurado
    return await this.ordenServicioRepository.crear({
      fecha: datosOrden.fecha,
      tipoOrden: datosOrden.tipoOrden,
      vehiculoId: vehiculo_id
    });
  }
  
  // 📋 2. OBTENER TODAS LAS ÓRDENES (GET) - ¡Ya verificado con un 200 OK!
  async obtenerTodas() {
    return await this.ordenServicioRepository.obtenerTodas(); 
  }

  // 🔍 3. OBTENER ORDEN DETALLADA POR ID (GET :id)
  async obtenerPorId(id) {
    try {
      const orden = await this.ordenServicioRepository.buscarPorId(id);
      
      if (!orden) {
        throw new Error(`La orden de servicio con ID ${id} no existe.`);
      }

      const items = await this.itemOrdenRepository.buscarPorOrdenId(id);
      const ordenData = typeof orden.toJSON === 'function' ? orden.toJSON() : orden;

      return {
        ...ordenData,
        items: items || [] 
      };
    } catch (error) {
      throw error; 
    }
  }

  // 🔄 4. ACTUALIZAR ORDEN (PUT) - ¡NUEVO!
  async actualizar(id, datosActualizados) {
    // 🔍 Opcional: Si el PUT incluye cambio de vehículo, se podría re-validar aquí.
    const ordenActualizada = await this.ordenServicioRepository.actualizar(id, datosActualizados);
    
    if (!ordenActualizada) {
      throw new Error(`No se puede actualizar: La orden con ID ${id} no existe en el sistema.`);
    }
    
    return ordenActualizada;
  }

  // 🗑️ 5. ELIMINAR ORDEN (DELETE) - ¡NUEVO!
  async eliminar(id) {
    const exito = await this.ordenServicioRepository.eliminar(id);
    
    if (!exito) {
      throw new Error(`No se puede eliminar: La orden con ID ${id} no existe en el sistema.`);
    }
    
    return { success: true, message: `La orden ${id} y sus ítems fueron eliminados correctamente.` };
  }
  
  // 📊 6. REPORTE POR RANGO DE FECHAS
  async generarReporteFechas(fechaInicio, fechaFin) {
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      const errorFecha = new Error("Error en el reporte: La fecha de inicio no puede ser mayor que la fecha de fin.");
      errorFecha.statusCode = 400; 
      throw errorFecha;
    }

    return await this.ordenServicioRepository.obtenerReporteFechas(fechaInicio, fechaFin);
  }
}

// 🚀 Exportamos la instancia única
module.exports = new OrdenServicioService();