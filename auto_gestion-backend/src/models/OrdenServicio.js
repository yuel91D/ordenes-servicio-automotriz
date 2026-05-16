const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Vehiculos = require('./Vehiculos');

const OrdenServicio = sequelize.define('OrdenServicio', {
  ordenServicioId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'orden_servicio_id'
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  tipoOrden: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'tipo_orden'
  },
  vehiculoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'vehiculo_id',
    references: {
      model: Vehiculos, 
      key: 'vehiculos_id'
    }
  }
}, {
  tableName: 'ordenes_servicio',
  timestamps: false
});

// ❌ REVISA AQUÍ: Borra o comenta estas líneas para que no dupliquen al index.js
// Vehiculos.hasMany(OrdenServicio, { foreignKey: 'vehiculo_id', as: 'ordenes' });
// OrdenServicio.belongsTo(Vehiculos, { foreignKey: 'vehiculo_id', as: 'vehiculo' });

module.exports = OrdenServicio;