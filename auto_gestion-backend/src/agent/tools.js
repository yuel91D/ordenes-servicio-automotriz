const agentToolsDeclaration = [
  {
    name: 'buscarCliente',
    description: 'Busca un cliente en la base de datos por su nombre, correo electrónico o número de documento/cédula.',
    parameters: {
      type: 'OBJECT',
      properties: {
        criterio: {
          type: 'STRING',
          description: 'Nombre, correo o cédula del cliente a buscar.'
        }
      },
      required: ['criterio']
    }
  },
  {
    name: 'listarVehiculosCliente',
    description: 'Obtiene la lista de vehículos registrados pertenecientes a un cliente específico.',
    parameters: {
      type: 'OBJECT',
      properties: {
        clienteId: {
          type: 'INTEGER',
          description: 'ID único del cliente.'
        }
      },
      required: ['clienteId']
    }
  },
  {
    name: 'crearOrdenServicio',
    description: 'Registra una nueva orden de servicio técnico para un vehículo con su diagnóstico o requerimientos preliminares.',
    parameters: {
      type: 'OBJECT',
      properties: {
        clienteId: {
          type: 'INTEGER',
          description: 'ID único del cliente propietario.'
        },
        vehiculoId: {
          type: 'INTEGER',
          description: 'ID único del vehículo a reparar/revisar.'
        },
        fallaReportada: {
          type: 'STRING',
          description: 'Descripción detallada de la falla reportada por el cliente o síntoma observado.'
        },
        prioridad: {
          type: 'STRING',
          enum: ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'],
          description: 'Nivel de prioridad de la atención.'
        }
      },
      required: ['clienteId', 'vehiculoId', 'fallaReportada']
    }
  },
  {
    name: 'obtenerEstadoOrden',
    description: 'Consulta el detalle, historial y estado actual de una orden de servicio mediante su número u ID de orden.',
    parameters: {
      type: 'OBJECT',
      properties: {
        ordenId: {
          type: 'INTEGER',
          description: 'ID o número de la orden de servicio.'
        }
      },
      required: ['ordenId']
    }
  }
];

const toolExecutors = {
  async buscarCliente({ criterio }) {
    if (criterio.toLowerCase().includes('fury') || criterio.includes('1')) {
      return {
        encontrado: true,
        cliente: { id: 1, nombre: 'Nick Fury', email: 'fury@shield.com', telefono: '+15550192' }
      };
    }
    return { encontrado: false, mensaje: `No se encontró ningún cliente con el criterio: ${criterio}` };
  },

  async listarVehiculosCliente({ clienteId }) {
    if (clienteId === 1) {
      return {
        vehiculos: [
          { id: 10, placa: 'SHD-901', marca: 'Chevrolet', modelo: 'Tahoe', anio: 2022 },
          { id: 11, placa: 'AVN-001', marca: 'Audi', modelo: 'R8', anio: 2024 }
        ]
      };
    }
    return { vehiculos: [] };
  },

  async crearOrdenServicio({ clienteId, vehiculoId, fallaReportada, prioridad = 'MEDIA' }) {
    const nuevaOrden = {
      id: Math.floor(1000 + Math.random() * 9000),
      clienteId,
      vehiculoId,
      fallaReportada,
      prioridad,
      estado: 'PENDIENTE_DIAGNOSTICO',
      fechaIngreso: new Date().toISOString()
    };

    return {
      exito: true,
      mensaje: 'Orden de servicio creada satisfactoriamente.',
      orden: nuevaOrden
    };
  },

  async obtenerEstadoOrden({ ordenId }) {
    return {
      ordenId,
      estado: 'EN_PROCESO',
      tecnicoAsignado: 'Carlos Rodríguez',
      fallaReportada: 'Ruido en transmisión y vibración al frenar',
      serviciosRealizados: ['Inspección de pastillas de freno', 'Escaneo computarizado'],
      estimadoEntrega: '2026-09-23T17:00:00Z'
    };
  }
};

module.exports = {
  agentToolsDeclaration,
  toolExecutors
};