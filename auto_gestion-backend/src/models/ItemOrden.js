const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItemOrden = sequelize.define('ItemOrden', {
  item_orden_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'item_orden_id' // 🌟 Sincronizado: item_orden_id
  },
  orden_servicio_id: {
    type: DataTypes.INTEGER,
    field: 'orden_servicio_id' // 🌟 Sincronizado: orden_servicio_id
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valorUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'valor_unitario'
  }
}, {
  tableName: 'items_orden',
  timestamps: false
});

ItemOrden.associate = (models) => {
  ItemOrden.belongsTo(models.OrdenServicio, { as: 'ordenServicio', foreignKey: 'orden_servicio_id' });
};

module.exports = ItemOrden;