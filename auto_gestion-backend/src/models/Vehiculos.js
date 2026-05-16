const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehiculos = sequelize.define('Vehiculos', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'vehiculos_id' // 🔥 Nombre exacto en tu tabla MySQL
  },
  // ... conserva aquí abajo las propiedades de placa, kilometraje, etc., tal como las tenías ...
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    allowNull: false
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'cliente_id'
  }
}, {
  tableName: 'vehiculos',
  timestamps: false
});

module.exports = Vehiculos;