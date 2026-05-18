const sequelize = require('../config/database');
const Cliente = require('./cliente');
const Vehiculo = require('./vehiculos');
const OrdenServicio = require('./ordenServicio');
const ItemOrden = require('./itemOrden');

const models = {
  Cliente,
  Vehiculo,
  OrdenServicio,
  ItemOrden
};

// 🔄 Ejecuta las asociaciones de forma automática y segura
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};