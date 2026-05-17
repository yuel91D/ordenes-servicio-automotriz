const ordenServicioRepository = require('../repositories/ordenServicioRepository');
// 🎯 Volvemos a importar la carpeta completa de modelos
const db = require('../models'); 

class OrdenServicioService {
  async crearOrden(datos) {
    const { vehiculo_id } = datos;

    // Extraemos el modelo Vehiculo de forma segura (probando mayúsculas/minúsculas si es necesario)
    const Vehiculo = db.Vehiculo || db.vehiculo || db.Vehiculos;

    if (!Vehiculo) {
      throw new Error('El modelo "Vehiculo" no está correctamente cargado o exportado en la carpeta de modelos.');
    }

    // 1. Buscar el vehículo en la base de datos
    const vehiculo = await Vehiculo.findByPk(vehiculo_id);
    
    if (!vehiculo) {
      throw new Error('El vehículo especificado no existe.');
    }

    // 🔍 CHISMOSO DE CONTROL: Veremos qué trae en la consola flotante
    console.log("=== DATOS DEL VEHÍCULO ENCONTRADO ===");
    console.log("ID:", vehiculo.id);
    console.log("Estado en BD:", vehiculo.estado);

    // Convertimos a minúsculas para evitar problemas de formato
    const estadoVehiculo = vehiculo.estado ? String(vehiculo.estado).toLowerCase().trim() : '';

    // 2. 🛡️ REGLA DE NEGOCIO: Validar si está inactivo
    if (estadoVehiculo === 'inactivo' || vehiculo.activo === false || vehiculo.activo === 0) {
      throw new Error('No se puede crear la orden: El vehículo se encuentra INACTIVO.');
    }

    // 3. Si pasa la validación, se crea de forma segura
    return await ordenServicioRepository.crear(datos);
  }
}

module.exports = new OrdenServicioService();