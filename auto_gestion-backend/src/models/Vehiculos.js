const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehiculo = sequelize.define('Vehiculo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'vehiculos_id' // 🌟 EXACTO como en tu captura: vehiculos_id
  },
  placa: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipoVehiculo: {
    type: DataTypes.STRING,
    field: 'tipo_vehiculo' // 🌟 Sincronizado con tipo_vehiculo
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
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'cliente_id' // 🌟 cliente_id
  }
}, {
  tableName: 'vehiculos',
  timestamps: false
});

Vehiculo.associate = (models) => {
  Vehiculo.belongsTo(models.Cliente, { as: 'cliente', foreignKey: 'cliente_id' });
  Vehiculo.hasMany(models.OrdenServicio, { as: 'ordenes', foreignKey: 'vehiculo_id' });
};

module.exports = Vehiculo;