# 🚗 Auto Gestión Backend - Sistema de Órdenes de Servicio Automotriz

Bienvenido a la documentación oficial de **Auto Gestión Backend**, la API RESTful diseñada para centralizar, automatizar y gestionar integralmente la operación de talleres automotrices: desde el control de acceso de usuarios y empleados hasta la gestión completa de clientes, vehículos, servicios y órdenes de trabajo.

---

## 📐 Arquitectura del Sistema: Clean Architecture (MVC por Capas)

El proyecto adopta una arquitectura desacoplada y escalable dividida en **Capas de Responsabilidad Única**. Esta separación garantiza que las rutas sean delgadas, los controladores solo manejen el ciclo de petición/respuesta HTTP, los servicios ejecuten la lógica de negocio pura y los modelos interactúen de forma limpia con la base de datos a través de Sequelize ORM.

```
auto_gestion-backend/
├── src/
│   ├── config/          # Configuración de base de datos (PostgreSQL/MySQL), variables de entorno y Sequelize
│   ├── controllers/     # Capa de presentación HTTP (Peticiones, Respuestas, HTTP Status Codes)
│   ├── middlewares/     # Middlewares de seguridad (JWT), validación de payloads y manejo global de errores
│   ├── models/          # Modelos relacionales e índices de Sequelize (Associations & Hooks)
│   ├── routes/          # Enrutadores delgados Express (Rutas expuestas sin lógica inline)
│   ├── services/        # Capa de Lógica de Negocio (Transacciones, Reglas de Dominio, Consultas ORM)
│   └── utils/           # Encriptación (Bcrypt), Generadores de Tokens JWT, Formateadores y Constants
├── .env.example         # Plantilla de variables de entorno requeridas
├── .gitignore            # Archivos excluidos del control de versiones
├── package.json         # Dependencias del proyecto y scripts ejecutables
└── README.md            # Documentación general y guía de integración
```

### Flujo Interno de Ejecución
`Cliente / Frontend` ➡️ `Ruta (Express Router)` ➡️ `Middleware (Auth / Validation)` ➡️ `Controlador` ➡️ `Servicio (Business Logic)` ➡️ `Modelo (Sequelize ORM)` ➡️ `Base de Datos`

---

## 🛠️ Tecnologías y Stack Principal

* **Core**: Node.js & Express.js (JavaScript ES6+).
* **Base de Datos & ORM**: Sequelize ORM con soporte relacional completo.
* **Seguridad & Autenticación**: JWT (JSON Web Tokens) y BcryptJS para hashing de contraseñas.
* **Estandarización de Código**: Clean Architecture, REST Standards, Conventional Commits.
* **Control de Versiones**: Git, GitHub, GitLab y Semantic Versioning (`vX.Y.Z`).

---

## 🛢️ Estructura de Base de Datos y Modelo de Estado (Soft Delete)

Todos los módulos del sistema implementan el estándar unificado de auditoría y borrado lógico mediante la columna **`estado`** de tipo `CHAR(1)`:
* `'S'` ➡️ **Activo / Disponible**
* `'N'` ➡️ **Inactivo / Eliminado Lógicamente**

### Tabla de Entidades y Estados

| Entidad / Tabla | Columna Estado | Tipo Dato | Descripción / Comportamiento |
| :--- | :--- | :--- | :--- |
| `usuarios` | `estado` | `CHAR(1)` | Control de acceso al sistema (`'S'` Activo, `'N'` Suspendido). |
| `empleados` | `estado` | `CHAR(1)` | Personal operativo/administrativo (`'S'` Activo, `'N'` Inactivo). |
| `clientes` | `estado` | `CHAR(1)` | Propietarios de vehículos (`'S'` Activo, `'N'` Inactivo). |
| `vehiculos` | `estado` | `CHAR(1)` | Automóviles registrados en el taller (`'S'` Activo, `'N'` Inactivo). |
| `ordenes_servicio` | `estado` | `VARCHAR` / `CHAR` | Estado operativo de la orden (`PENDIENTE`, `EN_PROCESO`, `COMPLETADA`, `CANCELADA`). |
| `items_orden` | `estado` | `CHAR(1)` | Servicios/repuestos asociados a la orden (`'S'` / `'N'`). |

---

## 📑 Módulos y Catálogo de Endpoints

### 🔑 1. Autenticación (`/auth`)
* `POST /auth/login`: Autenticación de usuarios con entrega de Token JWT y datos de perfil.

### 👤 2. Módulo de Usuarios (`/usuarios`)
* `GET /usuarios`: Lista todos los usuarios registrados e incluye su rol asignado (`rolDelUsuario`).
* `POST /usuarios`: Registro de nuevo usuario con contraseña encriptada via Bcrypt.
* `PUT /usuarios/:id`: Actualización de perfiles o credenciales de acceso.
* `DELETE /usuarios/:id`: Desactivación lógica de usuario (`estado = 'N'`).

