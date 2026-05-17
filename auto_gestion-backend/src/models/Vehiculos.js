const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./cliente'); // 👈 Importamos el cliente para amarrar la relación

const Vehiculo = sequelize.define('Vehiculo', { // 🌟 Registrar en singular ayuda a Sequelize con los alias internos
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'vehiculos_id' 
  },
  // ... conserva aquí abajo tus propiedades de placa, kilometraje, etc ...
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

// 🔗 RELACIÓN: Un vehículo pertenece a un cliente
Vehiculo.belongsTo(Cliente, { as: 'cliente', foreignKey: 'clienteId' });

module.exports = Vehiculo;