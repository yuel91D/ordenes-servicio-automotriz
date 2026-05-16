const Joi = require('joi');

// 👥 Molde para Clientes
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

// 🚗 Molde para Vehículos
const vehiculoEsquema = Joi.object({
  placa: Joi.string().uppercase().min(6).max(10).required().messages({
    'string.empty': 'La placa no puede estar vacía',
    'any.required': 'La placa es obligatoria'
  }),
  estado: Joi.string().valid('activo', 'inactivo').default('activo'),
  cliente_id: Joi.number().integer().required().messages({
    'number.base': 'El cliente_id debe ser un número válido',
    'any.required': 'El vehículo debe estar amarrado a un cliente_id'
  })
});

// 📝 Molde para Órdenes de Servicio
const ordenServicioEsquema = Joi.object({
  fecha: Joi.date().iso().required().messages({
    'date.format': 'La fecha debe tener un formato ISO válido (AAAA-MM-DD)'
  }),
  tipoOrden: Joi.string().valid('Preventivo', 'Correctivo').required().messages({
    'any.only': 'El tipo de orden debe ser Preventivo o Correctivo'
  }),
  vehiculo_id: Joi.number().integer().required()
});

// 🔧 Molde para Ítems de Orden
const itemOrdenEsquema = Joi.object({
  descripcion: Joi.string().min(3).required().messages({
    'string.empty': 'La descripción del ítem es obligatoria'
  }),
  cantidad: Joi.number().integer().min(1).default(1),
  valorUnitario: Joi.number().positive().required().messages({
    'number.positive': 'El valor unitario debe ser un número mayor a 0'
  }),
  orden_servicio_id: Joi.number().integer().required()
});

module.exports = {
  clienteEsquema,
  vehiculoEsquema,
  ordenServicioEsquema,
  itemOrdenEsquema
};