const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItemOrden = sequelize.define('ItemOrden', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'item_orden_id' // 🔥 Sincronizado con MySQL
  },
  // 👇 AGREGAMOS ESTE BLOQUE CRÍTICO PARA LA RELACIÓN
  ordenServicioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'orden_servicio_id' // 🔥 Sincronizado con el nombre real en MySQL
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
    field: 'valor_unitario'
  }
}, {
  tableName: 'items_orden',
  timestamps: false
});

module.exports = ItemOrden;