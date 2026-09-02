# Sistema de Órdenes de Servicio Automotriz - Documentación del Proyecto

## 1. Arquitectura del Proyecto
El proyecto sigue una arquitectura **MVC (Modelo-Vista-Controlador)** desacoplada, orientada a servicios backend con una API REST robusta. 
- **Capa de Base de Datos:** MySQL gestionado a través de **Sequelize ORM**, asegurando integridad referencial estricta, mapeo de modelos en `snake_case` y sincronización automatizada.
- **Capa de Enrutamiento y Controladores:** Estructura modular para manejar usuarios, roles, clientes, vehículos y órdenes de servicio.
- **Control de Acceso:** Sistema basado en Roles (**RBAC**) con relaciones relacionales normalizadas por medio de llaves foráneas (`rol_id`).

---

## 2. Tecnologías y Dependencias
- **Entorno de Ejecución:** Node.js
- **Framework Web:** Express.js
- **Base de Datos:** MySQL
- **ORM:** Sequelize
- **Gestión de Entorno:** dotenv
- **Herramientas de Desarrollo:** Nodemon (recarga en caliente)

---

## 3. Archivos y Módulos Clave Configurados
- `src/index.js`: Archivo principal que inicializa el servidor, autentica la conexión a Sequelize, sincroniza los modelos y ejecuta la siembra inicial (seeders) de roles.
- `src/app.js`: Configuración de middlewares y rutas globales de la aplicación Express.
- `src/config/database.js`: Conexión centralizada a la base de datos MySQL con variables de entorno.
- `src/models/Rol.js`: Modelo Sequelize para la tabla `roles` con soporte de timestamps y mapeo explícito de campos.
- `src/models/usuario.js`: Modelo Sequelize para la gestión de usuarios y su relación asociativa con los roles.

---

## 4. Endpoints y Funcionalidades del Sistema
- **Módulo de Autenticación / Roles:**
  - Inserción automática de roles por defecto al arrancar el servidor (`admin`, `vendedor`, `cliente`).
  - Relación relacional integrada (`hasMany` / `belongsTo`) entre `Usuarios` y `Roles` mediante `rol_id`.
- **Módulos Operativos (Automotriz):**
  - Gestión de Clientes, Empleados, Vehículos, Órdenes de Servicio y Exportaciones de reportes.

---

## 5. Comandos de Ejecución
- **Instalación de dependencias:**
  ```bash
  npm install
  ```
- **Iniciar servidor en modo desarrollo (con Nodemon):**
  ```bash
  npm run dev
  ```
- **Iniciar en producción:**
  ```bash
  npm start
  ```

---

## 6. Tareas Pendientes y Próximos Pasos
- [ ] Actualizar la colección de **Postman** para migrar las peticiones de creación y actualización de usuarios del antiguo campo de texto (`rol`) al nuevo formato numérico por identificador (`rol_id`).
- [ ] Implementar los controladores y rutas de validación JWT para la protección de endpoints bajo el modelo RBAC.
- [ ] Ampliar los módulos de órdenes de servicio y generación de reportes en múltiples formatos (CSV, XLSX, PDF, HTML).
