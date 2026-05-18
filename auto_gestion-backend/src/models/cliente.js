const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'clientes',
  timestamps: false
});

// 🌟 Función estática para asociar de forma segura sin romper Node
Cliente.associate = (models) => {
  Cliente.hasMany(models.Vehiculo, { as: 'vehiculos', foreignKey: 'clienteId' });
};

module.exports = Cliente;