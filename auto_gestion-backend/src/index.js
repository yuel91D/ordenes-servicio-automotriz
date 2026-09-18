require('dotenv').config(); // ¡Esto es indispensable!

const app = require('./app');
const sequelize = require('./config/database');
const Usuario = require('./models/usuario');
const Rol = require('./models/rol'); // <-- 1. Importamos el modelo Rol

const PORT = process.env.PORT || 3000;

// Sincroniza el modelo con la BD
sequelize.sync({ alter: true }) // 'alter: true' actualiza la tabla si ya existe
  .then(async () => {
    console.log('✅ Tablas sincronizadas con éxito.');

    // 2. Insertamos los roles por defecto usando findOrCreate para evitar duplicados
    try {
      await Rol.findOrCreate({
        where: { nombre: 'admin' },
        defaults: { descripcion: 'Administrador del sistema' }
      });

      await Rol.findOrCreate({
        where: { nombre: 'vendedor' },
        defaults: { descripcion: 'Personal de ventas y atención' }
      });

      await Rol.findOrCreate({
        where: { nombre: 'cliente' },
        defaults: { descripcion: 'Cliente del sistema' }
      });

      console.log('🛡️ Roles iniciales verificados/creados correctamente.');
    } catch (error) {
      console.error('❌ Error al insertar los roles iniciales:', error);
    }
  })
  .catch(err => console.error('❌ Error al sincronizar:', err));

// Autenticación y encendido del servidor
sequelize.authenticate()
  .then(() => {
    console.log('📦 Base de datos conectada con Sequelize con éxito.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch(error => {
    console.error('❌ Error conexión DB:', error);
  });