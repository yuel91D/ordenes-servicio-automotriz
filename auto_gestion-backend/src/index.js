require('dotenv').config(); // ¡Esto es indispensable!

const app = require('./app');
const sequelize = require('./config/database');
const Usuario = require('./models/usuario');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Sincroniza el modelo con la BD
sequelize.sync({ alter: true }) // 'alter: true' actualiza la tabla si ya existe
  .then(() => console.log('✅ Tablas sincronizadas con éxito.'))
  .catch(err => console.error('❌ Error al sincronizar:', err));

// Aquí aplicamos tu excelente idea del .then y .catch
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