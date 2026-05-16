const Cliente = require('./cliente');
const Vehiculos = require('./Vehiculos');
const OrdenServicio = require('./OrdenServicio');
const ItemOrden = require('./ItemOrden');

// 1. CLIENTE -> VEHICULOS
Cliente.hasMany(Vehiculos, { foreignKey: 'cliente_id', as: 'vehiculos' });
Vehiculos.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

// 2. VEHICULOS -> ORDENES
Vehiculos.hasMany(OrdenServicio, { foreignKey: 'vehiculo_id', as: 'ordenes' });
OrdenServicio.belongsTo(Vehiculos, { foreignKey: 'vehiculo_id', as: 'vehiculo' });

// 3. ORDEN -> ITEMS
OrdenServicio.hasMany(ItemOrden, { foreignKey: 'orden_servicio_id', as: 'items' });
ItemOrden.belongsTo(ItemOrden, { foreignKey: 'orden_servicio_id', as: 'orden' });

module.exports = {
  Cliente,
  Vehiculos,
  OrdenServicio,
  ItemOrden
};