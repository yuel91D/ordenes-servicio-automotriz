# 🚗 API de Gestión de Órdenes de Servicio Automotriz

¡Bienvenido al sistema backend definitivo para el control, monitoreo y facturación de talleres mecánicos! Desarrollado con una arquitectura desacoplada, segura, escalable y estructurada con visión de futuro para una inyección e integración total de una interfaz frontend.

Este sistema permite administrar clientes, vehículos, hojas de servicio y repuestos asignados en tiempo real, garantizando la integridad de los datos mediante validaciones estrictas y consultas optimizadas a la base de datos.

---

## 🚀 Características Principales

* **🛡️ Arquitectura Defensiva (Antifallas):** Sincronización limpia de modelos con Sequelize ORM.
* **⛓️ Cierre de Dependencias Circulares:** Control de flujo optimizado para evitar bucles de memoria en Node.js.
* **📊 Reportes Inteligentes:** Módulo de filtrado avanzado por rango de fechas (`Op.between`) con candados de seguridad lógicos.
* **🔒 Candados de Negocio Avanzados:**
    * Rebote automático si se intenta abrir una orden a un vehículo en estado **INACTIVO**.
    * Bloqueo preventivo en la capa de servicios si la **Fecha Fin** ingresada es menor a la **Fecha Inicio** (`400 Bad Request`).
* **🧼 Middleware Global de Errores:** Centralización total de excepciones de Express mediante `next(error)`, respondiendo con estatus HTTP semánticos (`201`, `400`, `404`, `500`).
* **🔌 Relaciones Complejas (Includes Avanzados):** Recuperación de Órdenes anidadas con sus respectivos Ítems, Vehículo y Dueño en un solo llamado.
* **📖 Documentación Interactiva (Swagger):** UI autogenerada y mapeada en JSON para pruebas rápidas desde el navegador.

---

## 🗺️ Roadmap & Visión de Futuro (Preparado para Frontend)

Este repositorio está diseñado bajo el principio de **Separación de Responsabilidades (SoC)**. El núcleo de la API está blindado y listo para integrarse sin fricciones con cualquier tecnología Frontend moderna (React, Vue, Angular o Vanilla JS):

* **🔌 CORS Totalmente Configurado:** Servidor con el middleware `cors()` activo, permitiendo peticiones asíncronas seguras (`fetch` / `axios`) desde entornos locales de desarrollo (Vite, Webpack, etc).
* **📦 Respuestas JSON Estandarizadas:** Cada endpoint responde con una estructura predecible (`success`, `data`, `message`), ideal para que los interceptores del Frontend manejen el estado global y las alertas visuales con suavidad.
* **🎨 Próxima Inyección Frontend:** Se proyecta la creación de la carpeta `/frontend` para montar un panel administrativo interactivo que consuma estos servicios en tiempo real, permitiendo a los usuarios gestionar el taller de manera visual.

---

## 🛠️ Tecnologías Utilizadas

* **Entorno de Ejecución:** Node.js
* **Framework Web:** Express.js
* **Base de Datos:** MySQL
* **Mapeo Objeto-Relacional (ORM):** Sequelize
* **Validación de Esquemas:** Joi / Validator.js
* **Documentación de API:** Swagger UI Express & Swagger JSDoc
* **Pruebas de Integración:** Postman

---

## 📦 Estructura del Proyecto

```text
├── backend/                # 🚀 Capa actual de la API (Node.js + Express)
│   ├── src/
│   │   ├── config/         # Configuración de base de datos y Swagger
│   │   ├── controllers/    # Controladores (Manejo de req, res y next)
│   │   ├── middlewares/    # Validaciones Joi y Middleware de Errores Globales
│   │   ├── models/         # Modelos Sequelize (MySQL)
│   │   ├── routes/         # Enrutadores de Express
│   │   └── services/       # Lógica de negocio y Candados de Seguridad
│   ├── app.js              # Inicialización de Express y Red de seguridad
│   └── server.js           # Arranque oficial del servidor backend
│
├── frontend/               # 🎨 ¡Próximamente! (Capa de Interfaz de Usuario)
│   └── ...                 # Estructura del cliente web (React / Vue / Vanilla JS)