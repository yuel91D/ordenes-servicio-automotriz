const app = require('./app');
const sequelize = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

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