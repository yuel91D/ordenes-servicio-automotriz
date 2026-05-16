const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItemOrden = sequelize.define('ItemOrden', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valorUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'valor_unitario' // Asegura el snake_case de tu base de datos
  }
}, {
  tableName: 'items_orden',
  timestamps: false
});

module.exports = ItemOrden;