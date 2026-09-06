const Joi = require('joi');

// 👥 Molde para Clientes
const clienteEsquema = Joi.object({
  nombre: Joi.string().min(3).max(100).required(),
  telefono: Joi.string().allow(null, ''),
  email: Joi.string().email().allow(null, '')
});
const clienteUpdateEsquema = clienteEsquema.fork(['nombre', 'telefono', 'email'], (schema) => schema.optional());

// 🚗 Molde para Vehículos
const vehiculoEsquema = Joi.object({
  vehiculos_id: Joi.number().required(),
  placa: Joi.string().required(),
  tipoVehiculo: Joi.string().required(),
  kilometraje: Joi.number().optional(),
  estado: Joi.string().optional(),
  propietario: Joi.string().optional(),
  cliente_id: Joi.number().optional().allow(null, ''),
  marca: Joi.string().required(),
  modelo: Joi.string().required(),
  anio: Joi.number().required(),
  telefono: Joi.string().optional(),
  email: Joi.string().email().optional()
});
const vehiculoUpdateEsquema = vehiculoEsquema.fork(['placa', 'tipoVehiculo', 'cliente_id'], (schema) => schema.optional());

// 🛠️ Molde para Ítems
const itemOrdenEsquema = Joi.object({
  orden_servicio_id: Joi.number().integer().required(),
  descripcion: Joi.string().required(),
  cantidad: Joi.number().integer().min(1).required(),
  precio_unitario: Joi.number().precision(2).required()
});

// 📝 Molde para Órdenes de Servicio
const ordenServicioEsquema = Joi.object({
  fecha: Joi.date().iso().required(),
  tipo_orden: Joi.string().required(), // Nombre correcto: tipo_orden
  vehiculo_id: Joi.number().integer().required()
});

// CORRECCIÓN: Se cambió 'tipoOrden' por 'tipo_orden' en el fork para mantener consistencia
const ordenServicioUpdateEsquema = ordenServicioEsquema.fork(['fecha', 'tipo_orden', 'vehiculo_id'], (schema) => schema.optional());

module.exports = {
  clienteEsquema,
  clienteUpdateEsquema,
  vehiculoEsquema,
  vehiculoUpdateEsquema,
  ordenServicioEsquema,
  ordenServicioUpdateEsquema,
  itemOrdenEsquema
};