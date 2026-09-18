const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrdenServicio = sequelize.define('OrdenServicio', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: false,
    field: 'orden_servicio_id'
  },
  fecha_ingreso: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'fecha_ingreso'
  },
  fecha_salida: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'fecha_salida'
  },
  tipo_orden: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'tipo_orden'
  },
  estado: {
    type: DataTypes.ENUM('Recibido', 'En proceso', 'Finalizado', 'Entregado', 'Cancelado'),
    allowNull: false,
    defaultValue: 'Recibido',
    field: 'estado'
  },
  tipo_pago: {
    type: DataTypes.ENUM('Efectivo', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Transferencia', 'Pendiente'),
    allowNull: false,
    defaultValue: 'Pendiente',
    field: 'tipo_pago'
  },
  vehiculo_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'vehiculo_id'
  }
}, {
  tableName: 'ordenes_servicio',
  timestamps: false,
  hooks: {
    beforeCreate: async (orden, options) => {
      let idExiste = true;
      let nuevoId;

      while (idExiste) {
        nuevoId = Math.floor(1000000000 + Math.random() * 9000000000);
        const [resultado] = await sequelize.query(
          `SELECT orden_servicio_id FROM ordenes_servicio WHERE orden_servicio_id = ${nuevoId} LIMIT 1`,
          { transaction: options.transaction }
        );
        
        if (resultado.length === 0) {
          idExiste = false;
        }
      }

      orden.id = nuevoId;
    }
  }
});

OrdenServicio.associate = (models) => {
  if (models && models.Vehiculo) {
    OrdenServicio.belongsTo(models.Vehiculo, { as: 'vehiculo', foreignKey: 'vehiculo_id' });
  }
  if (models && models.ItemOrden) {
    OrdenServicio.hasMany(models.ItemOrden, { as: 'items', foreignKey: 'orden_servicio_id' });
  }
};

module.exports = OrdenServicio;