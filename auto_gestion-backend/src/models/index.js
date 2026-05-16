const Cliente = require('./cliente');
const Vehiculos = require('./Vehiculos');
const OrdenServicio = require('./OrdenServicio');
const ItemOrden = require('./ItemOrden');

// 1. Relación Cliente <-> Vehículos
Cliente.hasMany(Vehiculos, { foreignKey: 'cliente_id', as: 'vehiculos' });
Vehiculos.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

// 2. Relación Vehículos <-> OrdenServicio
Vehiculos.hasMany(OrdenServicio, { foreignKey: 'vehiculo_id', as: 'ordenes' });
OrdenServicio.belongsTo(Vehiculos, { foreignKey: 'vehiculo_id', as: 'vehiculo' });

// 3. Relación OrdenServicio <-> ItemOrden (¡Esta es la que fallaba al buscar el ID!)
OrdenServicio.hasMany(ItemOrden, { foreignKey: 'orden_servicio_id', as: 'items' });
ItemOrden.belongsTo(OrdenServicio, { foreignKey: 'orden_servicio_id', as: 'orden' });

module.exports = {
  Cliente,
  Vehiculos,
  OrdenServicio,
  ItemOrden
};