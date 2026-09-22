const swaggerJsdoc = require('swagger-jsdoc');

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
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido en /auth/login',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
    paths: {
      // 🤖 AGENTE IA
      '/agente/atender': {
        post: {
          summary: 'Atender consulta con el Agente de IA',
          tags: ['Agente IA'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['prompt'],
                  properties: {
                    prompt: {
                      type: 'string',
                      example: 'Hola, necesito crear una orden de servicio para el cliente Nick Fury pero no sé sus datos ni el vehículo.',
                    },
                    historial: {
                      type: 'array',
                      items: { type: 'object' },
                      example: [],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Respuesta generada por el agente de IA',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          respuesta: { type: 'string', example: '¡Hola! He localizado al cliente en el sistema...' },
                          accionesRealizadas: {
                            type: 'array',
                            items: { type: 'object' },
                            example: [
                              {
                                herramienta: 'buscarCliente',
                                parametros: { criterio: 'Nick Fury' },
                                resultado: { encontrado: true, cliente: { id: 1, nombre: 'Nick Fury' } },
                              },
                            ],
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: 'Error al procesar la solicitud con el Agente de IA',
            },
          },
        },
      },

      // 🔑 TOKENS
      '/tokens/validar': {
        post: {
          summary: 'Validar token',
          tags: ['Tokens'],
          responses: { 200: { description: 'Token válido' }, 401: { description: 'Token inválido' } },
        },
      },
      '/tokens': {
        get: {
          summary: 'Token',
          tags: ['Tokens'],
          responses: { 200: { description: 'Información del token' } },
        },
      },

      // 🔐 AUTH (Ajustado a /auth/login)
      '/auth/login': {
        post: {
          summary: 'Auth',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'fury@shield.com' },
                    password: { type: 'string', example: 'admin123' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Autenticación exitosa' } },
        },
      },

      // 🛡️ ROLES
      '/roles': {
        get: {
          summary: 'Listar Roles',
          tags: ['Roles'],
          responses: { 200: { description: 'Lista de roles' } },
        },
        post: {
          summary: 'Crear Rol',
          tags: ['Roles'],
          responses: { 201: { description: 'Rol creado' } },
        },
      },
      '/roles/{id}': {
        put: {
          summary: 'Actualizar rol',
          tags: ['Roles'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Rol actualizado' } },
        },
        delete: {
          summary: 'Eliminar rol',
          tags: ['Roles'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Rol eliminado' } },
        },
      },

      // 👤 USUARIOS
      '/usuarios': {
        get: {
          summary: 'Listar Usuarios',
          tags: ['Usuarios'],
          responses: { 200: { description: 'Lista de usuarios' } },
        },
        post: {
          summary: 'Crear usuario',
          tags: ['Usuarios'],
          responses: { 201: { description: 'Usuario creado' } },
        },
      },
      '/usuarios/{id}': {
        put: {
          summary: 'Actualizar usuario',
          tags: ['Usuarios'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Usuario actualizado' } },
        },
        delete: {
          summary: 'Eliminar usuario',
          tags: ['Usuarios'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Usuario eliminado' } },
        },
      },

      // 👔 EMPLEADOS
      '/empleados': {
        get: {
          summary: 'Listar empleados',
          tags: ['Empleados'],
          responses: { 200: { description: 'Lista de empleados' } },
        },
        post: {
          summary: 'Crear empleado',
          tags: ['Empleados'],
          responses: { 201: { description: 'Empleado creado' } },
        },
      },
      '/empleados/{id}': {
        put: {
          summary: 'Actualizar empleado',
          tags: ['Empleados'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Empleado actualizado' } },
        },
        delete: {
          summary: 'Eliminar empleados',
          tags: ['Empleados'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Empleado eliminado' } },
        },
      },

      // 👥 CLIENTES
      '/clientes': {
        get: {
          summary: 'Listar Clientes',
          tags: ['Clientes'],
          responses: { 200: { description: 'Lista de clientes' } },
        },
        post: {
          summary: 'Crear Cliente',
          tags: ['Clientes'],
          responses: { 201: { description: 'Cliente creado' } },
        },
      },
      '/clientes/{id}': {
        put: {
          summary: 'Actualizar cliente',
          tags: ['Clientes'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Cliente actualizado' } },
        },
        delete: {
          summary: 'Eliminar clientes',
          tags: ['Clientes'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Cliente eliminado' } },
        },
      },

      // 🚗 VEHÍCULOS
      '/vehiculos': {
        get: {
          summary: 'Listar vehiculo',
          tags: ['Vehículos'],
          responses: { 200: { description: 'Lista de vehículos' } },
        },
        post: {
          summary: 'Crear vehiculo',
          tags: ['Vehículos'],
          responses: { 201: { description: 'Vehículo registrado' } },
        },
      },
      '/vehiculos/{id}': {
        put: {
          summary: 'Actualizar vehiculo',
          tags: ['Vehículos'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Vehículo actualizado' } },
        },
        delete: {
          summary: 'Eliminar vehiculo',
          tags: ['Vehículos'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Vehículo eliminado' } },
        },
      },

      // 📝 ORDEN DE SERVICIO
      '/ordenes': {
        get: {
          summary: 'Listar servicio',
          tags: ['Orden de Servicio'],
          responses: { 200: { description: 'Lista de órdenes de servicio' } },
        },
        post: {
          summary: 'Crear servicio',
          tags: ['Orden de Servicio'],
          responses: { 201: { description: 'Orden creada' } },
        },
      },
      '/ordenes/{id}': {
        get: {
          summary: 'Obtener por id',
          tags: ['Orden de Servicio'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Orden encontrada' } },
        },
        put: {
          summary: 'Actualizar servicio',
          tags: ['Orden de Servicio'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Orden actualizada' } },
        },
        delete: {
          summary: 'eliminar servicio',
          tags: ['Orden de Servicio'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Orden eliminada' } },
        },
      },

      // 📊 REPORTES
      '/reportes/generar': {
        get: {
          summary: 'Generar Reporte',
          tags: ['Reportes'],
          responses: { 200: { description: 'Reporte generado' } },
        },
      },
      '/reportes/historial': {
        get: {
          summary: 'Listar historial',
          tags: ['Reportes'],
          responses: { 200: { description: 'Historial obtenido' } },
        },
      },
      '/reportes/{id}': {
        put: {
          summary: 'Actualizar reporte',
          tags: ['Reportes'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Reporte actualizado' } },
        },
        delete: {
          summary: 'Eliminar reporte',
          tags: ['Reportes'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Reporte eliminado' } },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(swaggerOptions);