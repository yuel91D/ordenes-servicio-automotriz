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
  placa: Joi.string().uppercase().min(6).max(10).required(),
  tipoVehiculo: Joi.string().required(),
  marca: Joi.string().required(),
  modelo: Joi.string().required(),
  anio: Joi.number().integer().min(1900).max(2100).required(),
  kilometraje: Joi.number().integer().min(0).allow(null, ''),
  estado: Joi.string().valid('activo', 'inactivo').default('activo'),
  propietario: Joi.string().allow(null, ''),
  cliente_id: Joi.number().integer().required()
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