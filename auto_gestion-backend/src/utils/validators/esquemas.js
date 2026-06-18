const Joi = require('joi');

// 👥 Molde para Clientes (Creación - POST)
const clienteEsquema = Joi.object({
  nombre: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'El nombre no puede estar vacío',
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'any.required': 'El nombre es un campo obligatorio'
  }),
  telefono: Joi.string().allow(null, ''),
  email: Joi.string().email().allow(null, '').messages({
    'string.email': 'El formato del correo electrónico no es válido'
  })
});

// 🔄 Molde dinámico para Actualizaciones de Clientes (PUT)
const clienteUpdateEsquema = clienteEsquema.fork(['nombre', 'telefono', 'email'], (schema) => schema.optional());

// 🚗 Molde para Vehículos
const vehiculoEsquema = Joi.object({
  placa: Joi.string().uppercase().min(6).max(10).required().messages({
    'string.empty': 'La placa no puede estar vacía',
    'any.required': 'La placa es obligatoria'
  }),
  tipoVehiculo: Joi.string().required().messages({
    'string.empty': 'El tipo de vehículo es obligatorio'
  }),
  kilometraje: Joi.number().integer().min(0).allow(null, ''),
  estado: Joi.string().valid('activo', 'inactivo').default('activo'),
  propietario: Joi.string().allow(null, ''),
  cliente_id: Joi.number().integer().required().messages({
    'number.base': 'El cliente_id debe ser un número válido',
    'any.required': 'El vehículo debe estar amarrado a un cliente_id'
  })
});

const vehiculoUpdateEsquema = Joi.object({
  placa: Joi.string().uppercase().min(6).max(10).optional(),
  tipoVehiculo: Joi.string().optional(),
  kilometraje: Joi.number().integer().min(0).allow(null, ''),
  estado: Joi.string().valid('activo', 'inactivo').optional(),
  propietario: Joi.string().allow(null, ''),
  cliente_id: Joi.number().integer().optional()
});

// 📝 Molde para Órdenes de Servicio (Alineado con la DB)
const ordenServicioEsquema = Joi.object({
  fecha: Joi.date().iso().required().messages({
    'date.format': 'La fecha debe tener un formato ISO válido (AAAA-MM-DD)'
  }),
  tipoOrden: Joi.string().required().messages({
    'string.empty': 'El tipo de orden es obligatorio'
  }),
  vehiculo_id: Joi.number().integer().required().messages({
    'any.required': 'La orden debe tener un vehiculo_id válido'
  })
}).unknown(true);

// 🛠️ Molde para Ítems de Orden (¡Recuperado!)
const itemOrdenEsquema = Joi.object({
  orden_servicio_id: Joi.number().integer().required(),
  descripcion: Joi.string().required(),
  cantidad: Joi.number().integer().min(1).required(),
  precio_unitario: Joi.number().precision(2).required()
});

// 🚀 Exportación limpia, completa y sin conflictos
module.exports = {
  clienteEsquema,
  clienteUpdateEsquema,
  vehiculoEsquema,
  vehiculoUpdateEsquema, // 👈 ¡FALTABA ESTA LÍNEA DE EXPORTACIÓN!
  ordenServicioEsquema,
  itemOrdenEsquema
};