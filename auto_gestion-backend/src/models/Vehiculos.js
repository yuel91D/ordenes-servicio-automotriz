const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehiculo = sequelize.define('Vehiculo', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: false,
    field: 'vehiculos_id'
  },
  placa: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  anio: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipoVehiculo: {
    type: DataTypes.STRING,
    field: 'tipo_vehiculo'
  },
  kilometraje: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: true
  },
  propietario: {
    type: DataTypes.STRING
  },
  cliente_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'cliente_id'
  }
}, {
  tableName: 'vehiculos',
  timestamps: false
});

module.exports = Vehiculo;