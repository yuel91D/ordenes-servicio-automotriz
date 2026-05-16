const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrdenServicio = sequelize.define('OrdenServicio', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'orden_servicio_id' // 🔥 Mapea tu llave primaria real
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  tipoOrden: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'tipo_orden'
  },
  vehiculoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'vehiculo_id' // 🔥 Sincronizado con la columna de tu tabla
  }
}, {
  tableName: 'ordenes_servicio',
  timestamps: false
});

module.exports = OrdenServicio;