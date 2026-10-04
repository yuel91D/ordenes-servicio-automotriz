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
        XRoleHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'x-role',
          description: 'Cabecera de bypass para pruebas locales (ej: 1 o ADMIN)',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
        XRoleHeader: [],
      },
    ],
    
    paths: {
      // 🤖 AGENTE IA
      '/agente/atender': {
        post: {
          summary: 'Atender consulta u orquestación de acciones con el Agente de IA',
          description: 'Envía un prompt al agente. La IA analiza si debe realizar lecturas o ejecutar flujos secuenciales de escritura en cadena (Usuario -> Cliente -> Vehículo -> Orden).',
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
                      example: 'Hola, necesito crear una orden de servicio para Clint Barton con un Mustang 1969, correo cbarton@shield.com y falla en los frenos.',
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
              description: 'Respuesta generada y acciones ejecutadas por el agente de IA',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          respuesta: { type: 'string', example: '¡Hola! He creado la orden de servicio para Clint Barton...' },
                          accionesRealizadas: {
                            type: 'array',
                            items: { type: 'object' },
                            example: [
                              { herramienta: 'buscarCliente', parametros: { criterio: 'Clint Barton' }, resultado: { encontrado: false } },
                              { herramienta: 'crearUsuario', parametros: { email: 'cbarton@shield.com' }, resultado: { success: true, usuario: { id: 45 } } },
                              { herramienta: 'crearCliente', parametros: { id_usuario: 45, nombre: 'Clint Barton' }, resultado: { success: true, cliente: { id: 12 } } },
                              { herramienta: 'crearVehiculo', parametros: { id_cliente: 12, marca: 'Ford', modelo: 'Mustang', placa: 'HAWK-01' }, resultado: { success: true, vehiculo: { id: 8 } } },
                              { herramienta: 'crearOrdenServicio', parametros: { id_cliente: 12, id_vehiculo: 8, falla_reportada: 'Frenos' }, resultado: { success: true, orden: { id: 102 } } }
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
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' }
                  },
                },
              },
            },
          },
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

      // 🔐 AUTH
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
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string', example: 'Mecánico' }
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Rol creado' } },
        },
      },
      '/roles/{id}': {
        put: {
          summary: 'Actualizar rol',
          tags: ['Roles'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string', example: 'Jefe de Taller' }
                  },
                },
              },
            },
          },
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
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'thanos.snap@oscorp.fake' },
                    password: { type: 'string', example: 'secret123' },
                    id_rol: { type: 'integer', example: 2 },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Usuario creado' } },
        },
      },
      '/usuarios/{id}': {
        put: {
          summary: 'Actualizar usuario',
          tags: ['Usuarios'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'nuevo@shield.com' }
                  },
                },
              },
            },
          },
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
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string', example: 'Tony Stark' },
                    especialidad: { type: 'string', example: 'Motor y Electrónica' },
                    id_usuario: { type: 'integer', example: 1 },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Empleado creado' } },
        },
      },
      '/empleados/{id}': {
        put: {
          summary: 'Actualizar empleado',
          tags: ['Empleados'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    especialidad: { type: 'string', example: 'Diagnóstico avanzado' }
                  },
                },
              },
            },
          },
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
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string', example: 'Thanos de Titán' },
                    telefono: { type: 'string', example: '000-INVALIDO' },
                    email: { type: 'string', example: 'thanos.snap@oscorp.fake' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Cliente creado' } },
        },
      },
      '/clientes/{id}': {
        put: {
          summary: 'Actualizar cliente',
          tags: ['Clientes'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    telefono: { type: 'string', example: '555-7777' }
                  },
                },
              },
            },
          },
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
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    marca: { type: 'string', example: 'Ford' },
                    modelo: { type: 'string', example: 'Mustang' },
                    anio: { type: 'integer', example: 1969 },
                    placa: { type: 'string', example: 'HAWK-01' },
                    id_cliente: { type: 'integer', example: 1 },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Vehículo registrado' } },
        },
      },
      '/vehiculos/{id}': {
        put: {
          summary: 'Actualizar vehiculo',
          tags: ['Vehículos'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    placa: { type: 'string', example: 'HAWK-02' }
                  },
                },
              },
            },
          },
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
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id_cliente: { type: 'integer', example: 1 },
                    id_vehiculo: { type: 'integer', example: 1 },
                    falla_reportada: { type: 'string', example: 'Falla en los frenos' },
                    estado: { type: 'string', example: 'Recibido' },
                  },
                },
              },
            },
          },
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
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    estado: { type: 'string', example: 'En Proceso' }
                  },
                },
              },
            },
          },
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
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    descripcion: { type: 'string', example: 'Reporte actualizado del taller' }
                  },
                },
              },
            },
          },
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