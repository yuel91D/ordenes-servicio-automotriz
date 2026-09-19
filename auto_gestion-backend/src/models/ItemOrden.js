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
    type: DataTypes.BIGINT, // 🌟 Sin .UNSIGNED para que coincida con OrdenServicio
    field: 'orden_servicio_id',
    allowNull: false
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
    allowNull: false,
    field: 'valor_unitario'
  },
  // 🌟 MEJORA: Columna calculada automáticamente por MySQL (STORED)
  valorTotal: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'valor_total'
  }
}, {
  tableName: 'items_orden',
  timestamps: false,
  hooks: {
    beforeSave: (item) => {
      if (item.cantidad && item.valorUnitario) {
        item.valorTotal = Number(item.cantidad) * Number(item.valorUnitario);
      }
    }
  }
});

ItemOrden.associate = (models) => {
  if (models && models.OrdenServicio) {
    ItemOrden.belongsTo(models.OrdenServicio, { as: 'ordenServicio', foreignKey: 'orden_servicio_id' });
  }
};

module.exports = ItemOrden;