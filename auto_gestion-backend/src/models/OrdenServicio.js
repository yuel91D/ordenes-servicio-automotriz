const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrdenServicio = sequelize.define('OrdenServicio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'orden_servicio_id' // 🌟 Sincronizado: orden_servicio_id
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  tipoOrden: {
    type: DataTypes.STRING,
    field: 'tipo_orden' // 🌟 Sincronizado: tipo_orden
  },
  vehiculoId: {
    type: DataTypes.INTEGER,
    field: 'vehiculo_id' // 🌟 Llave foránea real: vehiculo_id
  }
}, {
  tableName: 'ordenes_servicio',
  timestamps: false
});

OrdenServicio.associate = (models) => {
  OrdenServicio.belongsTo(models.Vehiculo, { as: 'vehiculo', foreignKey: 'vehiculo_id' });
  OrdenServicio.hasMany(models.ItemOrden, { as: 'items', foreignKey: 'orden_servicio_id' });
};

module.exports = OrdenServicio;