### 👥 3. Módulo de Empleados (`/empleados`)
* `GET /empleados`: Lista por defecto los empleados **activos** (`estado = 'S'`) integrando la relación con su usuario asignado.
* `GET /empleados?incluirInactivos=true`: Consulta de auditoría que recupera la totalidad de empleados (activos e inactivos).
* `GET /empleados/:id`: Detalle individual de un empleado por ID.
* `POST /empleados`: Creación de registro de empleado vinculado a la entidad usuario.
* `PUT /empleados/:id`: Edición de datos personales, cargos o áreas del empleado.
* `DELETE /empleados/:id`: Inactivación lógica (`estado = 'N'`) o eliminación física según reglas de integridad referencial.

### 📋 4. Módulo de Órdenes de Servicio (`/ordenes-servicio`)
* `GET /ordenes-servicio`: Consulta general de órdenes de servicio registradas.
* `POST /ordenes-servicio`: Apertura de nueva orden de trabajo con asignación de cliente, vehículo y técnico.
* `PUT /ordenes-servicio/:id`: Actualización de estado operativo o detalles de la orden.
* `GET /ordenes-servicio/:id/total`: Cálculo dinámico y visualización del campo generado `valor_total` sumando ítems y mano de obra.

---

## 📜 Historial de Versiones y Evolución del Proyecto

### 🚀 **v1.4.0 (Versión Actual)** - *Unificación de Arquitectura, Servicio de Empleados & Auditoría*
* **Desacoplamiento Total de Controladores**: Se refactorizaron las rutas de `usuarios` y `empleados` creando controladores formales (`usuarioController.js`, `empleadoController.js`) eliminando toda lógica inline en el enrutador.
* **Capa de Servicio de Empleados (`empleadoService.js`)**: Creación de la capa de servicio dedicada para encapsular las consultas Sequelize, inclusiones relacionales (`include`) y reglas de negocio de empleados.
* **Filtrado Dinámico de Inactivos**: Implementación de soporte para auditoría vía query params (`?incluirInactivos=true`) permitiendo consultar registros con `estado = 'N'` sin romper las búsquedas por defecto.
* **Estandarización de Borrado**: Homogeneización de borrado lógico (`estado = 'N'`) y eliminación física condicional.

---

### 🛡️ **v1.3.0** - *Autenticación, Seguridad y Gestión de Sesiones*
* **Integración de Bcrypt**: Encriptación estandarizada mediante hashing de contraseñas al registrar o actualizar usuarios.
* **Implementación de JWT (JSON Web Tokens)**: Generación y verificación de tokens de autenticación para protección de endpoints privados.
* **Middleware de Protección**: Desarrollo de middlewares para validar la presencia y validez de los tokens en las peticiones HTTP (`Authorization: Bearer <token>`).

---

### 🔗 **v1.2.0** - *Modelado Relacional Avanzado y Sequelize ORM*
* **Definición de Relaciones entre Entidades**: Implementación de asociaciones relacionales (`hasOne`, `belongsTo`, `hasMany`) entre `Usuarios`, `Empleados`, `Clientes`, `Vehículos` y `Órdenes de Servicio`.
* **Carga Ansiosa (Eager Loading)**: Optimización de consultas Sequelize utilizando `include` para retornar entidades anidadas en un solo llamado a la base de datos.

---

### ⚙️ **v1.1.0** - *Mantenimientos Base y Estructuración Arquitectónica*
* **Definición de Capas Básicas**: Migración del código inicial monolítico hacia una estructura orientada a carpetas de `routes`, `controllers` y `models`.
* **Mantenimiento CRUD**: Creación de endpoints base para las operaciones de creación, lectura, actualización y eliminación de los módulos del taller.

---

### 🎉 **v1.0.0** - *Certificación del Módulo Core de Órdenes de Servicio*
* **Certificación Inicial**: Lanzamiento de la primera versión operativa con el ciclo de vida funcional de las órdenes de servicio automotrices.
* **Campo Generado `valor_total`**: Implementación de la lógica de cálculo dinámico para determinar el valor total acumulado de servicios e ítems por orden.

---

## 💻 Guía de Instalación y Despliegue Local

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd auto_gestion-backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto basándote en la plantilla:
```env
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASS=tu_contraseña
DB_NAME=auto_gestion_db
DB_PORT=5432
JWT_SECRET=secreto_super_seguro_jwt
```

### 4. Iniciar la aplicación
```bash
# Modo Desarrollo
npm run dev

# Modo Producción
npm start
```

---

## 🔄 Flujo Estándar de Versionado y Despliegue (Git Flow)

Todas las contribuciones y actualizaciones del proyecto siguen el procedimiento estandarizado:

1. **Desarrollo**: Todo trabajo se realiza en la rama `feature/secundaria`.
2. **Commits**: Mensajes estructurados bajo la convención **Conventional Commits** (`feat(módulo): descripción`).
3. **Merge & Tagging**: Fusión hacia `main`, etiquetado semántico del release (`vX.Y.Z`) y despliegue sincronizado:

```bash
git add .
git commit -m "docs(readme): actualizar arquitectura, historial v1.4.0 y endpoints"
git checkout main
git merge feature/secundaria
git tag -a v1.4.1 -m "Versión 1.4.1: Documentación del README extendida"
git push origin main --tags
git checkout feature/secundaria
```