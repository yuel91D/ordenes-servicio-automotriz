const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const clienteRoutes = require('./routes/clienteRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const ordenServicioRoutes = require('./routes/ordenServicioRoutes');
const itemOrdenRoutes = require('./routes/itemOrdenRoutes');
const reporteRoutes = require('./routes/reporteRoutes');

const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// ─── CONFIGURACIÓN DE SWAGGER COMPLETA (JSON PURO) ───
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Órdenes de Servicio Automotriz',
      version: '1.0.0',
      description: 'Documentación interactiva de la API para el taller mecánico',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
    paths: {
      // 1. 👥 ENDPOINTS DE CLIENTES
      '/clientes': {
        get: {
          summary: 'Obtener todos los clientes',
          description: 'Retorna una lista con todos los clientes registrados.',
          responses: { 200: { description: 'Lista de clientes obtenida con éxito.' } }
        },
        post: {
          summary: 'Crear un nuevo cliente',
          description: 'Registra un cliente pasando por el escudo de Joi.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nombre'],
                  properties: {
                    nombre: { type: 'string', example: 'Tony Stark' },
                    telefono: { type: 'string', example: '555-1234' },
                    email: { type: 'string', example: 'tony@starkindustries.com' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Cliente creado exitosamente.' },
            400: { description: 'Error de validación.' }
          }
        }
      },
      // 2. 🚗 ENDPOINTS DE VEHÍCULOS
      '/vehiculos': {
        get: {
          summary: 'Obtener todos los vehículos',
          description: 'Retorna los vehículos registrados con sus dueños vinculados.',
          responses: { 200: { description: 'Lista de vehículos obtenida con éxito.' } }
        },
        post: {
          summary: 'Registrar un nuevo vehículo',
          description: 'Añade un auto al sistema validando sus datos con Joi.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['placa', 'marca', 'modelo', 'cliente_id'],
                  properties: {
                    placa: { type: 'string', example: 'MCU-3000' },
                    marca: { type: 'string', example: 'Audi' },
                    modelo: { type: 'string', example: 'R8 e-tron' },
                    cliente_id: { type: 'integer', example: 1 }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Vehículo registrado con éxito.' },
            400: { description: 'Error en los datos enviados.' }
          }
        }
      },
      // 3. 📝 ENDPOINTS DE ÓRDENES DE SERVICIO
      '/ordenes': {
        get: {
          summary: 'Listar órdenes de servicio',
          description: 'Obtiene el historial de órdenes de mantenimiento ingresadas al taller.',
          responses: { 200: { description: 'Órdenes recuperadas con éxito.' } }
        },
        post: {
          summary: 'Crear orden de servicio',
          description: 'Genera una nueva hoja de servicio para un vehículo.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['fecha', 'tipoOrden', 'vehiculoId'],
                  properties: {
                    fecha: { type: 'string', example: '2026-05-16' },
                    tipoOrden: { type: 'string', example: 'Correctivo' },
                    vehiculoId: { type: 'integer', example: 1 }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Orden de servicio abierta con éxito.' },
            400: { description: 'Validación Joi fallida.' }
          }
        }
      },
      // 4. 🔧 ENDPOINTS DE ÍTEMS DE ORDEN
      '/items': {
        get: {
          summary: 'Ver ítems de las órdenes',
          description: 'Muestra los repuestos o mano de obra asignados a las órdenes.',
          responses: { 200: { description: 'Ítems listados con éxito.' } }
        },
        post: {
          summary: 'Agregar ítem a una orden',
          description: 'Inserta un trabajo o repuesto específico dentro de una orden de servicio.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['descripcion', 'cantidad', 'valorUnitario', 'orden_servicio_id'],
                  properties: {
                    descripcion: { type: 'string', example: 'Cambio de pastillas de frenos' },
                    cantidad: { type: 'integer', example: 2 },
                    valorUnitario: { type: 'number', example: 45000.00 },
                    orden_servicio_id: { type: 'integer', example: 100001 }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Ítem cargado a la orden exitosamente.' },
            400: { description: 'Error en campos obligatorios.' }
          }
        }
      }
    }
  },
  apis: [], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas de la aplicación
app.use('/clientes', clienteRoutes);
app.use('/vehiculos', vehiculoRoutes);
app.use('/ordenes', ordenServicioRoutes);
app.use('/items', itemOrdenRoutes);
app.use('/reporte', reporteRoutes);

// 🌟 PASO 2: LA RED DE SEGURIDAD GLOBAL (Siempre debe ir al final de todo)
app.use(errorMiddleware);

module.exports = app;