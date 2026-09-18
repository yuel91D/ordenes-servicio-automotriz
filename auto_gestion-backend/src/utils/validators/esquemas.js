const Joi = require('joi');

// 👥 Molde para Clientes
const clienteEsquema = Joi.object({
  nombre: Joi.string().min(3).max(100).required(),
  telefono: Joi.string().allow(null, ''),
  email: Joi.string().email().allow(null, '')
});
const clienteUpdateEsquema = clienteEsquema.fork(['nombre', 'telefono', 'email'], (schema) => schema.optional());

// 🚗 Molde para Vehículos (Con tu mejora y flexibilidad intacta)
const vehiculoEsquema = Joi.object({
  vehiculos_id: Joi.number().optional().allow(null, ''), // Opcional por si el hook lo genera
  placa: Joi.string().required(),
  tipoVehiculo: Joi.string().required(),
  kilometraje: Joi.number().optional().allow(null, ''),
  estado: Joi.string().optional().allow(null, ''),
  propietario: Joi.string().optional().allow(null, ''),
  cliente_id: Joi.number().optional().allow(null, ''),
  marca: Joi.string().required(),
  modelo: Joi.string().required(),
  anio: Joi.number().required(),
  telefono: Joi.string().optional().allow(null, ''),
  email: Joi.string().email().optional().allow(null, '')
});
const vehiculoUpdateEsquema = vehiculoEsquema.fork(['placa', 'tipoVehiculo', 'cliente_id', 'marca', 'modelo', 'anio'], (schema) => schema.optional());

// 📋 Molde para Órdenes de Servicio (Con soporte para creación en cascada y nuevos campos)
const ordenServicioEsquema = Joi.object({
  fecha_ingreso: Joi.date().required(),
  fecha_salida: Joi.date().optional().allow(null, ''),
  tipo_orden: Joi.string().required(),
  vehiculo_id: Joi.number().optional().allow(null, ''),
  placa: Joi.string().optional(),
  marca: Joi.string().optional(),
  modelo: Joi.string().optional(),
  anio: Joi.number().optional(),
  tipoVehiculo: Joi.string().optional(),
  kilometraje: Joi.number().optional(),
  estadoVehiculo: Joi.string().optional(),
  propietario: Joi.string().optional(),
  telefono: Joi.string().optional(),
  email: Joi.string().email().optional().allow(null, ''),
  tipo_pago: Joi.string().valid('Efectivo', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Transferencia', 'Pendiente').optional(),
  estado: Joi.string().valid('Recibido', 'En proceso', 'Finalizado', 'Entregado', 'Cancelado').optional(),
  
  // Soporte para recibir y validar ítems en cascada
  items: Joi.array().items(
    Joi.object({
      descripcion: Joi.string().required(),
      cantidad: Joi.number().integer().min(1).required(),
      valor_unitario: Joi.number().min(0).required()
    })
  ).optional()
});

const ordenServicioUpdateEsquema = Joi.object({
  fecha_ingreso: Joi.date().optional(),
  fecha_salida: Joi.date().optional().allow(null, ''),
  tipo_orden: Joi.string().optional(),
  vehiculo_id: Joi.number().optional(),
  tipo_pago: Joi.string().valid('Efectivo', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Transferencia', 'Pendiente').optional(),
  estado: Joi.string().valid('Recibido', 'En proceso', 'Finalizado', 'Entregado', 'Cancelado').optional(),
  
  items: Joi.array().items(
    Joi.object({
      item_orden_id: Joi.number().optional(),
      descripcion: Joi.string().required(),
      cantidad: Joi.number().integer().min(1).required(),
      valor_unitario: Joi.number().min(0).required()
    })
  ).optional()
});

// 🛠️ Molde para Ítems (Por si se manejan de forma independiente)
const itemOrdenEsquema = Joi.object({
  descripcion: Joi.string().required(),
  cantidad: Joi.number().integer().min(1).required(),
  valor_unitario: Joi.number().min(0).required(),
  orden_servicio_id: Joi.number().integer().optional()
});

// 📦 Exportación completa de todos los esquemas para que ninguna ruta falle
module.exports = {
  clienteEsquema,
  clienteUpdateEsquema,
  vehiculoEsquema,
  vehiculoUpdateEsquema,
  ordenServicioEsquema,
  ordenServicioUpdateEsquema,
  itemOrdenEsquema
};