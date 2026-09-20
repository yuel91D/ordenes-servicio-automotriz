const sequelize = require('../config/database');
const Cliente = require('./cliente');
const Vehiculo = require('./Vehiculo');
const OrdenServicio = require('./OrdenServicio');
const ItemOrden = require('./ItemOrden');
const Exportacion = require('./exportacion');
const Usuario = require('./usuario');
const Rol = require('./rol');
const Empleado = require('./empleado');

const models = {
  Cliente,
  Vehiculo,
  OrdenServicio,
  ItemOrden,
  Exportacion,
  Usuario,
  Rol,
  Empleado
};

// 🔄 Ejecuta las asociaciones de forma automática
Object.entries(models).forEach(([modelName, model]) => {
  console.log(`Verificando modelo: ${modelName} -> Tipo:`, typeof model);
  if (model && typeof model.associate === 'function') {
    model.associate(models);
  }
});
 
module.exports = {
  sequelize,
  ...models
};